import { Sandbox } from "@e2b/code-interpreter";
import type { AgentResult, Message, TextMessage } from "@inngest/agent-kit";

// Simple per-process cache
const SANDBOX_CACHE = new Map<string, Sandbox>();

export function rememberSandbox(sb: Sandbox) {
  SANDBOX_CACHE.set(sb.sandboxId, sb);
}

export async function getSandbox(sandboxId: string): Promise<Sandbox> {
  // 1) Return cached instance if present
  const cached = SANDBOX_CACHE.get(sandboxId);
  if (cached) return cached;

  // 2) Re-attach: try both known signatures to be SDK-version-safe
  let sb: Sandbox | undefined;
  try {
    // Newer SDKs: connect({ sandboxId })
    // @ts-expect-error – compatibility with multiple SDK versions
    sb = await Sandbox.connect({ sandboxId });
  } catch {
    // Older SDKs: connect(sandboxId)
    sb = await Sandbox.connect(sandboxId);
  }

  if (!sb) {
    throw new Error(`Failed to connect to sandbox ${sandboxId}: no instance returned.`);
  }

  SANDBOX_CACHE.set(sb.sandboxId, sb);
  return sb;
}

export async function getSandboxUrl(sandboxId: string, port: number): Promise<string> {
  const sb = await getSandbox(sandboxId);
  const host = sb.getHost(port);
  if (!host) {
    throw new Error(`Sandbox ${sandboxId} did not expose port ${port}. Did your app start?`);
  }
  return `https://${host}`;
}

export function lastAssistantTextMessageContent(result: AgentResult) {
  // Fallback-compatible extraction
  const messages = [...result.output].reverse();
  const lastAssistantIndex = messages.findIndex((m) => m.role === "assistant");
  if (lastAssistantIndex === -1) return undefined;

  const originalIndex = result.output.length - 1 - lastAssistantIndex;
  const message = result.output[originalIndex] as TextMessage | undefined;

  if (!message?.content) return undefined;
  return typeof message.content === "string"
    ? message.content
    : message.content.map((c) => c.text).join("");
}


export  const parseAgentOutput =  (value: Message[]) => {
    const output = value[0];
    if (output.type !== "text") {
      return "Fragment";
    }
    if (Array.isArray(output.content)) {
      return output.content.map( (txt) => txt ).join("");
    } else {
      return output.content;
    }

  }
