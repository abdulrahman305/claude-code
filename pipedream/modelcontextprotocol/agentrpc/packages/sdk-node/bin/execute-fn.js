"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeFn = void 0;
const serialize_error_1 = require("./serialize-error");
const util_1 = require("./util");
const executeFn = async (fn, args) => {
    const start = Date.now();
    try {
        const result = await fn(...args);
        const interupt = (0, util_1.extractInterrupt)(result);
        if (interupt) {
            return {
                content: interupt,
                type: "interrupt",
                functionExecutionTime: Date.now() - start,
            };
        }
        return {
            content: result,
            type: "resolution",
            functionExecutionTime: Date.now() - start,
        };
    }
    catch (e) {
        const interupt = (0, util_1.extractInterrupt)(e);
        if (interupt) {
            return {
                content: interupt,
                type: "interrupt",
                functionExecutionTime: Date.now() - start,
            };
        }
        const functionExecutionTime = Date.now() - start;
        if (e instanceof Error) {
            return {
                content: (0, serialize_error_1.serializeError)(e),
                type: "rejection",
                functionExecutionTime,
            };
        }
        else if (typeof e === "string") {
            return {
                content: (0, serialize_error_1.serializeError)(new Error(e)),
                type: "rejection",
                functionExecutionTime,
            };
        }
        else {
            return {
                content: new Error("Inferable encountered an unexpected error type. Make sure you are throwing an Error object."),
                type: "rejection",
                functionExecutionTime,
            };
        }
    }
};
exports.executeFn = executeFn;
//# sourceMappingURL=execute-fn.js.map