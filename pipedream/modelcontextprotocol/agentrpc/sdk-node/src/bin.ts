#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z, ZodRawShape, ZodTypeAny } from "zod";
import { createApiClient } from "./create-client";
import { createAndPollJob } from "./polling";

const commandName = process.argv[2];

if (!commandName || commandName !== "mcp") {
  console.error("Invalid command. Supported commands: mcp");
  process.exit(1);
}

const apiSecret = process.env.AGENTRPC_API_SECRET;

if (!apiSecret) {
  console.error("No API Secret provided");
  process.exit(1);
}

import { AgentRPC } from "./agentrpc"; // Import AgentRPC

const client = createApiClient({
  apiSecret,
});

// Create an AgentRPC instance
const agentrpcInstance = new AgentRPC({
  apiSecret,
  endpoint: process.env.AGENTRPC_ENDPOINT, // Use environment variable for endpoint
  mcpUuid: process.env.MCP_UUID, // Use environment variable for mcpUuid
  mcpApp: process.env.MCP_APP, // Use environment variable for mcpApp
});

// Create server instance
const server = new McpServer({
  name: "agentrpc",
  // Read from package.json
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  version: require("../package.json").version,
});

async function main() {

    const [prefix, clusterId, rand] = apiSecret!.split("_");

    if (prefix !== "sk" || !clusterId || !rand) {
      console.error("Invalid API Secret.");
      process.exit(1);
    }

  // Use the ts-rest client to list tools
  const toolResponse = await client.listTools({
    params: {
      clusterId,
    },
  });

  if (toolResponse.status !== 200) {
    console.error(
      "Failed to list AgentRPC tools:",
      toolResponse.status,
      toolResponse.body,
    );

    process.exit(1);
  }

  for (const tool of toolResponse.body) {
    server.tool(
      tool.name,
      tool.description ?? "",
      buildZodObject(JSON.parse(tool.schema!)),
      async (i) => {
        try {
          const { status, result, resultType } = await createAndPollJob(
            agentrpcInstance.jsonRpcClient, // Pass the JSONRPCClient from AgentRPC instance
            clusterId,
            tool.name,
            i,
          );

          return {
            content: [
              {
                type: "text",
                text: `${resultType}: ${JSON.stringify(result)}`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Failed to run tool: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      },
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Failed to start AgentRPC MCP Server", error);
  process.exit(1);
});

// @eslint-disable-next-line
const buildZodObject = (schema: any): ZodRawShape => {
  const result: Record<string, ZodTypeAny> = {};

  for (const [k, v] of Object.entries(schema.properties)) {
    // @eslint-disable-next-line
    result[k] = buildZodProp(v, k);
  }

  return result;
};

// @eslint-disable-next-line
const buildZodProp = (prop: any, key: string): ZodTypeAny => {
  if (prop.type === "string") {
    return z.string();
  } else if (prop.type === "number") {
    return z.number();
  } else if (prop.type === "boolean") {
    return z.boolean();
  } else if (prop.type === "object") {
    return z.object(buildZodObject(prop));
  } else if (prop.type === "array") {
    return z.array(buildZodProp(prop.items, key));
  } else {
    return z.any();
  }
};
