"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRPCAPIError = exports.PollTimeoutError = exports.AgentRPCError = void 0;
class AgentRPCError extends Error {
    constructor(message, meta) {
        super(message);
        this.name = "InferableError";
        this.meta = meta;
    }
}
exports.AgentRPCError = AgentRPCError;
AgentRPCError.JOB_AUTHCONTEXT_INVALID = "Function requires authentication but no auth context was provided.";
class PollTimeoutError extends AgentRPCError {
    constructor(message, meta) {
        super(message, meta);
        this.name = "PollTimeoutError";
    }
}
exports.PollTimeoutError = PollTimeoutError;
class AgentRPCAPIError extends Error {
    constructor(message, response) {
        let msg = message;
        if (response instanceof Error) {
            msg += `\n${response.message}`;
        }
        else if (typeof response === "string") {
            msg += `\n${response}`;
        }
        else if (typeof response === "object") {
            msg += `\n${JSON.stringify(response)}`;
        }
        super(msg);
        this.name = "InferableAPIError";
    }
}
exports.AgentRPCAPIError = AgentRPCAPIError;
//# sourceMappingURL=errors.js.map