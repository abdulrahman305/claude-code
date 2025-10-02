/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import debug from "debug";
import { z } from "zod";
import { JSONRPCClient } from "json-rpc-2.0";
import { ToolRegistrationInput, JsonSchemaInput } from "./types";
export declare const log: debug.Debugger;
export declare class PollingAgent {
    clusterId: string;
    polling: boolean;
    private tools;
    private jsonRpcClient;
    private retryAfter;
    constructor(options: {
        clusterId: string;
        tools: ToolRegistrationInput<z.ZodTypeAny | JsonSchemaInput>[];
        jsonRpcClient: JSONRPCClient;
    });
    start(): Promise<void>;
    stop(): Promise<void>;
    private runLoop;
    private pollIteration;
    private processCall;
}
export declare const registerMachine: (client: JSONRPCClient, tools?: ToolRegistrationInput<z.ZodTypeAny | JsonSchemaInput>[]) => Promise<{
    clusterId: any;
}>;
export declare const pollForJobCompletion: (client: JSONRPCClient, clusterId: string, jobId: string, initialStatus?: string | null, initialResult?: string, initialResultType?: string) => Promise<{
    status: string;
    result: string;
    resultType: string;
}>;
export declare const createAndPollJob: (client: JSONRPCClient, clusterId: string, toolName: string, input: unknown) => Promise<{
    status: string;
    result: string;
    resultType: string;
}>;
