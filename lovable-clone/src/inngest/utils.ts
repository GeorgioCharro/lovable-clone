import { Sandbox} from "@e2b/code-interpreter";

/**
 * Connects to an existing E2B sandbox instance
 * @param sandboxId - The unique identifier of the sandbox to connect to
 * @returns Promise that resolves to the connected Sandbox instance
 * @throws Error if sandboxId is invalid or connection fails
 */
export async function getSandbox(sandboxId: string): Promise<Sandbox> {
    // Validate input
    if (!sandboxId || typeof sandboxId !== 'string' || sandboxId.trim().length === 0) {
        throw new Error('Invalid sandboxId: must be a non-empty string');
    }

    try {
        const sandbox = await Sandbox.connect(sandboxId);
        return sandbox;
    } catch (error) {
        throw new Error(`Failed to connect to sandbox ${sandboxId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}