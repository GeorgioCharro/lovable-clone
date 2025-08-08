import { Sandbox} from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";

export async function getSandbox(sandboxId: string) {
    const sandbox = await Sandbox.connect(sandboxId);
    return sandbox

}

export function lastAssistantTextMessageContent( result: AgentResult) {
    // Use a fallback approach for compatibility with older runtimes
    const messages = [...result.output].reverse();
    const lastAssistantIndex = messages.findIndex(
        (message) => message.role === "assistant"
    );
    
    if (lastAssistantIndex === -1) {
        return undefined;
    }
    
    // Calculate the original index
    const originalIndex = result.output.length - 1 - lastAssistantIndex;
    const message = result.output[originalIndex] as TextMessage | undefined;
    return message?.content ? typeof message.content === "string" ? message.content : message.content.map((c)=>c.text).join(""): undefined

}