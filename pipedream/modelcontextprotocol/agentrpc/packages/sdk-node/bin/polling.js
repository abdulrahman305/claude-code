"use strict";
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndPollJob = exports.pollForJobCompletion = exports.registerMachine = exports.PollingAgent = exports.log = void 0;
const debug_1 = __importDefault(require("debug"));
const zod_1 = require("zod");
const serialize_error_1 = require("./serialize-error");
const execute_fn_1 = require("./execute-fn");
const util_1 = require("./util");
const zod_to_json_schema_1 = __importDefault(require("zod-to-json-schema"));
const DEFAULT_RETRY_AFTER_SECONDS = 0;
exports.log = (0, debug_1.default)("agentrpc:client:polling-agent");
class PollingAgent {
    constructor(options) {
        this.polling = false;
        this.tools = [];
        this.retryAfter = DEFAULT_RETRY_AFTER_SECONDS;
        this.tools = options.tools;
        this.clusterId = options.clusterId;
        this.jsonRpcClient = options.jsonRpcClient;
    }
    async start() {
        (0, exports.log)("Starting polling agent");
        await (0, exports.registerMachine)(this.jsonRpcClient, this.tools);
        // Purposefully not awaited
        this.runLoop();
    }
    async stop() {
        (0, exports.log)("Stopping polling agent");
        this.polling = false;
    }
    async runLoop() {
        this.polling = true;
        let failureCount = 0;
        while (this.polling) {
            try {
                await this.pollIteration();
                if (failureCount > 0) {
                    (0, exports.log)(`Poll iteration recovered after ${failureCount} failures`);
                    failureCount = 0;
                }
            }
            catch (e) {
                (0, exports.log)("Failed poll iteration", {
                    failureCount,
                    error: e,
                });
                failureCount++;
            }
            await new Promise((resolve) => setTimeout(resolve, this.retryAfter * 1000));
        }
    }
    async pollIteration() {
        if (!this.clusterId) {
            throw new Error("Failed to poll. Could not find clusterId");
        }
        const tools = this.tools.map((fn) => fn.name);
        const pollResult = await this.jsonRpcClient.request("listJobs", {
            clusterId: this.clusterId,
            tools: tools.join(","),
            status: "pending",
            acknowledge: true,
            limit: 10,
            waitTime: 20,
        });
        const results = await Promise.allSettled(pollResult.map(async (job) => {
            await this.processCall(job);
        }));
        if (results.length > 0) {
            (0, exports.log)("Completed poll iteration", {
                results: results.map((r) => r.status),
            });
        }
    }
    async processCall(call) {
        const registration = this.tools.find((fn) => fn.name === call.function);
        if (!registration) {
            (0, exports.log)("Received call for unknown function", {
                function: call.function,
            });
            return;
        }
        (0, exports.log)("Executing job", {
            id: call.id,
            function: call.function,
            registered: !!registration,
        });
        const onComplete = async (result) => {
            (0, exports.log)("Persisting job result", {
                id: call.id,
                function: call.function,
                resultType: result.type,
                functionExecutionTime: result.functionExecutionTime,
            });
            await this.jsonRpcClient.request("createJobResult", {
                jobId: call.id,
                clusterId: this.clusterId,
                result: result.content,
                resultType: result.type,
                meta: {
                    functionExecutionTime: result.functionExecutionTime,
                },
            });
        };
        const args = call.input;
        (0, exports.log)("Executing fn", {
            id: call.id,
            function: call.function,
            registeredFn: registration.handler,
            args,
        });
        if (typeof args !== "object" || Array.isArray(args) || args === null) {
            (0, exports.log)("Function was called with invalid invalid format. Expected an object.", {
                function: call.function,
            });
            return onComplete({
                type: "rejection",
                content: (0, serialize_error_1.serializeError)(new Error("Function was called with invalid invalid format. Expected an object.")),
                functionExecutionTime: 0,
            });
        }
        try {
            (0, util_1.validateFunctionArgs)(registration.schema, args);
        }
        catch (e) {
            if (e instanceof zod_1.z.ZodError) {
                e.errors.forEach((error) => {
                    (0, exports.log)("Function input does not match schema", {
                        function: call.function,
                        path: error.path,
                        error: error.message,
                    });
                });
            }
            return onComplete({
                type: "rejection",
                content: (0, serialize_error_1.serializeError)(e),
                functionExecutionTime: 0,
            });
        }
        const result = await (0, execute_fn_1.executeFn)(registration.handler, [args]);
        await onComplete(result);
    }
}
exports.PollingAgent = PollingAgent;
const registerMachine = async (client, tools) => {
    (0, exports.log)("registering machine", {
        tools: tools?.map((f) => f.name),
    });
    const registerResult = await client.request("createMachine", {
        tools: tools?.map((func) => ({
            name: func.name,
            description: func.description,
            schema: JSON.stringify((0, util_1.isZodType)(func.schema) ? (0, zod_to_json_schema_1.default)(func.schema) : func.schema),
            config: func.config,
        })),
    });
    return {
        clusterId: registerResult.clusterId,
    };
};
exports.registerMachine = registerMachine;
const pollForJobCompletion = async (client, clusterId, jobId, initialStatus, initialResult = "", initialResultType = "rejection") => {
    let status = initialStatus ?? null;
    let result = initialResult;
    let resultType = initialResultType;
    while (!status || !["failure", "done"].includes(status)) {
        const details = await client.request("getJob", {
            clusterId,
            jobId,
            waitTime: 20,
        });
        const body = details;
        status = body.status;
        result = body.result || "";
        resultType = body.resultType || "rejection";
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return { status: status, result, resultType };
};
exports.pollForJobCompletion = pollForJobCompletion;
const createAndPollJob = async (client, clusterId, toolName, input) => {
    const createResult = await client.request("createJob", {
        tool: toolName,
        input,
        clusterId,
        waitTime: 20,
    });
    return (0, exports.pollForJobCompletion)(client, clusterId, createResult.id, createResult.status, createResult.result || "", createResult.resultType || "rejection");
};
exports.createAndPollJob = createAndPollJob;
//# sourceMappingURL=polling.js.map