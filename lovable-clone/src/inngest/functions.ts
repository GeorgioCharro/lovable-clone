import { inngest } from "./client";
import { openai, createAgent, createTool, createNetwork } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { z } from "zod";
import { PROMPT } from "@/prompts";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const { sandboxId, sandbox } = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("lovable-clone-nextjs-3");
      return { sandboxId: sandbox.sandboxId, sandbox };
    });

    try {

    const codeAgent = createAgent({
      name: "code-agent",
      system: PROMPT,
      description: "An expert coding agent",
      model: openai({ 
        model: "gpt-4.1",
        defaultParameters: {
          temperature: 0.1,
        },
        }),
      tools: [
        // ✅ Terminal Tool
        createTool({
          name: "terminal",
          description: "Use the terminal to run a command",
          parameters: z
            .object({
              command: z.string(),
            }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };

              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  },
                });

                return {
                  stdout: result.stdout || buffers.stdout,
                  stderr: result.stderr || buffers.stderr,
                  exitCode: result.exitCode,
                  success: result.exitCode === 0
                };
              } catch (e) {
                console.error(
                  `Command Failed: ${e}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`
                );
                return {
                  stdout: buffers.stdout,
                  stderr: buffers.stderr,
                  exitCode: -1,
                  success: false,
                  error: (e as Error).message
                };
              }
            });
          },
        }),

        // ✅ File Creation/Update Tool
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z
            .object({
              files: z.array(
                z.object({
                  path: z.string(),
                  content: z.string(),
                })
              ),
            }),
          handler: async ({ files }, { step, network }) => {
            const newFiles = await step?.run("createOrUpdateFiles", async () => {
              try {
                const updatedFiles = network.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }
                return updatedFiles;
              } catch (e) {
                console.error("Failed to write files:", e);
                return {
                  success: false,
                  error: (e as Error).message,
                };
              }
            });

            if (typeof newFiles === "object" && !("success" in newFiles)) {
              network.state.data.files = newFiles;
            }

            return newFiles;
          },
        }),
      createTool({
        name: "readFiles",
        description: "Read Files from the sandbpx",
        parameters: z.object({
          files: z.array(z.string()),
        }),
        handler: async ( { files }, { step }) => {
          return await step?.run("readFiles", async () =>{
            try {
              const sandbox = await getSandbox(sandboxId);
              const contents = [];
              for (const file of files){
                const content = await sandbox.files.read(file);
                contents.push({ path: file, content });
              }
              return JSON.stringify(contents)
            } catch (e) {
              console.error("Error reading files:", e);
              throw new Error("Failed to read files");
            }
          })
        }
      })
      
      ],
      lifecycle: {
        onResponse: async ({ result, network}) => {
          const lastAssistantMessageText = lastAssistantTextMessageContent(result);
        if (lastAssistantMessageText && network) {
          if (lastAssistantMessageText.includes("<task_summary>")){
            network.state.data.summary = lastAssistantMessageText
          }
        }
        return result;
        }
      },
    
      });
      const network = createNetwork({
        name: "coding-agent-network",
        agents: [codeAgent],
        maxIter: 15,
        router: async ({ network })=> {
          const summary= network.state.data.summary;
        
        if (summary) {
          return;
        }
        return codeAgent;
        }
      });

    const result = await network.run(event.data.value)

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return {url:sandboxUrl ,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary
    };
    } finally {
      // Clean up the sandbox to prevent resource leaks
      try {
        await Sandbox.kill(sandboxId);
      } catch (e) {
        console.error("Failed to kill sandbox:", e);
      }
    }
  }
);
