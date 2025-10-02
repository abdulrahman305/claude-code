#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const create_client_1 = require("./create-client");
const polling_1 = require("./polling");
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
const agentrpc_1 = require("./agentrpc"); // Import AgentRPC
const client = (0, create_client_1.createApiClient)({
    apiSecret,
});
// Create an AgentRPC instance
const agentrpcInstance = new agentrpc_1.AgentRPC({
    apiSecret,
    endpoint: process.env.AGENTRPC_ENDPOINT, // Use environment variable for endpoint
    mcpUuid: process.env.MCP_UUID, // Use environment variable for mcpUuid
    mcpApp: process.env.MCP_APP, // Use environment variable for mcpApp
});
// Create server instance
const server = new mcp_js_1.McpServer({
    name: "agentrpc",
    // Read from package.json
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    version: require("../package.json").version,
});
async function main() {
    const [prefix, clusterId, rand] = apiSecret.split("_");
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
        console.error("Failed to list AgentRPC tools:", toolResponse.status, toolResponse.body);
        process.exit(1);
    }
    for (const tool of toolResponse.body) {
        server.tool(tool.name, tool.description ?? "", buildZodObject(JSON.parse(tool.schema)), async (i) => {
            try {
                const { status, result, resultType } = await (0, polling_1.createAndPollJob)(agentrpcInstance.jsonRpcClient, // Pass the JSONRPCClient from AgentRPC instance
                clusterId, tool.name, i);
                return {
                    content: [
                        {
                            type: "text",
                            text: `${resultType}: ${JSON.stringify(result)}`,
                        },
                    ],
                };
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to run tool: ${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                };
            }
        });
    }
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    console.error("Failed to start AgentRPC MCP Server", error);
    process.exit(1);
});
// @eslint-disable-next-line
const buildZodObject = (schema) => {
    const result = {};
    for (const [k, v] of Object.entries(schema.properties)) {
        // @eslint-disable-next-line
        result[k] = buildZodProp(v, k);
    }
    return result;
};
// @eslint-disable-next-line
const buildZodProp = (prop, key) => {
    if (prop.type === "string") {
        return zod_1.z.string();
    }
    else if (prop.type === "number") {
        return zod_1.z.number();
    }
    else if (prop.type === "boolean") {
        return zod_1.z.boolean();
    }
    else if (prop.type === "object") {
        return zod_1.z.object(buildZodObject(prop));
    }
    else if (prop.type === "array") {
        return zod_1.z.array(buildZodProp(prop.items, key));
    }
    else {
        return zod_1.z.any();
    }
};
//# sourceMappingURL=bin.js.map