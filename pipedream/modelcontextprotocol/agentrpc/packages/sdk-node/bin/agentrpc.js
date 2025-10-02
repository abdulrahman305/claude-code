"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRPC = exports.log = void 0;
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const node_path_1 = __importDefault(require("node:path"));
const json_rpc_2_0_1 = require("json-rpc-2.0");
const errors_1 = require("./errors");
const machine_id_1 = require("./machine-id");
const polling_1 = require("./polling");
const debug_1 = __importDefault(require("debug")); // Added import for debug
// Custom json formatter
debug_1.default.formatters.J = (json) => {
    return JSON.stringify(json, null, 2);
};
exports.log = (0, debug_1.default)("agentrpc:client");
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
class AgentRPC {
    static getVersion() {
        return require(node_path_1.default.join(__dirname, "..", "package.json")).version;
    }
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
    constructor(options) {
        this.pollingAgents = [];
        this.toolsRegistry = {};
        this.OpenAI = {
            getTools: async () => {
                const clusterId = this.clusterId;
                const toolResponse = await this.jsonRpcClient.request("listTools", {
                    clusterId,
                });
                const tools = toolResponse.map((tool) => ({
                    type: "function",
                    function: {
                        name: tool.name,
                        description: tool.description ?? "",
                        parameters: JSON.parse(tool.schema ?? "{}"),
                    },
                }));
                return tools;
            },
            executeTool: async (toolCall) => {
                const clusterId = this.clusterId;
                const tools = await this.OpenAI.getTools();
                const tool = tools.find((t) => t.function.name === toolCall.function.name);
                if (!tool) {
                    throw new Error(`Tool not found: ${toolCall.function.name}`);
                }
                const { result, resultType } = await (0, polling_1.createAndPollJob)(this.jsonRpcClient, clusterId, tool.function.name, JSON.parse(toolCall.function.arguments));
                return JSON.stringify({ type: resultType, content: result });
            },
        };
        const apiSecret = options?.apiSecret;
        if (!apiSecret) {
            throw new errors_1.AgentRPCError(`No API Secret provided.`);
        }
        const [prefix, clusterId, rand] = apiSecret.split("_");
        if (prefix !== "sk" || !clusterId || !rand) {
            throw new errors_1.AgentRPCError(`Invalid API Secret.`);
        }
        else {
            this.apiSecret = apiSecret;
            this.clusterId = clusterId;
        }
        this.endpoint = options?.endpoint || "https://api.agentrpc.com";
        const mcpUuid = options?.mcpUuid;
        const mcpApp = options?.mcpApp;
        if (this.endpoint !== "https://api.agentrpc.com" && !mcpUuid) {
            throw new errors_1.AgentRPCError(`mcpUuid is required when a custom endpoint is provided.`);
        }
        this.machineId = options?.machineId || (0, machine_id_1.machineId)();
        this.jsonRpcClient = new json_rpc_2_0_1.JSONRPCClient((jsonRPCRequest) => {
            let url = `${this.endpoint}/json-rpc`;
            if (mcpUuid) {
                url = `${this.endpoint}/v1/${mcpUuid}`;
                if (mcpApp) {
                    url = `${url}/${mcpApp}`;
                }
            }
            return fetch(url, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    authorization: this.apiSecret,
                    ...(options?.mcpSessionId && {
                        "mcp-session-id": options.mcpSessionId,
                    }),
                    ...(options?.mcpChatId && { "x-pd-mcp-chat-id": options.mcpChatId }),
                },
                body: JSON.stringify(jsonRPCRequest),
            }).then((response) => {
                if (response.status === 200) {
                    // Use client.receive when you received a JSON-RPC response.
                    return response
                        .json()
                        .then((jsonRPCResponse) => this.jsonRpcClient.receive(jsonRPCResponse));
                }
                else if (jsonRPCRequest.id !== undefined) {
                    return Promise.reject(new Error(response.statusText));
                }
            });
        });
    }
    register({ name, handler, schema, config, description, }) {
        if (this.toolsRegistry[name]) {
            throw new errors_1.AgentRPCError(`Tool name '${name}' is already registered.`);
        }
        const registration = {
            name,
            handler,
            schema,
            config,
            description,
        };
        const existing = this.pollingAgents.length > 0;
        if (existing) {
            throw new errors_1.AgentRPCError(`Tools must be registered before starting the listener.`);
        }
        if (typeof registration.handler !== "function") {
            throw new errors_1.AgentRPCError(`handler must be a function.`);
        }
        (0, exports.log)(`Registering tool`, {
            name: registration.name,
        });
        this.toolsRegistry[registration.name] = registration;
    }
    async listen() {
        if (this.pollingAgents.length > 0) {
            throw new errors_1.AgentRPCError("Tools already listening");
        }
        // TODO: Create one polling agent per 10 tools
        const agent = new polling_1.PollingAgent({
            clusterId: this.clusterId,
            tools: Object.values(this.toolsRegistry),
            jsonRpcClient: this.jsonRpcClient,
        });
        this.pollingAgents.push(agent);
        await agent.start();
    }
    async unlisten() {
        Promise.all(this.pollingAgents.map((agent) => agent.stop()));
    }
    getClusterId() {
        return this.clusterId;
    }
}
exports.AgentRPC = AgentRPC;
//# sourceMappingURL=agentrpc.js.map