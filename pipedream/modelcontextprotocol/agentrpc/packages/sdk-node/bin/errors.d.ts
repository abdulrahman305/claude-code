export declare class AgentRPCError extends Error {
    static JOB_AUTHCONTEXT_INVALID: string;
    private meta?;
    constructor(message: string, meta?: {
        [key: string]: unknown;
    });
}
export declare class PollTimeoutError extends AgentRPCError {
    constructor(message: string, meta?: {
        [key: string]: unknown;
    });
}
export declare class AgentRPCAPIError extends Error {
    constructor(message: string, response: unknown);
}
