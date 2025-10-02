"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interrupt = exports.extractInterrupt = exports.INTERRUPT_KEY = exports.isZodType = exports.ajvErrorToFailures = exports.validateFunctionSchema = exports.validateDescription = exports.validatePropertyName = exports.validateFunctionName = exports.validateServiceName = exports.validateFunctionArgs = void 0;
const errors_1 = require("./errors");
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const contract_1 = require("./contract");
// Name restriction for Services and Functions
const ALLOWED_NAME_CHARACTERS = /^[a-zA-Z0-9]+$/;
const MAX_NAME_LENGTH = 30;
const validateFunctionArgs = (schema, args) => {
    try {
        if ((0, exports.isZodType)(schema)) {
            schema.parse(args);
        }
        else {
            const ajv = new ajv_1.default();
            (0, ajv_formats_1.default)(ajv);
            ajv.compile({
                ...schema,
                $schema: undefined,
            });
            ajv.validate(schema, args);
        }
    }
    catch (e) { }
};
exports.validateFunctionArgs = validateFunctionArgs;
const validateServiceName = (name) => {
    if (!ALLOWED_NAME_CHARACTERS.test(name)) {
        throw new errors_1.AgentRPCError(`Service name must only contain letters and numbers. Got: ${name}`);
    }
    if (name.length > MAX_NAME_LENGTH) {
        throw new errors_1.AgentRPCError(`Service name must be less than ${MAX_NAME_LENGTH} characters: Got ${name} with length ${name.length}.`);
    }
};
exports.validateServiceName = validateServiceName;
const validateFunctionName = (name) => {
    if (!ALLOWED_NAME_CHARACTERS.test(name)) {
        throw new errors_1.AgentRPCError(`Function name must only contain letters and numbers. Got: ${name}`);
    }
};
exports.validateFunctionName = validateFunctionName;
const validatePropertyName = (name) => {
    const ALLOWED_PROPERTY_NAME_CHARACTERS = /^[a-zA-Z0-9_]+$/;
    if (!ALLOWED_PROPERTY_NAME_CHARACTERS.test(name)) {
        throw new errors_1.AgentRPCError(`Property name must only contain letters, numbers and underscore '_'. Got: ${name}`);
    }
};
exports.validatePropertyName = validatePropertyName;
const validateDescription = (description) => {
    if (description === "") {
        throw new errors_1.AgentRPCError("Description must not be empty");
    }
};
exports.validateDescription = validateDescription;
/*
 * Validate a function schema.
 */
const validateFunctionSchema = (input) => {
    delete input.properties?.undefined;
    if (!input || !input.properties) {
        return [{ path: "", error: "Schema must be defined" }];
    }
    const errors = Object.keys(input.properties)
        .map((key) => {
        return validateProperty(key, input.properties[key]);
    })
        .flat();
    if (errors.length > 0) {
        return errors;
    }
    const ajv = new ajv_1.default();
    (0, ajv_formats_1.default)(ajv);
    try {
        ajv.compile({
            ...input,
            $schema: undefined,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return (0, exports.ajvErrorToFailures)(error);
        }
        throw new errors_1.AgentRPCError("Unknown JSON schema compilation error", {
            error,
        });
    }
    return [];
};
exports.validateFunctionSchema = validateFunctionSchema;
/**
 * Recursively validate $.properties
 */
const validateProperty = (key, value) => {
    let errors = [];
    try {
        (0, exports.validatePropertyName)(key);
    }
    catch (error) {
        if (error instanceof Error) {
            errors.push({
                path: `${key}`,
                error: error.message,
            });
        }
        else {
            throw error;
        }
    }
    if (value && typeof value === "object" && "properties" in value) {
        const properties = value.properties || {};
        errors = errors.concat(Object.keys(properties)
            .map((key) => {
            return validateProperty(key, properties[key]);
        })
            .flat());
    }
    return errors;
};
/*
 * Accepts an AJV compilation error and extracts the error details from the message.
 */
const ajvErrorToFailures = (error) => {
    // example: /data/properties/name some error message
    if (error.message.startsWith("schema is invalid:")) {
        return error.message
            .replace("schema is invalid:", "")
            .split(",")
            .map((s) => s.trim())
            .map((s) => {
            const firstSpace = s.indexOf(" ");
            if (firstSpace === -1) {
                throw new errors_1.AgentRPCError("Could not extract failures from AJV error", {
                    error,
                });
            }
            return {
                path: s.slice(0, firstSpace),
                error: s.slice(firstSpace + 1),
            };
        });
    }
    return [
        {
            path: "",
            error: error.message,
        },
    ];
};
exports.ajvErrorToFailures = ajvErrorToFailures;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isZodType = (input) => {
    return input?._def?.typeName;
};
exports.isZodType = isZodType;
exports.INTERRUPT_KEY = "__inferable_interrupt";
const extractInterrupt = (input) => {
    if (input && typeof input === "object" && exports.INTERRUPT_KEY in input) {
        const parsedInterrupt = contract_1.interruptSchema.safeParse(input[exports.INTERRUPT_KEY]);
        if (!parsedInterrupt.success) {
            throw new errors_1.AgentRPCError("Found invalid Interrupt data");
        }
        return parsedInterrupt.data;
    }
};
exports.extractInterrupt = extractInterrupt;
class Interrupt {
    constructor(type, notification) {
        this[exports.INTERRUPT_KEY] = {
            type,
            notification,
        };
    }
    static approval(notification) {
        return new Interrupt("approval", notification);
    }
    static general(notification) {
        return new Interrupt("general", notification);
    }
}
exports.Interrupt = Interrupt;
//# sourceMappingURL=util.js.map