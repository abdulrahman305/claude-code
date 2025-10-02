"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agentrpc_1 = require("agentrpc");
const zod_1 = require("zod");
const rpc = new agentrpc_1.AgentRPC({
    apiSecret: process.env.AGENTRPC_API_SECRET,
});
rpc.register({
    name: 'getWeather',
    description: 'Return weather information at a given location',
    schema: zod_1.z.object({ location: zod_1.z.string() }),
    handler: async ({ location }) => {
        return {
            location: location,
            temperature: 'variable',
            parcipitation: 'probably',
        };
    },
});
rpc.listen();
