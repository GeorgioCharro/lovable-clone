import { inngest } from "./client";
import { openai, createAgent, createTool, createNetwork, type Tool, type Message, createState } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, rememberSandbox, getSandboxUrl, lastAssistantTextMessageContent, parseAgentOutput } from "./utils";
import { z } from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompts";
import prisma from "@/lib/db";

interface AgentState {
  summary: string;
  files: { [path: string]: string }
}




export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    // 1) Create sandbox and cache it immediately
    const { sandboxId } = await step.run("create-sandbox", async () => {
      const sandbox = await Sandbox.create("lovable-clone-nextjs-3");
      rememberSandbox(sandbox);

      await sandbox.setTimeout(60_000 * 10 * 3);
      return { sandboxId: sandbox.sandboxId };
    });

    const previousMessages = await step.run("get-previous-messages", async () => {
      const formattedMessages: Message[] = [];

      const messages = await prisma.message.findMany({
        where: {
          projectId: event.data.projectId,
        },
        orderBy: {
          createdAt: "desc", // TODO: Change to asc incase AI doesn;t understand what is the latest message
        },
        
        take: 5,

      });

      for (const message of messages) {
        formattedMessages.push({
          type: "text",
          role: message.role === "ASSISTANT" ? "assistant" : "user",
          content: message.content,
        });
      }

      return formattedMessages.reverse(); // Reverse to maintain chronological order
    });

    const state = createState<AgentState>({
      summary: "",
      files: {},
    },
      {
        messages: previousMessages
      }
    )


    const generateResponse =  () => {
    const output = responseOutput[0]
    if (output.type !== "text") {
      return "Here you go";
    }
    if (Array.isArray(output.content)) {
      return output.content.map( (txt) => txt ).join("");
    } else {
      return output.content;
    }

  }

    // 2) Build the coding agent with tools that always (re)connect via getSandbox(...)
    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      system: PROMPT,
      description: "An expert coding agent",
      model: openai({
        model: "gpt-4.1",
        defaultParameters: { temperature: 0.1 },
      }),
      tools: [
        // Terminal
        createTool({
          name: "terminal",
          description: "Use the terminal to run a command",
          parameters: z.object({ command: z.string() }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => { buffers.stdout += data; },
                  onStderr: (data: string) => { buffers.stderr += data; },
                });
                return {
                  stdout: result.stdout || buffers.stdout,
                  stderr: result.stderr || buffers.stderr,
                  exitCode: result.exitCode,
                  success: result.exitCode === 0,
                };
              } catch (e) {
                return {
                  stdout: buffers.stdout,
                  stderr: buffers.stderr,
                  exitCode: -1,
                  success: false,
                  error: (e as Error).message,
                };
              }
            });
          },
        }),

        // Create/Update Files
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(z.object({ path: z.string(), content: z.string() })),
          }),
          handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
            const newFiles = await step?.run("createOrUpdateFiles", async () => {
              try {
                const updatedFiles = (network.state.data.files as Record<string, string>) || {};
                const sandbox = await getSandbox(sandboxId);
                for (const f of files) {
                  await sandbox.files.write(f.path, f.content);
                  updatedFiles[f.path] = f.content;
                }
                return updatedFiles;
              } catch (e) {
                return { success: false, error: (e as Error).message };
              }
            });

            if (typeof newFiles === "object" && newFiles && !("success" in newFiles)) {
              network.state.data.files = newFiles;
            }
            return newFiles;
          },
        }),

        // Read Files
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({ files: z.array(z.string()) }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents: Array<{ path: string; content: string }> = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch {
                throw new Error("Failed to read files");
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const last = lastAssistantTextMessageContent(result);
          if (last && network && last.includes("<task_summary>")) {
            network.state.data.summary = last;
          }
          return result;
        },
      },
    });

    // 3) Network setup
    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) return; // stop when summary exists
        return codeAgent;
      },
    });

    // 4) Run agent on the event payload
    const result = await network.run(event.data.value, { state });
    const fragmentTitleGenerator = createAgent( {

      name: "fragment-title-generator",
      system: FRAGMENT_TITLE_PROMPT,
      description: "An expert fragment title generator",
      model: openai({
        model: "gpt-4o",
      }),
    })

    const responseGenerator = createAgent( {

      name: "response-generator",
      system: RESPONSE_PROMPT,
      description: "An expert response generator",
      model: openai({
        model: "gpt-4o",
      }),
    })

  const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(result.state.data.summary);
  const { output: responseOutput } = await responseGenerator.run(result.state.data.summary);  
    


  
  
  const isError = !result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0;
    // 5) Get the public URL (don’t kill the sandbox prematurely)
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      return await getSandboxUrl(sandboxId, 3000);
    });

    // Optional: only kill if explicitly requested
    if (process.env.KILL_SANDBOX_ON_EXIT === "true") {
      try {
        await Sandbox.kill(sandboxId);
      } catch (e) {
        console.error("Failed to kill sandbox:", e);
      }
    }
    await step.run("save-result", async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Error occurred please try again",
            role: "ASSISTANT",
            type: "ERROR",
          }
        });
      }
      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: parseAgentOutput(responseOutput),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: parseAgentOutput(fragmentTitleOutput),
              files: result.state.data.files,
            }
          }
        }
      })
    })
    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
      sandboxId,
    };
  }
);
