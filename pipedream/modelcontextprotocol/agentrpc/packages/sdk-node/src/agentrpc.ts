/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import path from "node:path";
import { z } from "zod";
import { JSONRPCClient } from "json-rpc-2.0";
import { AgentRPCError } from "./errors";
import { machineId } from "./machine-id";
import { PollingAgent, createAndPollJob } from "./polling";
import { ToolRegistrationInput, JsonSchemaInput } from "./types";

import debug from "debug"; // Added import for debug
import OpenAI from "openai"; // Revert to default import for the class
import { ChatCompletionTool, ChatCompletionMessageToolCall } from "openai/resources/chat/completions";

// Custom json formatter
debug.formatters.J = (json) => {
  return JSON.stringify(json, null, 2);
};

export const log = debug("agentrpc:client");

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
export class AgentRPC {
  static getVersion(): string {
    return require(path.join(__dirname, "..", "package.json")).version;
  }

  private clusterId: string;

  private apiSecret: string;
  private endpoint: string;
  private machineId: string;

  public jsonRpcClient: JSONRPCClient;

  private pollingAgents: PollingAgent[] = [];

  private toolsRegistry: {
    [key: string]: ToolRegistrationInput<z.ZodTypeAny | JsonSchemaInput>;
  } = {};

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
    mcpSessionId?: string; // New parameter
    mcpChatId?: string; // New parameter
  }) {
    const apiSecret = options?.apiSecret;

    if (!apiSecret) {
      throw new AgentRPCError(`No API Secret provided.`);
    }

    const [prefix, clusterId, rand] = apiSecret.split("_");

    if (prefix !== "sk" || !clusterId || !rand) {
      throw new AgentRPCError(`Invalid API Secret.`);
    } else {
      this.apiSecret = apiSecret;
      this.clusterId = clusterId;
    }

    this.endpoint = options?.endpoint || "https://api.agentrpc.com";
    const mcpUuid = options?.mcpUuid;
    const mcpApp = options?.mcpApp;

    if (this.endpoint !== "https://api.agentrpc.com" && !mcpUuid) {
      throw new AgentRPCError(
        `mcpUuid is required when a custom endpoint is provided.`,
      );
    }

    this.machineId = options?.machineId || machineId();

    this.jsonRpcClient = new JSONRPCClient((jsonRPCRequest) => {
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
            .then((jsonRPCResponse) =>
              this.jsonRpcClient.receive(jsonRPCResponse),
            );
        } else if (jsonRPCRequest.id !== undefined) {
          return Promise.reject(new Error(response.statusText));
        }
      });
    });
  }

  public OpenAI = {
    getTools: async (): Promise<ChatCompletionTool[]> => {
      const clusterId = this.clusterId;

      const toolResponse = await this.jsonRpcClient.request("listTools", {
        clusterId,
      });

      interface Tool {
        name: string;
        description: string | null;
        schema: string | null;
      }

      const tools = toolResponse.map((tool: Tool) => ({
        type: "function" as const,
        function: {
          name: tool.name,
          description: tool.description ?? "",
          parameters: JSON.parse(tool.schema ?? "{}"),
        },
      }));

      return tools;
    },
    executeTool: async (toolCall: ChatCompletionMessageToolCall) => {
      const clusterId = this.clusterId;

      const tools = await this.OpenAI.getTools();
      const tool = tools.find(
        (t) => t.function.name === toolCall.function.name,
      );

      if (!tool) {
        throw new Error(`Tool not found: ${toolCall.function.name}`);
      }

      const { result, resultType } = await createAndPollJob(
        this.jsonRpcClient,
        clusterId,
        tool.function.name,
        JSON.parse(toolCall.function.arguments),
      );

      return JSON.stringify({ type: resultType, content: result });
    },
  };

  public register<T extends z.ZodTypeAny | JsonSchemaInput>({
    name,
    handler,
    schema,
    config,
    description,
  }: ToolRegistrationInput<T>) {
    if (this.toolsRegistry[name]) {
      throw new AgentRPCError(`Tool name '${name}' is already registered.`);
    }

    const registration: ToolRegistrationInput<T> = {
      name,
      handler,
      schema,
      config,
      description,
    };

    const existing = this.pollingAgents.length > 0;

    if (existing) {
      throw new AgentRPCError(
        `Tools must be registered before starting the listener.`,
      );
    }

    if (typeof registration.handler !== "function") {
      throw new AgentRPCError(`handler must be a function.`);
    }

    log(`Registering tool`, {
      name: registration.name,
    });

    this.toolsRegistry[registration.name] = registration;
  }

  public async listen() {
    if (this.pollingAgents.length > 0) {
      throw new AgentRPCError("Tools already listening");
    }

    // TODO: Create one polling agent per 10 tools
    const agent = new PollingAgent({
      clusterId: this.clusterId,
      tools: Object.values(this.toolsRegistry),
      jsonRpcClient: this.jsonRpcClient,
    });

    this.pollingAgents.push(agent);
    await agent.start();
  }

  public async unlisten() {
    Promise.all(this.pollingAgents.map((agent) => agent.stop()));
  }

  public getClusterId() {
    return this.clusterId;
  }
}
