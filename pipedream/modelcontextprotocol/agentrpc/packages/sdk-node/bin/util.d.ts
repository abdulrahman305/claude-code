import { z } from "zod";
import { JsonSchemaInput } from "./types";
import { interruptSchema } from "./contract";
export declare const validateFunctionArgs: (schema: any, args: unknown) => void;
export declare const validateServiceName: (name: string) => void;
export declare const validateFunctionName: (name: string) => void;
export declare const validatePropertyName: (name: string) => void;
export declare const validateDescription: (description?: string) => void;
export declare const validateFunctionSchema: (input: JsonSchemaInput) => {
    path: string;
    error: string;
}[];
export declare const ajvErrorToFailures: (error: Error) => {
    path: string;
    error: string;
}[];
export declare const isZodType: (input: any) => input is z.ZodTypeAny;
export declare const INTERRUPT_KEY = "__inferable_interrupt";
type VALID_INTERRUPT_TYPES = "approval" | "general";
export declare const extractInterrupt: (input: unknown) => z.infer<typeof interruptSchema> | undefined;
export declare class Interrupt {
    [INTERRUPT_KEY]: z.infer<typeof interruptSchema>;
    constructor(type: VALID_INTERRUPT_TYPES, notification?: z.infer<typeof interruptSchema>["notification"]);
    static approval(notification?: z.infer<typeof interruptSchema>["notification"]): Interrupt;
    static general(notification?: z.infer<typeof interruptSchema>["notification"]): Interrupt;
}
export {};
