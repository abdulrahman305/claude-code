/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import debug from "debug";
import { z } from "zod";
import { JSONRPCClient } from "json-rpc-2.0";
import { AgentRPCError } from "./errors";
import { serializeError } from "./serialize-error";
import { executeFn, Result } from "./execute-fn";
import { ToolRegistrationInput, JsonSchemaInput } from "./types";
import { isZodType, validateFunctionArgs } from "./util";
import zodToJsonSchema from "zod-to-json-schema";

const DEFAULT_RETRY_AFTER_SECONDS = 0;

export const log = debug("agentrpc:client:polling-agent");

type JobMessage = {
  id: string;
  function: string;
  input?: unknown;
};

export class PollingAgent {
  public clusterId: string;
  public polling = false;

  private tools: ToolRegistrationInput<z.ZodTypeAny | JsonSchemaInput>[] = [];

  private jsonRpcClient: JSONRPCClient;

  private retryAfter = DEFAULT_RETRY_AFTER_SECONDS;

  constructor(options: {
    clusterId: string;
    tools: ToolRegistrationInput<z.ZodTypeAny | JsonSchemaInput>[];
    jsonRpcClient: JSONRPCClient;
  }) {
    this.tools = options.tools;
    this.clusterId = options.clusterId;
    this.jsonRpcClient = options.jsonRpcClient;
  }

  public async start() {
    log("Starting polling agent");
    await registerMachine(this.jsonRpcClient, this.tools);

    // Purposefully not awaited
    this.runLoop();
  }

  public async stop(): Promise<void> {
    log("Stopping polling agent");
    this.polling = false;
  }

  private async runLoop() {
    this.polling = true;

    let failureCount = 0;

    while (this.polling) {
      try {
        await this.pollIteration();
        if (failureCount > 0) {
          log(`Poll iteration recovered after ${failureCount} failures`);
          failureCount = 0;
        }
      } catch (e) {
        log("Failed poll iteration", {
          failureCount,
          error: e,
        });

        failureCount++;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, this.retryAfter * 1000),
      );
    }
  }

  private async pollIteration() {
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

    const results = await Promise.allSettled(
      pollResult.map(async (job: JobMessage) => {
        await this.processCall(job);
      }),
    );

    if (results.length > 0) {
      log("Completed poll iteration", {
        results: results.map((r) => r.status),
      });
    }
  }

  private async processCall(call: JobMessage): Promise<void> {
    const registration = this.tools.find((fn) => fn.name === call.function);

    if (!registration) {
      log("Received call for unknown function", {
        function: call.function,
      });
      return;
    }

    log("Executing job", {
      id: call.id,
      function: call.function,
      registered: !!registration,
    });

    const onComplete = async (result: Result) => {
      log("Persisting job result", {
        id: call.id,
        function: call.function,
        resultType: result.type,
        functionExecutionTime: result.functionExecutionTime,
      });

      await this.jsonRpcClient.request("createJobResult", {
        jobId: call.id,
        clusterId: this.clusterId!,
        result: result.content,
        resultType: result.type,
        meta: {
          functionExecutionTime: result.functionExecutionTime,
        },
      });
    };

    const args = call.input;

    log("Executing fn", {
      id: call.id,
      function: call.function,
      registeredFn: registration.handler,
      args,
    });

    if (typeof args !== "object" || Array.isArray(args) || args === null) {
      log(
        "Function was called with invalid invalid format. Expected an object.",
        {
          function: call.function,
        },
      );

      return onComplete({
        type: "rejection",
        content: serializeError(
          new Error(
            "Function was called with invalid invalid format. Expected an object.",
          ),
        ),
        functionExecutionTime: 0,
      });
    }

    try {
      validateFunctionArgs(registration.schema, args);
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        e.errors.forEach((error) => {
          log("Function input does not match schema", {
            function: call.function,
            path: error.path,
            error: error.message,
          });
        });
      }

      return onComplete({
        type: "rejection",
        content: serializeError(e),
        functionExecutionTime: 0,
      });
    }

    const result = await executeFn(registration.handler, [args]);

    await onComplete(result);
  }
}

export const registerMachine = async (
  client: JSONRPCClient,
  tools?: ToolRegistrationInput<z.ZodTypeAny | JsonSchemaInput>[],
) => {
  log("registering machine", {
    tools: tools?.map((f) => f.name),
  });
  const registerResult = await client.request("createMachine", {
    tools: tools?.map((func) => ({
      name: func.name,
      description: func.description,
      schema: JSON.stringify(
        isZodType(func.schema) ? zodToJsonSchema(func.schema) : func.schema,
      ),
      config: func.config,
    })),
  });

  return {
    clusterId: registerResult.clusterId,
  };
};

export const pollForJobCompletion = async (
  client: JSONRPCClient,
  clusterId: string,
  jobId: string,
  initialStatus?: string | null,
  initialResult: string = "",
  initialResultType: string = "rejection",
): Promise<{
  status: string;
  result: string;
  resultType: string;
}> => {
  let status: string | null = initialStatus ?? null;
  let result: string = initialResult;
  let resultType: string = initialResultType;

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

  return { status: status as string, result, resultType };
};

export const createAndPollJob = async (
  client: JSONRPCClient,
  clusterId: string,
  toolName: string,
  input: unknown,
): Promise<{
  status: string;
  result: string;
  resultType: string;
}> => {
  const createResult = await client.request("createJob", {
    tool: toolName,
    input,
    clusterId,
    waitTime: 20,
  });

  return pollForJobCompletion(
    client,
    clusterId,
    createResult.id,
    createResult.status,
    createResult.result || "",
    createResult.resultType || "rejection",
  );
};