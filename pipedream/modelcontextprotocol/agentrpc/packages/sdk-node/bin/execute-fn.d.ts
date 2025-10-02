import { ToolRegistrationInput } from "./types";
export type Result<T = unknown> = {
    content: T;
    type: "resolution" | "rejection" | "interrupt";
    functionExecutionTime?: number;
};
export declare const executeFn: (fn: ToolRegistrationInput<any>["handler"], args: Parameters<ToolRegistrationInput<any>["handler"]>) => Promise<Result>;
