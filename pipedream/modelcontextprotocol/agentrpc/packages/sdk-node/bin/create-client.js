"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiClient = void 0;
const core_1 = require("@ts-rest/core");
const contract_1 = require("./contract");
const { version: SDK_VERSION } = require("../package.json");
/**
 * Provides raw API access to the Inferable API.
 */
const createApiClient = ({ baseUrl, machineId, clientAbortController, apiSecret, }) => (0, core_1.initClient)(contract_1.contract, {
    baseUrl: baseUrl ?? "https://api.agentrpc.com",
    baseHeaders: {
        "x-machine-sdk-version": SDK_VERSION,
        "x-machine-sdk-language": "typescript",
        ...(apiSecret ? { authorization: apiSecret } : {}),
        ...(machineId ? { "x-machine-id": machineId } : {}),
    },
    api: async (args) => {
        try {
            return await (0, core_1.tsRestFetchApi)({
                ...args,
                ...(clientAbortController
                    ? { signal: clientAbortController.signal }
                    : {}),
            });
        }
        catch (e) {
            return {
                status: -1,
                headers: new Headers(),
                body: e,
            };
        }
    },
});
exports.createApiClient = createApiClient;
//# sourceMappingURL=create-client.js.map