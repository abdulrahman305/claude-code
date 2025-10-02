import { z } from "zod";
import { JSONRPCClient } from "json-rpc-2.0";
import { ToolRegistrationInput, JsonSchemaInput } from "./types";
import debug from "debug";
import { ChatCompletionTool, ChatCompletionMessageToolCall } from "openai/resources/chat/completions";
export declare const log: debug.Debugger;
/**
 * The AgentRPC client.
 *
 * ```ts
 * // create a new AngentRPC instance
 * const rpc = new AgentRPC({
 *  apiSecret: "API_SECRET",
 * });
 *
 *
 * // Register a tool
 * client.register("hello", z.object({name: z.string()}), async ({name}: {name: string}) => {
 *  return `Hello ${name}`;
 * })
 *
 * await client.listen();
 *
 * // stop the service on shutdown
 * process.on("beforeExit", async () => {
 *   await myService.stop();
 * });
 *
 * ```
 */
export declare class AgentRPC {
    static getVersion(): string;
    private clusterId;
    private apiSecret;
    private endpoint;
    private machineId;
    jsonRpcClient: JSONRPCClient;
    private pollingAgents;
    private toolsRegistry;
    /**
     * Initializes a new AgentRPC instance.
     * @param apiSecret The API Secret for your AgentRPC cluster. If not provided, it will be read from the `INFERABLE_API_SECRET` environment variable.
     * @param options Additional options for the AgentRPC client.
     * @param options.endpoint The endpoint for the AgentRPC cluster. Defaults to https://api.agentrpc.com.
     *
     * @example
     * ```ts
     * // Basic usage
     * const rpc = new AgentRPC({
     *  apiSecret: "API_SECRET",
     * });
     * ```
     */
    constructor(options?: {
        apiSecret?: string;
        endpoint?: string;
        machineId?: string;
        mcpUuid?: string;
        mcpApp?: string;
        mcpSessionId?: string;
        mcpChatId?: string;
    });
    OpenAI: {
        getTools: () => Promise<ChatCompletionTool[]>;
        executeTool: (toolCall: ChatCompletionMessageToolCall) => Promise<string>;
    };
    register<T extends z.ZodTypeAny | JsonSchemaInput>({ name, handler, schema, config, description, }: ToolRegistrationInput<T>): void;
    listen(): Promise<void>;
    unlisten(): Promise<void>;
    getClusterId(): string;
}
