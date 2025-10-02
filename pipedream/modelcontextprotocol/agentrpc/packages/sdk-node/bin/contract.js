"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contract = exports.definition = exports.ToolConfigSchema = exports.interruptSchema = exports.notificationSchema = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const c = (0, core_1.initContract)();
const machineHeaders = {
    "x-machine-id": zod_1.z.string().optional(),
    "x-machine-sdk-version": zod_1.z.string().optional(),
    "x-machine-sdk-language": zod_1.z.string().optional(),
    "x-forwarded-for": zod_1.z.string().optional().optional(),
};
exports.notificationSchema = zod_1.z.object({
    destination: zod_1.z
        .discriminatedUnion("type", [
        zod_1.z.object({
            type: zod_1.z.literal("slack"),
            channelId: zod_1.z.string().optional(),
            threadId: zod_1.z.string().optional(),
            userId: zod_1.z.string().optional(),
            email: zod_1.z.string().optional(),
        }),
        zod_1.z.object({
            type: zod_1.z.literal("email"),
            email: zod_1.z.string(),
        }),
    ])
        .optional(),
    message: zod_1.z.string().optional(),
});
exports.interruptSchema = zod_1.z.discriminatedUnion("type", [
    zod_1.z.object({
        type: zod_1.z.enum(["approval", "general"]),
        notification: exports.notificationSchema.optional(),
    }),
]);
exports.ToolConfigSchema = zod_1.z.object({
    cache: zod_1.z
        .object({
        keyPath: zod_1.z.string(),
        ttlSeconds: zod_1.z.number(),
    })
        .optional(),
    retryCountOnStall: zod_1.z.number().optional(),
    timeoutSeconds: zod_1.z.number().optional(),
    private: zod_1.z.boolean().default(false).optional(),
});
exports.definition = {
    // Misc Endpoints
    live: {
        method: "GET",
        path: "/live",
        responses: {
            200: zod_1.z.object({
                status: zod_1.z.string(),
            }),
        },
    },
    createEphemeralSetup: {
        method: "POST",
        path: "/ephemeral-setup",
        responses: {
            200: zod_1.z.object({
                clusterId: zod_1.z.string(),
                apiKey: zod_1.z.string(),
            }),
        },
        body: zod_1.z.undefined(),
    },
    getContract: {
        method: "GET",
        path: "/contract",
        responses: {
            200: zod_1.z.object({
                contract: zod_1.z.string(),
            }),
        },
    },
    // Job Endpoints
    getJob: {
        method: "GET",
        path: "/clusters/:clusterId/jobs/:jobId",
        headers: zod_1.z.object({ authorization: zod_1.z.string() }),
        pathParams: zod_1.z.object({
            clusterId: zod_1.z.string(),
            jobId: zod_1.z.string(),
        }),
        query: zod_1.z.object({
            waitTime: zod_1.z.coerce
                .number()
                .min(0)
                .max(20)
                .default(0)
                .describe("Time in seconds to keep the request open waiting for a response"),
        }),
        responses: {
            200: zod_1.z.object({
                id: zod_1.z.string(),
                status: zod_1.z.string(),
                targetFn: zod_1.z.string(),
                executingMachineId: zod_1.z.string().nullable(),
                targetArgs: zod_1.z.string(),
                result: zod_1.z.any().nullable(),
                resultType: zod_1.z.string().nullable(),
                createdAt: zod_1.z.date(),
                approved: zod_1.z.boolean().nullable(),
                approvalRequested: zod_1.z.boolean().nullable(),
            }),
        },
    },
    getJobListing: {
        method: "GET",
        path: "/clusters/:clusterId/job-listing",
        headers: zod_1.z.object({ authorization: zod_1.z.string() }),
        pathParams: zod_1.z.object({
            clusterId: zod_1.z.string(),
        }),
        query: zod_1.z.object({
            limit: zod_1.z.string(),
            status: zod_1.z
                .enum([
                "pending",
                "running",
                "done",
                "failure",
                "stalled",
                "interrupted",
            ])
                .optional(),
            targetFn: zod_1.z.string().optional(),
            after: zod_1.z.string().optional(),
        }),
        responses: {
            200: zod_1.z.array(zod_1.z.object({
                id: zod_1.z.string(),
                status: zod_1.z.string(),
                targetFn: zod_1.z.string(),
                executingMachineId: zod_1.z.string().nullable(),
                createdAt: zod_1.z.date(),
                approved: zod_1.z.boolean().nullable(),
            })),
        },
    },
    createJob: {
        method: "POST",
        path: "/clusters/:clusterId/jobs",
        query: zod_1.z.object({
            waitTime: zod_1.z.coerce
                .number()
                .min(0)
                .max(20)
                .default(0)
                .describe("Time in seconds to keep the request open waiting for a response"),
        }),
        headers: zod_1.z.object({
            authorization: zod_1.z.string(),
        }),
        body: zod_1.z.object({
            function: zod_1.z.string().optional(),
            tool: zod_1.z.string().optional(),
            input: zod_1.z.object({}).passthrough(),
        }),
        responses: {
            401: zod_1.z.undefined(),
            200: zod_1.z.object({
                id: zod_1.z.string(),
                result: zod_1.z.any().nullable(),
                resultType: zod_1.z.enum(["resolution", "rejection", "interrupt"]).nullable(),
                status: zod_1.z.enum([
                    "pending",
                    "running",
                    "done",
                    "failure",
                    "stalled",
                    "interrupted",
                ]),
            }),
        },
    },
    cancelJob: {
        method: "POST",
        path: "/clusters/:clusterId/jobs/:jobId/cancel",
        headers: zod_1.z.object({
            authorization: zod_1.z.string(),
        }),
        pathParams: zod_1.z.object({
            clusterId: zod_1.z.string(),
            jobId: zod_1.z.string(),
        }),
        responses: {
            204: zod_1.z.undefined(),
            401: zod_1.z.undefined(),
        },
        body: zod_1.z.undefined(),
    },
    createJobResult: {
        method: "POST",
        path: "/clusters/:clusterId/jobs/:jobId/result",
        headers: zod_1.z.object({
            authorization: zod_1.z.string(),
            ...machineHeaders,
        }),
        pathParams: zod_1.z.object({
            clusterId: zod_1.z.string(),
            jobId: zod_1.z.string(),
        }),
        responses: {
            204: zod_1.z.undefined(),
            401: zod_1.z.undefined(),
        },
        body: zod_1.z.object({
            result: zod_1.z.any(),
            resultType: zod_1.z.enum(["resolution", "rejection", "interrupt"]),
            meta: zod_1.z.object({
                functionExecutionTime: zod_1.z.number().optional(),
            }),
        }),
    },
    listJobs: {
        method: "GET",
        path: "/clusters/:clusterId/jobs",
        query: zod_1.z.object({
            tools: zod_1.z
                .string()
                .optional()
                .describe("Comma-separated list of tools to poll"),
            status: zod_1.z
                .enum(["pending", "running", "paused", "done", "failed"])
                .default("pending"),
            limit: zod_1.z.coerce.number().min(1).max(20).default(10),
            acknowledge: zod_1.z.coerce
                .boolean()
                .default(false)
                .describe("Should retrieved Jobs be marked as running"),
            waitTime: zod_1.z.coerce
                .number()
                .min(0)
                .max(20)
                .default(0)
                .describe("Time in seconds to keep the request open waiting for a response"),
        }),
        pathParams: zod_1.z.object({
            clusterId: zod_1.z.string(),
        }),
        headers: zod_1.z.object({
            authorization: zod_1.z.string(),
            ...machineHeaders,
        }),
        responses: {
            401: zod_1.z.undefined(),
            410: zod_1.z.object({
                message: zod_1.z.string(),
            }),
            200: zod_1.z.array(zod_1.z.object({
                id: zod_1.z.string(),
                function: zod_1.z.string(),
                input: zod_1.z.any(),
                authContext: zod_1.z.any().nullable(),
                runContext: zod_1.z.any().nullable(),
                approved: zod_1.z.boolean(),
            })),
        },
    },
    createJobApproval: {
        method: "POST",
        path: "/clusters/:clusterId/jobs/:jobId/approval",
        headers: zod_1.z.object({
            authorization: zod_1.z.string(),
        }),
        pathParams: zod_1.z.object({
            clusterId: zod_1.z.string(),
            jobId: zod_1.z.string(),
        }),
        responses: {
            204: zod_1.z.undefined(),
            404: zod_1.z.object({
                message: zod_1.z.string(),
            }),
        },
        body: zod_1.z.object({
            approved: zod_1.z.boolean(),
        }),
    },
    createMachine: {
        method: "POST",
        path: "/machines",
        headers: zod_1.z.object({
            authorization: zod_1.z.string(),
            ...machineHeaders,
        }),
        body: zod_1.z.object({
            functions: zod_1.z
                .array(zod_1.z.object({
                name: zod_1.z.string(),
                description: zod_1.z.string().optional(),
                schema: zod_1.z.string().optional(),
                config: exports.ToolConfigSchema.optional(),
            }))
                .optional(),
            tools: zod_1.z
                .array(zod_1.z.object({
                name: zod_1.z.string(),
                description: zod_1.z.string().optional(),
                schema: zod_1.z.string().optional(),
                config: exports.ToolConfigSchema.optional(),
            }))
                .optional(),
        }),
        responses: {
            200: zod_1.z.object({
                clusterId: zod_1.z.string(),
            }),
            204: zod_1.z.undefined(),
        },
    },
    // Cluster Endpoints
    createCluster: {
        method: "POST",
        path: "/clusters",
        headers: zod_1.z.object({
            authorization: zod_1.z.string(),
        }),
        responses: {
            204: zod_1.z.undefined(),
        },
        body: zod_1.z.object({
            description: zod_1.z
                .string()
                .describe("Human readable description of the cluster"),
            name: zod_1.z
                .string()
                .optional()
                .describe("Human readable name of the cluster"),
            isDemo: zod_1.z
                .boolean()
                .optional()
                .default(false)
                .describe("Whether the cluster is a demo cluster"),
        }),
    },
    deleteCluster: {
        method: "DELETE",
        path: "/clusters/:clusterId",
        headers: zod_1.z.object({
            authorization: zod_1.z.string(),
        }),
        body: zod_1.z.undefined(),
        responses: {
            204: zod_1.z.undefined(),
        },
    },
    updateCluster: {
        method: "PUT",
        path: "/clusters/:clusterId",
        headers: zod_1.z.object({
            authorization: zod_1.z.string(),
        }),
        responses: {
            204: zod_1.z.undefined(),
            401: zod_1.z.undefined(),
        },
        body: zod_1.z.object({
            name: zod_1.z.string().optional(),
            description: zod_1.z.string().optional(),
            debug: zod_1.z
                .boolean()
                .optional()
                .describe("Enable additional logging (Including prompts and results) for use by Inferable support"),
            enableCustomAuth: zod_1.z.boolean().optional(),
            enableKnowledgebase: zod_1.z.boolean().optional(),
            handleCustomAuthFunction: zod_1.z.string().optional(),
        }),
    },
    getCluster: {
        method: "GET",
        path: "/clusters/:clusterId",
        headers: zod_1.z.object({
            authorization: zod_1.z.string(),
        }),
        responses: {
            200: zod_1.z.object({
                id: zod_1.z.string(),
                name: zod_1.z.string(),
                description: zod_1.z.string().nullable(),
                createdAt: zod_1.z.number(),
                debug: zod_1.z.boolean(),
                enableCustomAuth: zod_1.z.boolean(),
                handleCustomAuthFunction: zod_1.z.string().nullable(),
                isDemo: zod_1.z.boolean(),
                machines: zod_1.z.array(zod_1.z.object({
                    id: zod_1.z.string(),
                    lastPingAt: zod_1.z.number().nullable(),
                    ip: zod_1.z.string().nullable(),
                    sdkVersion: zod_1.z.string().nullable(),
                    sdkLanguage: zod_1.z.string().nullable(),
                })),
                tools: zod_1.z.array(zod_1.z.object({
                    name: zod_1.z.string(),
                    description: zod_1.z.string().nullable(),
                    schema: zod_1.z.unknown().nullable(),
                    config: zod_1.z.unknown().nullable(),
                    shouldExpire: zod_1.z.boolean(),
                    createdAt: zod_1.z.number(),
                    lastPingAt: zod_1.z.number().nullable(),
                })),
            }),
            401: zod_1.z.undefined(),
            404: zod_1.z.undefined(),
        },
        pathParams: zod_1.z.object({
            clusterId: zod_1.z.string(),
        }),
    },
    listClusters: {
        method: "GET",
        path: "/clusters",
        headers: zod_1.z.object({
            authorization: zod_1.z.string(),
        }),
        responses: {
            200: zod_1.z.array(zod_1.z.object({
                id: zod_1.z.string(),
                name: zod_1.z.string(),
                createdAt: zod_1.z.date(),
                description: zod_1.z.string().nullable(),
            })),
            401: zod_1.z.undefined(),
        },
    },
    // Event Endpoints
    listEvents: {
        method: "GET",
        path: "/clusters/:clusterId/events",
        headers: zod_1.z.object({
            authorization: zod_1.z.string(),
        }),
        responses: {
            200: zod_1.z.array(zod_1.z.object({
                type: zod_1.z.string(),
                machineId: zod_1.z.string().nullable(),
                createdAt: zod_1.z.date(),
                jobId: zod_1.z.string().nullable(),
                targetFn: zod_1.z.string().nullable(),
                resultType: zod_1.z.string().nullable(),
                status: zod_1.z.string().nullable(),
                runId: zod_1.z.string().nullable(),
                meta: zod_1.z.any().nullable(),
                id: zod_1.z.string(),
            })),
            401: zod_1.z.undefined(),
            404: zod_1.z.undefined(),
        },
        query: zod_1.z.object({
            type: zod_1.z.string().optional(),
            jobId: zod_1.z.string().optional(),
            machineId: zod_1.z.string().optional(),
            runId: zod_1.z.string().optional(),
            includeMeta: zod_1.z.string().optional(),
        }),
    },
    getEventMeta: {
        method: "GET",
        path: "/clusters/:clusterId/events/:eventId/meta",
        headers: zod_1.z.object({
            authorization: zod_1.z.string(),
        }),
        responses: {
            200: zod_1.z.object({
                type: zod_1.z.string(),
                machineId: zod_1.z.string().nullable(),
                createdAt: zod_1.z.date(),
                jobId: zod_1.z.string().nullable(),
                targetFn: zod_1.z.string().nullable(),
                resultType: zod_1.z.string().nullable(),
                status: zod_1.z.string().nullable(),
                meta: zod_1.z.unknown(),
                id: zod_1.z.string(),
            }),
            401: zod_1.z.undefined(),
            404: zod_1.z.undefined(),
        },
    },
    oas: {
        method: "GET",
        path: "/public/oas.json",
        responses: {
            200: zod_1.z.unknown(),
        },
    },
    // API Key Endpoints
    createApiKey: {
        method: "POST",
        path: "/clusters/:clusterId/api-keys",
        headers: zod_1.z.object({ authorization: zod_1.z.string() }),
        pathParams: zod_1.z.object({
            clusterId: zod_1.z.string(),
        }),
        body: zod_1.z.object({
            name: zod_1.z.string(),
        }),
        responses: {
            200: zod_1.z.object({
                id: zod_1.z.string(),
                key: zod_1.z.string(),
            }),
        },
    },
    listApiKeys: {
        method: "GET",
        path: "/clusters/:clusterId/api-keys",
        headers: zod_1.z.object({ authorization: zod_1.z.string() }),
        pathParams: zod_1.z.object({
            clusterId: zod_1.z.string(),
        }),
        responses: {
            200: zod_1.z.array(zod_1.z.object({
                id: zod_1.z.string(),
                name: zod_1.z.string(),
                createdAt: zod_1.z.date(),
                createdBy: zod_1.z.string(),
                revokedAt: zod_1.z.date().nullable(),
            })),
        },
    },
    revokeApiKey: {
        method: "DELETE",
        path: "/clusters/:clusterId/api-keys/:keyId",
        headers: zod_1.z.object({ authorization: zod_1.z.string() }),
        pathParams: zod_1.z.object({
            clusterId: zod_1.z.string(),
            keyId: zod_1.z.string(),
        }),
        body: zod_1.z.undefined(),
        responses: {
            204: zod_1.z.undefined(),
        },
    },
    listMachines: {
        method: "GET",
        path: "/clusters/:clusterId/machines",
        headers: zod_1.z.object({
            authorization: zod_1.z.string(),
        }),
        query: zod_1.z.object({
            limit: zod_1.z.coerce.number().min(10).max(50).default(50),
        }),
        responses: {
            200: zod_1.z.array(zod_1.z.object({
                id: zod_1.z.string(),
                lastPingAt: zod_1.z.date(),
                ip: zod_1.z.string(),
            })),
        },
        pathParams: zod_1.z.object({
            clusterId: zod_1.z.string(),
        }),
    },
    // Tool Endpoints
    listTools: {
        method: "GET",
        path: "/clusters/:clusterId/tools",
        headers: zod_1.z.object({
            authorization: zod_1.z.string(),
        }),
        pathParams: zod_1.z.object({
            clusterId: zod_1.z.string(),
        }),
        responses: {
            200: zod_1.z.array(zod_1.z.object({
                name: zod_1.z.string(),
                description: zod_1.z.string().nullable(),
                schema: zod_1.z.string().nullable(),
                config: exports.ToolConfigSchema.nullable(),
                shouldExpire: zod_1.z.boolean(),
                lastPingAt: zod_1.z.date().nullable(),
                createdAt: zod_1.z.date(),
            })),
            401: zod_1.z.undefined(),
        },
    },
};
exports.contract = c.router(exports.definition);
//# sourceMappingURL=contract.js.map