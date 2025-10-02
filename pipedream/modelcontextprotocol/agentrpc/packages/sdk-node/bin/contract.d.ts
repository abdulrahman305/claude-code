import { z } from "zod";
export declare const notificationSchema: z.ZodObject<{
    destination: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"slack">;
        channelId: z.ZodOptional<z.ZodString>;
        threadId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "slack";
        channelId?: string | undefined;
        threadId?: string | undefined;
        userId?: string | undefined;
        email?: string | undefined;
    }, {
        type: "slack";
        channelId?: string | undefined;
        threadId?: string | undefined;
        userId?: string | undefined;
        email?: string | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"email">;
        email: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "email";
        email: string;
    }, {
        type: "email";
        email: string;
    }>]>>;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message?: string | undefined;
    destination?: {
        type: "slack";
        channelId?: string | undefined;
        threadId?: string | undefined;
        userId?: string | undefined;
        email?: string | undefined;
    } | {
        type: "email";
        email: string;
    } | undefined;
}, {
    message?: string | undefined;
    destination?: {
        type: "slack";
        channelId?: string | undefined;
        threadId?: string | undefined;
        userId?: string | undefined;
        email?: string | undefined;
    } | {
        type: "email";
        email: string;
    } | undefined;
}>;
export declare const interruptSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodEnum<["approval", "general"]>;
    notification: z.ZodOptional<z.ZodObject<{
        destination: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
            type: z.ZodLiteral<"slack">;
            channelId: z.ZodOptional<z.ZodString>;
            threadId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "slack";
            channelId?: string | undefined;
            threadId?: string | undefined;
            userId?: string | undefined;
            email?: string | undefined;
        }, {
            type: "slack";
            channelId?: string | undefined;
            threadId?: string | undefined;
            userId?: string | undefined;
            email?: string | undefined;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"email">;
            email: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "email";
            email: string;
        }, {
            type: "email";
            email: string;
        }>]>>;
        message: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        message?: string | undefined;
        destination?: {
            type: "slack";
            channelId?: string | undefined;
            threadId?: string | undefined;
            userId?: string | undefined;
            email?: string | undefined;
        } | {
            type: "email";
            email: string;
        } | undefined;
    }, {
        message?: string | undefined;
        destination?: {
            type: "slack";
            channelId?: string | undefined;
            threadId?: string | undefined;
            userId?: string | undefined;
            email?: string | undefined;
        } | {
            type: "email";
            email: string;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: "approval" | "general";
    notification?: {
        message?: string | undefined;
        destination?: {
            type: "slack";
            channelId?: string | undefined;
            threadId?: string | undefined;
            userId?: string | undefined;
            email?: string | undefined;
        } | {
            type: "email";
            email: string;
        } | undefined;
    } | undefined;
}, {
    type: "approval" | "general";
    notification?: {
        message?: string | undefined;
        destination?: {
            type: "slack";
            channelId?: string | undefined;
            threadId?: string | undefined;
            userId?: string | undefined;
            email?: string | undefined;
        } | {
            type: "email";
            email: string;
        } | undefined;
    } | undefined;
}>]>;
export declare const ToolConfigSchema: z.ZodObject<{
    cache: z.ZodOptional<z.ZodObject<{
        keyPath: z.ZodString;
        ttlSeconds: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        keyPath: string;
        ttlSeconds: number;
    }, {
        keyPath: string;
        ttlSeconds: number;
    }>>;
    retryCountOnStall: z.ZodOptional<z.ZodNumber>;
    timeoutSeconds: z.ZodOptional<z.ZodNumber>;
    private: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    cache?: {
        keyPath: string;
        ttlSeconds: number;
    } | undefined;
    retryCountOnStall?: number | undefined;
    timeoutSeconds?: number | undefined;
    private?: boolean | undefined;
}, {
    cache?: {
        keyPath: string;
        ttlSeconds: number;
    } | undefined;
    retryCountOnStall?: number | undefined;
    timeoutSeconds?: number | undefined;
    private?: boolean | undefined;
}>;
export declare const definition: {
    readonly live: {
        readonly method: "GET";
        readonly path: "/live";
        readonly responses: {
            readonly 200: z.ZodObject<{
                status: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                status: string;
            }, {
                status: string;
            }>;
        };
    };
    readonly createEphemeralSetup: {
        readonly method: "POST";
        readonly path: "/ephemeral-setup";
        readonly responses: {
            readonly 200: z.ZodObject<{
                clusterId: z.ZodString;
                apiKey: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                clusterId: string;
                apiKey: string;
            }, {
                clusterId: string;
                apiKey: string;
            }>;
        };
        readonly body: z.ZodUndefined;
    };
    readonly getContract: {
        readonly method: "GET";
        readonly path: "/contract";
        readonly responses: {
            readonly 200: z.ZodObject<{
                contract: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                contract: string;
            }, {
                contract: string;
            }>;
        };
    };
    readonly getJob: {
        readonly method: "GET";
        readonly path: "/clusters/:clusterId/jobs/:jobId";
        readonly headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
            jobId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
            jobId: string;
        }, {
            clusterId: string;
            jobId: string;
        }>;
        readonly query: z.ZodObject<{
            waitTime: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            waitTime: number;
        }, {
            waitTime?: number | undefined;
        }>;
        readonly responses: {
            readonly 200: z.ZodObject<{
                id: z.ZodString;
                status: z.ZodString;
                targetFn: z.ZodString;
                executingMachineId: z.ZodNullable<z.ZodString>;
                targetArgs: z.ZodString;
                result: z.ZodNullable<z.ZodAny>;
                resultType: z.ZodNullable<z.ZodString>;
                createdAt: z.ZodDate;
                approved: z.ZodNullable<z.ZodBoolean>;
                approvalRequested: z.ZodNullable<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                status: string;
                id: string;
                targetFn: string;
                executingMachineId: string | null;
                targetArgs: string;
                resultType: string | null;
                createdAt: Date;
                approved: boolean | null;
                approvalRequested: boolean | null;
                result?: any;
            }, {
                status: string;
                id: string;
                targetFn: string;
                executingMachineId: string | null;
                targetArgs: string;
                resultType: string | null;
                createdAt: Date;
                approved: boolean | null;
                approvalRequested: boolean | null;
                result?: any;
            }>;
        };
    };
    readonly getJobListing: {
        readonly method: "GET";
        readonly path: "/clusters/:clusterId/job-listing";
        readonly headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
        }, {
            clusterId: string;
        }>;
        readonly query: z.ZodObject<{
            limit: z.ZodString;
            status: z.ZodOptional<z.ZodEnum<["pending", "running", "done", "failure", "stalled", "interrupted"]>>;
            targetFn: z.ZodOptional<z.ZodString>;
            after: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            limit: string;
            status?: "pending" | "running" | "done" | "failure" | "stalled" | "interrupted" | undefined;
            targetFn?: string | undefined;
            after?: string | undefined;
        }, {
            limit: string;
            status?: "pending" | "running" | "done" | "failure" | "stalled" | "interrupted" | undefined;
            targetFn?: string | undefined;
            after?: string | undefined;
        }>;
        readonly responses: {
            readonly 200: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                status: z.ZodString;
                targetFn: z.ZodString;
                executingMachineId: z.ZodNullable<z.ZodString>;
                createdAt: z.ZodDate;
                approved: z.ZodNullable<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                status: string;
                id: string;
                targetFn: string;
                executingMachineId: string | null;
                createdAt: Date;
                approved: boolean | null;
            }, {
                status: string;
                id: string;
                targetFn: string;
                executingMachineId: string | null;
                createdAt: Date;
                approved: boolean | null;
            }>, "many">;
        };
    };
    readonly createJob: {
        readonly method: "POST";
        readonly path: "/clusters/:clusterId/jobs";
        readonly query: z.ZodObject<{
            waitTime: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            waitTime: number;
        }, {
            waitTime?: number | undefined;
        }>;
        readonly headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        readonly body: z.ZodObject<{
            function: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            input: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
        }, "strip", z.ZodTypeAny, {
            input: {} & {
                [k: string]: unknown;
            };
            function?: string | undefined;
            tool?: string | undefined;
        }, {
            input: {} & {
                [k: string]: unknown;
            };
            function?: string | undefined;
            tool?: string | undefined;
        }>;
        readonly responses: {
            readonly 401: z.ZodUndefined;
            readonly 200: z.ZodObject<{
                id: z.ZodString;
                result: z.ZodNullable<z.ZodAny>;
                resultType: z.ZodNullable<z.ZodEnum<["resolution", "rejection", "interrupt"]>>;
                status: z.ZodEnum<["pending", "running", "done", "failure", "stalled", "interrupted"]>;
            }, "strip", z.ZodTypeAny, {
                status: "pending" | "running" | "done" | "failure" | "stalled" | "interrupted";
                id: string;
                resultType: "resolution" | "rejection" | "interrupt" | null;
                result?: any;
            }, {
                status: "pending" | "running" | "done" | "failure" | "stalled" | "interrupted";
                id: string;
                resultType: "resolution" | "rejection" | "interrupt" | null;
                result?: any;
            }>;
        };
    };
    readonly cancelJob: {
        readonly method: "POST";
        readonly path: "/clusters/:clusterId/jobs/:jobId/cancel";
        readonly headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
            jobId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
            jobId: string;
        }, {
            clusterId: string;
            jobId: string;
        }>;
        readonly responses: {
            readonly 204: z.ZodUndefined;
            readonly 401: z.ZodUndefined;
        };
        readonly body: z.ZodUndefined;
    };
    readonly createJobResult: {
        readonly method: "POST";
        readonly path: "/clusters/:clusterId/jobs/:jobId/result";
        readonly headers: z.ZodObject<{
            "x-machine-id": z.ZodOptional<z.ZodString>;
            "x-machine-sdk-version": z.ZodOptional<z.ZodString>;
            "x-machine-sdk-language": z.ZodOptional<z.ZodString>;
            "x-forwarded-for": z.ZodOptional<z.ZodOptional<z.ZodString>>;
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
            "x-machine-id"?: string | undefined;
            "x-machine-sdk-version"?: string | undefined;
            "x-machine-sdk-language"?: string | undefined;
            "x-forwarded-for"?: string | undefined;
        }, {
            authorization: string;
            "x-machine-id"?: string | undefined;
            "x-machine-sdk-version"?: string | undefined;
            "x-machine-sdk-language"?: string | undefined;
            "x-forwarded-for"?: string | undefined;
        }>;
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
            jobId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
            jobId: string;
        }, {
            clusterId: string;
            jobId: string;
        }>;
        readonly responses: {
            readonly 204: z.ZodUndefined;
            readonly 401: z.ZodUndefined;
        };
        readonly body: z.ZodObject<{
            result: z.ZodAny;
            resultType: z.ZodEnum<["resolution", "rejection", "interrupt"]>;
            meta: z.ZodObject<{
                functionExecutionTime: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                functionExecutionTime?: number | undefined;
            }, {
                functionExecutionTime?: number | undefined;
            }>;
        }, "strip", z.ZodTypeAny, {
            resultType: "resolution" | "rejection" | "interrupt";
            meta: {
                functionExecutionTime?: number | undefined;
            };
            result?: any;
        }, {
            resultType: "resolution" | "rejection" | "interrupt";
            meta: {
                functionExecutionTime?: number | undefined;
            };
            result?: any;
        }>;
    };
    readonly listJobs: {
        readonly method: "GET";
        readonly path: "/clusters/:clusterId/jobs";
        readonly query: z.ZodObject<{
            tools: z.ZodOptional<z.ZodString>;
            status: z.ZodDefault<z.ZodEnum<["pending", "running", "paused", "done", "failed"]>>;
            limit: z.ZodDefault<z.ZodNumber>;
            acknowledge: z.ZodDefault<z.ZodBoolean>;
            waitTime: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            status: "pending" | "running" | "done" | "paused" | "failed";
            waitTime: number;
            limit: number;
            acknowledge: boolean;
            tools?: string | undefined;
        }, {
            status?: "pending" | "running" | "done" | "paused" | "failed" | undefined;
            waitTime?: number | undefined;
            limit?: number | undefined;
            tools?: string | undefined;
            acknowledge?: boolean | undefined;
        }>;
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
        }, {
            clusterId: string;
        }>;
        readonly headers: z.ZodObject<{
            "x-machine-id": z.ZodOptional<z.ZodString>;
            "x-machine-sdk-version": z.ZodOptional<z.ZodString>;
            "x-machine-sdk-language": z.ZodOptional<z.ZodString>;
            "x-forwarded-for": z.ZodOptional<z.ZodOptional<z.ZodString>>;
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
            "x-machine-id"?: string | undefined;
            "x-machine-sdk-version"?: string | undefined;
            "x-machine-sdk-language"?: string | undefined;
            "x-forwarded-for"?: string | undefined;
        }, {
            authorization: string;
            "x-machine-id"?: string | undefined;
            "x-machine-sdk-version"?: string | undefined;
            "x-machine-sdk-language"?: string | undefined;
            "x-forwarded-for"?: string | undefined;
        }>;
        readonly responses: {
            readonly 401: z.ZodUndefined;
            readonly 410: z.ZodObject<{
                message: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                message: string;
            }, {
                message: string;
            }>;
            readonly 200: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                function: z.ZodString;
                input: z.ZodAny;
                authContext: z.ZodNullable<z.ZodAny>;
                runContext: z.ZodNullable<z.ZodAny>;
                approved: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                function: string;
                id: string;
                approved: boolean;
                input?: any;
                authContext?: any;
                runContext?: any;
            }, {
                function: string;
                id: string;
                approved: boolean;
                input?: any;
                authContext?: any;
                runContext?: any;
            }>, "many">;
        };
    };
    readonly createJobApproval: {
        readonly method: "POST";
        readonly path: "/clusters/:clusterId/jobs/:jobId/approval";
        readonly headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
            jobId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
            jobId: string;
        }, {
            clusterId: string;
            jobId: string;
        }>;
        readonly responses: {
            readonly 204: z.ZodUndefined;
            readonly 404: z.ZodObject<{
                message: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                message: string;
            }, {
                message: string;
            }>;
        };
        readonly body: z.ZodObject<{
            approved: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            approved: boolean;
        }, {
            approved: boolean;
        }>;
    };
    readonly createMachine: {
        readonly method: "POST";
        readonly path: "/machines";
        readonly headers: z.ZodObject<{
            "x-machine-id": z.ZodOptional<z.ZodString>;
            "x-machine-sdk-version": z.ZodOptional<z.ZodString>;
            "x-machine-sdk-language": z.ZodOptional<z.ZodString>;
            "x-forwarded-for": z.ZodOptional<z.ZodOptional<z.ZodString>>;
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
            "x-machine-id"?: string | undefined;
            "x-machine-sdk-version"?: string | undefined;
            "x-machine-sdk-language"?: string | undefined;
            "x-forwarded-for"?: string | undefined;
        }, {
            authorization: string;
            "x-machine-id"?: string | undefined;
            "x-machine-sdk-version"?: string | undefined;
            "x-machine-sdk-language"?: string | undefined;
            "x-forwarded-for"?: string | undefined;
        }>;
        readonly body: z.ZodObject<{
            functions: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                schema: z.ZodOptional<z.ZodString>;
                config: z.ZodOptional<z.ZodObject<{
                    cache: z.ZodOptional<z.ZodObject<{
                        keyPath: z.ZodString;
                        ttlSeconds: z.ZodNumber;
                    }, "strip", z.ZodTypeAny, {
                        keyPath: string;
                        ttlSeconds: number;
                    }, {
                        keyPath: string;
                        ttlSeconds: number;
                    }>>;
                    retryCountOnStall: z.ZodOptional<z.ZodNumber>;
                    timeoutSeconds: z.ZodOptional<z.ZodNumber>;
                    private: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
                }, "strip", z.ZodTypeAny, {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                }, {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                }>>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                description?: string | undefined;
                schema?: string | undefined;
                config?: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | undefined;
            }, {
                name: string;
                description?: string | undefined;
                schema?: string | undefined;
                config?: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | undefined;
            }>, "many">>;
            tools: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                schema: z.ZodOptional<z.ZodString>;
                config: z.ZodOptional<z.ZodObject<{
                    cache: z.ZodOptional<z.ZodObject<{
                        keyPath: z.ZodString;
                        ttlSeconds: z.ZodNumber;
                    }, "strip", z.ZodTypeAny, {
                        keyPath: string;
                        ttlSeconds: number;
                    }, {
                        keyPath: string;
                        ttlSeconds: number;
                    }>>;
                    retryCountOnStall: z.ZodOptional<z.ZodNumber>;
                    timeoutSeconds: z.ZodOptional<z.ZodNumber>;
                    private: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
                }, "strip", z.ZodTypeAny, {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                }, {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                }>>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                description?: string | undefined;
                schema?: string | undefined;
                config?: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | undefined;
            }, {
                name: string;
                description?: string | undefined;
                schema?: string | undefined;
                config?: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | undefined;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            tools?: {
                name: string;
                description?: string | undefined;
                schema?: string | undefined;
                config?: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | undefined;
            }[] | undefined;
            functions?: {
                name: string;
                description?: string | undefined;
                schema?: string | undefined;
                config?: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | undefined;
            }[] | undefined;
        }, {
            tools?: {
                name: string;
                description?: string | undefined;
                schema?: string | undefined;
                config?: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | undefined;
            }[] | undefined;
            functions?: {
                name: string;
                description?: string | undefined;
                schema?: string | undefined;
                config?: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | undefined;
            }[] | undefined;
        }>;
        readonly responses: {
            readonly 200: z.ZodObject<{
                clusterId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                clusterId: string;
            }, {
                clusterId: string;
            }>;
            readonly 204: z.ZodUndefined;
        };
    };
    readonly createCluster: {
        readonly method: "POST";
        readonly path: "/clusters";
        readonly headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        readonly responses: {
            readonly 204: z.ZodUndefined;
        };
        readonly body: z.ZodObject<{
            description: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            isDemo: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            isDemo: boolean;
            name?: string | undefined;
        }, {
            description: string;
            name?: string | undefined;
            isDemo?: boolean | undefined;
        }>;
    };
    readonly deleteCluster: {
        readonly method: "DELETE";
        readonly path: "/clusters/:clusterId";
        readonly headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        readonly body: z.ZodUndefined;
        readonly responses: {
            readonly 204: z.ZodUndefined;
        };
    };
    readonly updateCluster: {
        readonly method: "PUT";
        readonly path: "/clusters/:clusterId";
        readonly headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        readonly responses: {
            readonly 204: z.ZodUndefined;
            readonly 401: z.ZodUndefined;
        };
        readonly body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            debug: z.ZodOptional<z.ZodBoolean>;
            enableCustomAuth: z.ZodOptional<z.ZodBoolean>;
            enableKnowledgebase: z.ZodOptional<z.ZodBoolean>;
            handleCustomAuthFunction: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name?: string | undefined;
            description?: string | undefined;
            debug?: boolean | undefined;
            enableCustomAuth?: boolean | undefined;
            enableKnowledgebase?: boolean | undefined;
            handleCustomAuthFunction?: string | undefined;
        }, {
            name?: string | undefined;
            description?: string | undefined;
            debug?: boolean | undefined;
            enableCustomAuth?: boolean | undefined;
            enableKnowledgebase?: boolean | undefined;
            handleCustomAuthFunction?: string | undefined;
        }>;
    };
    readonly getCluster: {
        readonly method: "GET";
        readonly path: "/clusters/:clusterId";
        readonly headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        readonly responses: {
            readonly 200: z.ZodObject<{
                id: z.ZodString;
                name: z.ZodString;
                description: z.ZodNullable<z.ZodString>;
                createdAt: z.ZodNumber;
                debug: z.ZodBoolean;
                enableCustomAuth: z.ZodBoolean;
                handleCustomAuthFunction: z.ZodNullable<z.ZodString>;
                isDemo: z.ZodBoolean;
                machines: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    lastPingAt: z.ZodNullable<z.ZodNumber>;
                    ip: z.ZodNullable<z.ZodString>;
                    sdkVersion: z.ZodNullable<z.ZodString>;
                    sdkLanguage: z.ZodNullable<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                    lastPingAt: number | null;
                    ip: string | null;
                    sdkVersion: string | null;
                    sdkLanguage: string | null;
                }, {
                    id: string;
                    lastPingAt: number | null;
                    ip: string | null;
                    sdkVersion: string | null;
                    sdkLanguage: string | null;
                }>, "many">;
                tools: z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    description: z.ZodNullable<z.ZodString>;
                    schema: z.ZodNullable<z.ZodUnknown>;
                    config: z.ZodNullable<z.ZodUnknown>;
                    shouldExpire: z.ZodBoolean;
                    createdAt: z.ZodNumber;
                    lastPingAt: z.ZodNullable<z.ZodNumber>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    createdAt: number;
                    description: string | null;
                    lastPingAt: number | null;
                    shouldExpire: boolean;
                    schema?: unknown;
                    config?: unknown;
                }, {
                    name: string;
                    createdAt: number;
                    description: string | null;
                    lastPingAt: number | null;
                    shouldExpire: boolean;
                    schema?: unknown;
                    config?: unknown;
                }>, "many">;
            }, "strip", z.ZodTypeAny, {
                name: string;
                id: string;
                createdAt: number;
                tools: {
                    name: string;
                    createdAt: number;
                    description: string | null;
                    lastPingAt: number | null;
                    shouldExpire: boolean;
                    schema?: unknown;
                    config?: unknown;
                }[];
                description: string | null;
                isDemo: boolean;
                debug: boolean;
                enableCustomAuth: boolean;
                handleCustomAuthFunction: string | null;
                machines: {
                    id: string;
                    lastPingAt: number | null;
                    ip: string | null;
                    sdkVersion: string | null;
                    sdkLanguage: string | null;
                }[];
            }, {
                name: string;
                id: string;
                createdAt: number;
                tools: {
                    name: string;
                    createdAt: number;
                    description: string | null;
                    lastPingAt: number | null;
                    shouldExpire: boolean;
                    schema?: unknown;
                    config?: unknown;
                }[];
                description: string | null;
                isDemo: boolean;
                debug: boolean;
                enableCustomAuth: boolean;
                handleCustomAuthFunction: string | null;
                machines: {
                    id: string;
                    lastPingAt: number | null;
                    ip: string | null;
                    sdkVersion: string | null;
                    sdkLanguage: string | null;
                }[];
            }>;
            readonly 401: z.ZodUndefined;
            readonly 404: z.ZodUndefined;
        };
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
        }, {
            clusterId: string;
        }>;
    };
    readonly listClusters: {
        readonly method: "GET";
        readonly path: "/clusters";
        readonly headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        readonly responses: {
            readonly 200: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodString;
                createdAt: z.ZodDate;
                description: z.ZodNullable<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                id: string;
                createdAt: Date;
                description: string | null;
            }, {
                name: string;
                id: string;
                createdAt: Date;
                description: string | null;
            }>, "many">;
            readonly 401: z.ZodUndefined;
        };
    };
    readonly listEvents: {
        readonly method: "GET";
        readonly path: "/clusters/:clusterId/events";
        readonly headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        readonly responses: {
            readonly 200: z.ZodArray<z.ZodObject<{
                type: z.ZodString;
                machineId: z.ZodNullable<z.ZodString>;
                createdAt: z.ZodDate;
                jobId: z.ZodNullable<z.ZodString>;
                targetFn: z.ZodNullable<z.ZodString>;
                resultType: z.ZodNullable<z.ZodString>;
                status: z.ZodNullable<z.ZodString>;
                runId: z.ZodNullable<z.ZodString>;
                meta: z.ZodNullable<z.ZodAny>;
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: string;
                status: string | null;
                jobId: string | null;
                id: string;
                targetFn: string | null;
                resultType: string | null;
                createdAt: Date;
                machineId: string | null;
                runId: string | null;
                meta?: any;
            }, {
                type: string;
                status: string | null;
                jobId: string | null;
                id: string;
                targetFn: string | null;
                resultType: string | null;
                createdAt: Date;
                machineId: string | null;
                runId: string | null;
                meta?: any;
            }>, "many">;
            readonly 401: z.ZodUndefined;
            readonly 404: z.ZodUndefined;
        };
        readonly query: z.ZodObject<{
            type: z.ZodOptional<z.ZodString>;
            jobId: z.ZodOptional<z.ZodString>;
            machineId: z.ZodOptional<z.ZodString>;
            runId: z.ZodOptional<z.ZodString>;
            includeMeta: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type?: string | undefined;
            jobId?: string | undefined;
            machineId?: string | undefined;
            runId?: string | undefined;
            includeMeta?: string | undefined;
        }, {
            type?: string | undefined;
            jobId?: string | undefined;
            machineId?: string | undefined;
            runId?: string | undefined;
            includeMeta?: string | undefined;
        }>;
    };
    readonly getEventMeta: {
        readonly method: "GET";
        readonly path: "/clusters/:clusterId/events/:eventId/meta";
        readonly headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        readonly responses: {
            readonly 200: z.ZodObject<{
                type: z.ZodString;
                machineId: z.ZodNullable<z.ZodString>;
                createdAt: z.ZodDate;
                jobId: z.ZodNullable<z.ZodString>;
                targetFn: z.ZodNullable<z.ZodString>;
                resultType: z.ZodNullable<z.ZodString>;
                status: z.ZodNullable<z.ZodString>;
                meta: z.ZodUnknown;
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: string;
                status: string | null;
                jobId: string | null;
                id: string;
                targetFn: string | null;
                resultType: string | null;
                createdAt: Date;
                machineId: string | null;
                meta?: unknown;
            }, {
                type: string;
                status: string | null;
                jobId: string | null;
                id: string;
                targetFn: string | null;
                resultType: string | null;
                createdAt: Date;
                machineId: string | null;
                meta?: unknown;
            }>;
            readonly 401: z.ZodUndefined;
            readonly 404: z.ZodUndefined;
        };
    };
    readonly oas: {
        readonly method: "GET";
        readonly path: "/public/oas.json";
        readonly responses: {
            readonly 200: z.ZodUnknown;
        };
    };
    readonly createApiKey: {
        readonly method: "POST";
        readonly path: "/clusters/:clusterId/api-keys";
        readonly headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
        }, {
            clusterId: string;
        }>;
        readonly body: z.ZodObject<{
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
        }, {
            name: string;
        }>;
        readonly responses: {
            readonly 200: z.ZodObject<{
                id: z.ZodString;
                key: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                key: string;
                id: string;
            }, {
                key: string;
                id: string;
            }>;
        };
    };
    readonly listApiKeys: {
        readonly method: "GET";
        readonly path: "/clusters/:clusterId/api-keys";
        readonly headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
        }, {
            clusterId: string;
        }>;
        readonly responses: {
            readonly 200: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodString;
                createdAt: z.ZodDate;
                createdBy: z.ZodString;
                revokedAt: z.ZodNullable<z.ZodDate>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                id: string;
                createdAt: Date;
                createdBy: string;
                revokedAt: Date | null;
            }, {
                name: string;
                id: string;
                createdAt: Date;
                createdBy: string;
                revokedAt: Date | null;
            }>, "many">;
        };
    };
    readonly revokeApiKey: {
        readonly method: "DELETE";
        readonly path: "/clusters/:clusterId/api-keys/:keyId";
        readonly headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
            keyId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
            keyId: string;
        }, {
            clusterId: string;
            keyId: string;
        }>;
        readonly body: z.ZodUndefined;
        readonly responses: {
            readonly 204: z.ZodUndefined;
        };
    };
    readonly listMachines: {
        readonly method: "GET";
        readonly path: "/clusters/:clusterId/machines";
        readonly headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        readonly query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            limit: number;
        }, {
            limit?: number | undefined;
        }>;
        readonly responses: {
            readonly 200: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                lastPingAt: z.ZodDate;
                ip: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
                lastPingAt: Date;
                ip: string;
            }, {
                id: string;
                lastPingAt: Date;
                ip: string;
            }>, "many">;
        };
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
        }, {
            clusterId: string;
        }>;
    };
    readonly listTools: {
        readonly method: "GET";
        readonly path: "/clusters/:clusterId/tools";
        readonly headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
        }, {
            clusterId: string;
        }>;
        readonly responses: {
            readonly 200: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                description: z.ZodNullable<z.ZodString>;
                schema: z.ZodNullable<z.ZodString>;
                config: z.ZodNullable<z.ZodObject<{
                    cache: z.ZodOptional<z.ZodObject<{
                        keyPath: z.ZodString;
                        ttlSeconds: z.ZodNumber;
                    }, "strip", z.ZodTypeAny, {
                        keyPath: string;
                        ttlSeconds: number;
                    }, {
                        keyPath: string;
                        ttlSeconds: number;
                    }>>;
                    retryCountOnStall: z.ZodOptional<z.ZodNumber>;
                    timeoutSeconds: z.ZodOptional<z.ZodNumber>;
                    private: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
                }, "strip", z.ZodTypeAny, {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                }, {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                }>>;
                shouldExpire: z.ZodBoolean;
                lastPingAt: z.ZodNullable<z.ZodDate>;
                createdAt: z.ZodDate;
            }, "strip", z.ZodTypeAny, {
                name: string;
                createdAt: Date;
                description: string | null;
                schema: string | null;
                config: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | null;
                lastPingAt: Date | null;
                shouldExpire: boolean;
            }, {
                name: string;
                createdAt: Date;
                description: string | null;
                schema: string | null;
                config: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | null;
                lastPingAt: Date | null;
                shouldExpire: boolean;
            }>, "many">;
            readonly 401: z.ZodUndefined;
        };
    };
};
export declare const contract: {
    readonly live: {
        readonly method: "GET";
        path: "/live";
        responses: {
            readonly 200: z.ZodObject<{
                status: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                status: string;
            }, {
                status: string;
            }>;
        };
    };
    readonly createEphemeralSetup: {
        readonly method: "POST";
        readonly body: z.ZodUndefined;
        path: "/ephemeral-setup";
        responses: {
            readonly 200: z.ZodObject<{
                clusterId: z.ZodString;
                apiKey: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                clusterId: string;
                apiKey: string;
            }, {
                clusterId: string;
                apiKey: string;
            }>;
        };
    };
    readonly getContract: {
        readonly method: "GET";
        path: "/contract";
        responses: {
            readonly 200: z.ZodObject<{
                contract: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                contract: string;
            }, {
                contract: string;
            }>;
        };
    };
    readonly getJob: {
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
            jobId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
            jobId: string;
        }, {
            clusterId: string;
            jobId: string;
        }>;
        readonly query: z.ZodObject<{
            waitTime: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            waitTime: number;
        }, {
            waitTime?: number | undefined;
        }>;
        readonly method: "GET";
        path: "/clusters/:clusterId/jobs/:jobId";
        headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        responses: {
            readonly 200: z.ZodObject<{
                id: z.ZodString;
                status: z.ZodString;
                targetFn: z.ZodString;
                executingMachineId: z.ZodNullable<z.ZodString>;
                targetArgs: z.ZodString;
                result: z.ZodNullable<z.ZodAny>;
                resultType: z.ZodNullable<z.ZodString>;
                createdAt: z.ZodDate;
                approved: z.ZodNullable<z.ZodBoolean>;
                approvalRequested: z.ZodNullable<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                status: string;
                id: string;
                targetFn: string;
                executingMachineId: string | null;
                targetArgs: string;
                resultType: string | null;
                createdAt: Date;
                approved: boolean | null;
                approvalRequested: boolean | null;
                result?: any;
            }, {
                status: string;
                id: string;
                targetFn: string;
                executingMachineId: string | null;
                targetArgs: string;
                resultType: string | null;
                createdAt: Date;
                approved: boolean | null;
                approvalRequested: boolean | null;
                result?: any;
            }>;
        };
    };
    readonly getJobListing: {
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
        }, {
            clusterId: string;
        }>;
        readonly query: z.ZodObject<{
            limit: z.ZodString;
            status: z.ZodOptional<z.ZodEnum<["pending", "running", "done", "failure", "stalled", "interrupted"]>>;
            targetFn: z.ZodOptional<z.ZodString>;
            after: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            limit: string;
            status?: "pending" | "running" | "done" | "failure" | "stalled" | "interrupted" | undefined;
            targetFn?: string | undefined;
            after?: string | undefined;
        }, {
            limit: string;
            status?: "pending" | "running" | "done" | "failure" | "stalled" | "interrupted" | undefined;
            targetFn?: string | undefined;
            after?: string | undefined;
        }>;
        readonly method: "GET";
        path: "/clusters/:clusterId/job-listing";
        headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        responses: {
            readonly 200: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                status: z.ZodString;
                targetFn: z.ZodString;
                executingMachineId: z.ZodNullable<z.ZodString>;
                createdAt: z.ZodDate;
                approved: z.ZodNullable<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                status: string;
                id: string;
                targetFn: string;
                executingMachineId: string | null;
                createdAt: Date;
                approved: boolean | null;
            }, {
                status: string;
                id: string;
                targetFn: string;
                executingMachineId: string | null;
                createdAt: Date;
                approved: boolean | null;
            }>, "many">;
        };
    };
    readonly createJob: {
        readonly query: z.ZodObject<{
            waitTime: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            waitTime: number;
        }, {
            waitTime?: number | undefined;
        }>;
        readonly method: "POST";
        readonly body: z.ZodObject<{
            function: z.ZodOptional<z.ZodString>;
            tool: z.ZodOptional<z.ZodString>;
            input: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
        }, "strip", z.ZodTypeAny, {
            input: {} & {
                [k: string]: unknown;
            };
            function?: string | undefined;
            tool?: string | undefined;
        }, {
            input: {} & {
                [k: string]: unknown;
            };
            function?: string | undefined;
            tool?: string | undefined;
        }>;
        path: "/clusters/:clusterId/jobs";
        headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        responses: {
            readonly 401: z.ZodUndefined;
            readonly 200: z.ZodObject<{
                id: z.ZodString;
                result: z.ZodNullable<z.ZodAny>;
                resultType: z.ZodNullable<z.ZodEnum<["resolution", "rejection", "interrupt"]>>;
                status: z.ZodEnum<["pending", "running", "done", "failure", "stalled", "interrupted"]>;
            }, "strip", z.ZodTypeAny, {
                status: "pending" | "running" | "done" | "failure" | "stalled" | "interrupted";
                id: string;
                resultType: "resolution" | "rejection" | "interrupt" | null;
                result?: any;
            }, {
                status: "pending" | "running" | "done" | "failure" | "stalled" | "interrupted";
                id: string;
                resultType: "resolution" | "rejection" | "interrupt" | null;
                result?: any;
            }>;
        };
    };
    readonly cancelJob: {
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
            jobId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
            jobId: string;
        }, {
            clusterId: string;
            jobId: string;
        }>;
        readonly method: "POST";
        readonly body: z.ZodUndefined;
        path: "/clusters/:clusterId/jobs/:jobId/cancel";
        headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        responses: {
            readonly 204: z.ZodUndefined;
            readonly 401: z.ZodUndefined;
        };
    };
    readonly createJobResult: {
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
            jobId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
            jobId: string;
        }, {
            clusterId: string;
            jobId: string;
        }>;
        readonly method: "POST";
        readonly body: z.ZodObject<{
            result: z.ZodAny;
            resultType: z.ZodEnum<["resolution", "rejection", "interrupt"]>;
            meta: z.ZodObject<{
                functionExecutionTime: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                functionExecutionTime?: number | undefined;
            }, {
                functionExecutionTime?: number | undefined;
            }>;
        }, "strip", z.ZodTypeAny, {
            resultType: "resolution" | "rejection" | "interrupt";
            meta: {
                functionExecutionTime?: number | undefined;
            };
            result?: any;
        }, {
            resultType: "resolution" | "rejection" | "interrupt";
            meta: {
                functionExecutionTime?: number | undefined;
            };
            result?: any;
        }>;
        path: "/clusters/:clusterId/jobs/:jobId/result";
        headers: z.ZodObject<{
            "x-machine-id": z.ZodOptional<z.ZodString>;
            "x-machine-sdk-version": z.ZodOptional<z.ZodString>;
            "x-machine-sdk-language": z.ZodOptional<z.ZodString>;
            "x-forwarded-for": z.ZodOptional<z.ZodOptional<z.ZodString>>;
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
            "x-machine-id"?: string | undefined;
            "x-machine-sdk-version"?: string | undefined;
            "x-machine-sdk-language"?: string | undefined;
            "x-forwarded-for"?: string | undefined;
        }, {
            authorization: string;
            "x-machine-id"?: string | undefined;
            "x-machine-sdk-version"?: string | undefined;
            "x-machine-sdk-language"?: string | undefined;
            "x-forwarded-for"?: string | undefined;
        }>;
        responses: {
            readonly 204: z.ZodUndefined;
            readonly 401: z.ZodUndefined;
        };
    };
    readonly listJobs: {
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
        }, {
            clusterId: string;
        }>;
        readonly query: z.ZodObject<{
            tools: z.ZodOptional<z.ZodString>;
            status: z.ZodDefault<z.ZodEnum<["pending", "running", "paused", "done", "failed"]>>;
            limit: z.ZodDefault<z.ZodNumber>;
            acknowledge: z.ZodDefault<z.ZodBoolean>;
            waitTime: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            status: "pending" | "running" | "done" | "paused" | "failed";
            waitTime: number;
            limit: number;
            acknowledge: boolean;
            tools?: string | undefined;
        }, {
            status?: "pending" | "running" | "done" | "paused" | "failed" | undefined;
            waitTime?: number | undefined;
            limit?: number | undefined;
            tools?: string | undefined;
            acknowledge?: boolean | undefined;
        }>;
        readonly method: "GET";
        path: "/clusters/:clusterId/jobs";
        headers: z.ZodObject<{
            "x-machine-id": z.ZodOptional<z.ZodString>;
            "x-machine-sdk-version": z.ZodOptional<z.ZodString>;
            "x-machine-sdk-language": z.ZodOptional<z.ZodString>;
            "x-forwarded-for": z.ZodOptional<z.ZodOptional<z.ZodString>>;
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
            "x-machine-id"?: string | undefined;
            "x-machine-sdk-version"?: string | undefined;
            "x-machine-sdk-language"?: string | undefined;
            "x-forwarded-for"?: string | undefined;
        }, {
            authorization: string;
            "x-machine-id"?: string | undefined;
            "x-machine-sdk-version"?: string | undefined;
            "x-machine-sdk-language"?: string | undefined;
            "x-forwarded-for"?: string | undefined;
        }>;
        responses: {
            readonly 401: z.ZodUndefined;
            readonly 410: z.ZodObject<{
                message: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                message: string;
            }, {
                message: string;
            }>;
            readonly 200: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                function: z.ZodString;
                input: z.ZodAny;
                authContext: z.ZodNullable<z.ZodAny>;
                runContext: z.ZodNullable<z.ZodAny>;
                approved: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                function: string;
                id: string;
                approved: boolean;
                input?: any;
                authContext?: any;
                runContext?: any;
            }, {
                function: string;
                id: string;
                approved: boolean;
                input?: any;
                authContext?: any;
                runContext?: any;
            }>, "many">;
        };
    };
    readonly createJobApproval: {
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
            jobId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
            jobId: string;
        }, {
            clusterId: string;
            jobId: string;
        }>;
        readonly method: "POST";
        readonly body: z.ZodObject<{
            approved: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            approved: boolean;
        }, {
            approved: boolean;
        }>;
        path: "/clusters/:clusterId/jobs/:jobId/approval";
        headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        responses: {
            readonly 204: z.ZodUndefined;
            readonly 404: z.ZodObject<{
                message: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                message: string;
            }, {
                message: string;
            }>;
        };
    };
    readonly createMachine: {
        readonly method: "POST";
        readonly body: z.ZodObject<{
            functions: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                schema: z.ZodOptional<z.ZodString>;
                config: z.ZodOptional<z.ZodObject<{
                    cache: z.ZodOptional<z.ZodObject<{
                        keyPath: z.ZodString;
                        ttlSeconds: z.ZodNumber;
                    }, "strip", z.ZodTypeAny, {
                        keyPath: string;
                        ttlSeconds: number;
                    }, {
                        keyPath: string;
                        ttlSeconds: number;
                    }>>;
                    retryCountOnStall: z.ZodOptional<z.ZodNumber>;
                    timeoutSeconds: z.ZodOptional<z.ZodNumber>;
                    private: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
                }, "strip", z.ZodTypeAny, {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                }, {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                }>>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                description?: string | undefined;
                schema?: string | undefined;
                config?: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | undefined;
            }, {
                name: string;
                description?: string | undefined;
                schema?: string | undefined;
                config?: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | undefined;
            }>, "many">>;
            tools: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                schema: z.ZodOptional<z.ZodString>;
                config: z.ZodOptional<z.ZodObject<{
                    cache: z.ZodOptional<z.ZodObject<{
                        keyPath: z.ZodString;
                        ttlSeconds: z.ZodNumber;
                    }, "strip", z.ZodTypeAny, {
                        keyPath: string;
                        ttlSeconds: number;
                    }, {
                        keyPath: string;
                        ttlSeconds: number;
                    }>>;
                    retryCountOnStall: z.ZodOptional<z.ZodNumber>;
                    timeoutSeconds: z.ZodOptional<z.ZodNumber>;
                    private: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
                }, "strip", z.ZodTypeAny, {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                }, {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                }>>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                description?: string | undefined;
                schema?: string | undefined;
                config?: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | undefined;
            }, {
                name: string;
                description?: string | undefined;
                schema?: string | undefined;
                config?: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | undefined;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            tools?: {
                name: string;
                description?: string | undefined;
                schema?: string | undefined;
                config?: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | undefined;
            }[] | undefined;
            functions?: {
                name: string;
                description?: string | undefined;
                schema?: string | undefined;
                config?: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | undefined;
            }[] | undefined;
        }, {
            tools?: {
                name: string;
                description?: string | undefined;
                schema?: string | undefined;
                config?: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | undefined;
            }[] | undefined;
            functions?: {
                name: string;
                description?: string | undefined;
                schema?: string | undefined;
                config?: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | undefined;
            }[] | undefined;
        }>;
        path: "/machines";
        headers: z.ZodObject<{
            "x-machine-id": z.ZodOptional<z.ZodString>;
            "x-machine-sdk-version": z.ZodOptional<z.ZodString>;
            "x-machine-sdk-language": z.ZodOptional<z.ZodString>;
            "x-forwarded-for": z.ZodOptional<z.ZodOptional<z.ZodString>>;
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
            "x-machine-id"?: string | undefined;
            "x-machine-sdk-version"?: string | undefined;
            "x-machine-sdk-language"?: string | undefined;
            "x-forwarded-for"?: string | undefined;
        }, {
            authorization: string;
            "x-machine-id"?: string | undefined;
            "x-machine-sdk-version"?: string | undefined;
            "x-machine-sdk-language"?: string | undefined;
            "x-forwarded-for"?: string | undefined;
        }>;
        responses: {
            readonly 200: z.ZodObject<{
                clusterId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                clusterId: string;
            }, {
                clusterId: string;
            }>;
            readonly 204: z.ZodUndefined;
        };
    };
    readonly createCluster: {
        readonly method: "POST";
        readonly body: z.ZodObject<{
            description: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            isDemo: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            isDemo: boolean;
            name?: string | undefined;
        }, {
            description: string;
            name?: string | undefined;
            isDemo?: boolean | undefined;
        }>;
        path: "/clusters";
        headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        responses: {
            readonly 204: z.ZodUndefined;
        };
    };
    readonly deleteCluster: {
        readonly method: "DELETE";
        readonly body: z.ZodUndefined;
        path: "/clusters/:clusterId";
        headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        responses: {
            readonly 204: z.ZodUndefined;
        };
    };
    readonly updateCluster: {
        readonly method: "PUT";
        readonly body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            debug: z.ZodOptional<z.ZodBoolean>;
            enableCustomAuth: z.ZodOptional<z.ZodBoolean>;
            enableKnowledgebase: z.ZodOptional<z.ZodBoolean>;
            handleCustomAuthFunction: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name?: string | undefined;
            description?: string | undefined;
            debug?: boolean | undefined;
            enableCustomAuth?: boolean | undefined;
            enableKnowledgebase?: boolean | undefined;
            handleCustomAuthFunction?: string | undefined;
        }, {
            name?: string | undefined;
            description?: string | undefined;
            debug?: boolean | undefined;
            enableCustomAuth?: boolean | undefined;
            enableKnowledgebase?: boolean | undefined;
            handleCustomAuthFunction?: string | undefined;
        }>;
        path: "/clusters/:clusterId";
        headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        responses: {
            readonly 204: z.ZodUndefined;
            readonly 401: z.ZodUndefined;
        };
    };
    readonly getCluster: {
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
        }, {
            clusterId: string;
        }>;
        readonly method: "GET";
        path: "/clusters/:clusterId";
        headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        responses: {
            readonly 200: z.ZodObject<{
                id: z.ZodString;
                name: z.ZodString;
                description: z.ZodNullable<z.ZodString>;
                createdAt: z.ZodNumber;
                debug: z.ZodBoolean;
                enableCustomAuth: z.ZodBoolean;
                handleCustomAuthFunction: z.ZodNullable<z.ZodString>;
                isDemo: z.ZodBoolean;
                machines: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    lastPingAt: z.ZodNullable<z.ZodNumber>;
                    ip: z.ZodNullable<z.ZodString>;
                    sdkVersion: z.ZodNullable<z.ZodString>;
                    sdkLanguage: z.ZodNullable<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                    lastPingAt: number | null;
                    ip: string | null;
                    sdkVersion: string | null;
                    sdkLanguage: string | null;
                }, {
                    id: string;
                    lastPingAt: number | null;
                    ip: string | null;
                    sdkVersion: string | null;
                    sdkLanguage: string | null;
                }>, "many">;
                tools: z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    description: z.ZodNullable<z.ZodString>;
                    schema: z.ZodNullable<z.ZodUnknown>;
                    config: z.ZodNullable<z.ZodUnknown>;
                    shouldExpire: z.ZodBoolean;
                    createdAt: z.ZodNumber;
                    lastPingAt: z.ZodNullable<z.ZodNumber>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    createdAt: number;
                    description: string | null;
                    lastPingAt: number | null;
                    shouldExpire: boolean;
                    schema?: unknown;
                    config?: unknown;
                }, {
                    name: string;
                    createdAt: number;
                    description: string | null;
                    lastPingAt: number | null;
                    shouldExpire: boolean;
                    schema?: unknown;
                    config?: unknown;
                }>, "many">;
            }, "strip", z.ZodTypeAny, {
                name: string;
                id: string;
                createdAt: number;
                tools: {
                    name: string;
                    createdAt: number;
                    description: string | null;
                    lastPingAt: number | null;
                    shouldExpire: boolean;
                    schema?: unknown;
                    config?: unknown;
                }[];
                description: string | null;
                isDemo: boolean;
                debug: boolean;
                enableCustomAuth: boolean;
                handleCustomAuthFunction: string | null;
                machines: {
                    id: string;
                    lastPingAt: number | null;
                    ip: string | null;
                    sdkVersion: string | null;
                    sdkLanguage: string | null;
                }[];
            }, {
                name: string;
                id: string;
                createdAt: number;
                tools: {
                    name: string;
                    createdAt: number;
                    description: string | null;
                    lastPingAt: number | null;
                    shouldExpire: boolean;
                    schema?: unknown;
                    config?: unknown;
                }[];
                description: string | null;
                isDemo: boolean;
                debug: boolean;
                enableCustomAuth: boolean;
                handleCustomAuthFunction: string | null;
                machines: {
                    id: string;
                    lastPingAt: number | null;
                    ip: string | null;
                    sdkVersion: string | null;
                    sdkLanguage: string | null;
                }[];
            }>;
            readonly 401: z.ZodUndefined;
            readonly 404: z.ZodUndefined;
        };
    };
    readonly listClusters: {
        readonly method: "GET";
        path: "/clusters";
        headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        responses: {
            readonly 200: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodString;
                createdAt: z.ZodDate;
                description: z.ZodNullable<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                id: string;
                createdAt: Date;
                description: string | null;
            }, {
                name: string;
                id: string;
                createdAt: Date;
                description: string | null;
            }>, "many">;
            readonly 401: z.ZodUndefined;
        };
    };
    readonly listEvents: {
        readonly query: z.ZodObject<{
            type: z.ZodOptional<z.ZodString>;
            jobId: z.ZodOptional<z.ZodString>;
            machineId: z.ZodOptional<z.ZodString>;
            runId: z.ZodOptional<z.ZodString>;
            includeMeta: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type?: string | undefined;
            jobId?: string | undefined;
            machineId?: string | undefined;
            runId?: string | undefined;
            includeMeta?: string | undefined;
        }, {
            type?: string | undefined;
            jobId?: string | undefined;
            machineId?: string | undefined;
            runId?: string | undefined;
            includeMeta?: string | undefined;
        }>;
        readonly method: "GET";
        path: "/clusters/:clusterId/events";
        headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        responses: {
            readonly 200: z.ZodArray<z.ZodObject<{
                type: z.ZodString;
                machineId: z.ZodNullable<z.ZodString>;
                createdAt: z.ZodDate;
                jobId: z.ZodNullable<z.ZodString>;
                targetFn: z.ZodNullable<z.ZodString>;
                resultType: z.ZodNullable<z.ZodString>;
                status: z.ZodNullable<z.ZodString>;
                runId: z.ZodNullable<z.ZodString>;
                meta: z.ZodNullable<z.ZodAny>;
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: string;
                status: string | null;
                jobId: string | null;
                id: string;
                targetFn: string | null;
                resultType: string | null;
                createdAt: Date;
                machineId: string | null;
                runId: string | null;
                meta?: any;
            }, {
                type: string;
                status: string | null;
                jobId: string | null;
                id: string;
                targetFn: string | null;
                resultType: string | null;
                createdAt: Date;
                machineId: string | null;
                runId: string | null;
                meta?: any;
            }>, "many">;
            readonly 401: z.ZodUndefined;
            readonly 404: z.ZodUndefined;
        };
    };
    readonly getEventMeta: {
        readonly method: "GET";
        path: "/clusters/:clusterId/events/:eventId/meta";
        headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        responses: {
            readonly 200: z.ZodObject<{
                type: z.ZodString;
                machineId: z.ZodNullable<z.ZodString>;
                createdAt: z.ZodDate;
                jobId: z.ZodNullable<z.ZodString>;
                targetFn: z.ZodNullable<z.ZodString>;
                resultType: z.ZodNullable<z.ZodString>;
                status: z.ZodNullable<z.ZodString>;
                meta: z.ZodUnknown;
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: string;
                status: string | null;
                jobId: string | null;
                id: string;
                targetFn: string | null;
                resultType: string | null;
                createdAt: Date;
                machineId: string | null;
                meta?: unknown;
            }, {
                type: string;
                status: string | null;
                jobId: string | null;
                id: string;
                targetFn: string | null;
                resultType: string | null;
                createdAt: Date;
                machineId: string | null;
                meta?: unknown;
            }>;
            readonly 401: z.ZodUndefined;
            readonly 404: z.ZodUndefined;
        };
    };
    readonly oas: {
        readonly method: "GET";
        path: "/public/oas.json";
        responses: {
            readonly 200: z.ZodUnknown;
        };
    };
    readonly createApiKey: {
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
        }, {
            clusterId: string;
        }>;
        readonly method: "POST";
        readonly body: z.ZodObject<{
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
        }, {
            name: string;
        }>;
        path: "/clusters/:clusterId/api-keys";
        headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        responses: {
            readonly 200: z.ZodObject<{
                id: z.ZodString;
                key: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                key: string;
                id: string;
            }, {
                key: string;
                id: string;
            }>;
        };
    };
    readonly listApiKeys: {
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
        }, {
            clusterId: string;
        }>;
        readonly method: "GET";
        path: "/clusters/:clusterId/api-keys";
        headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        responses: {
            readonly 200: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodString;
                createdAt: z.ZodDate;
                createdBy: z.ZodString;
                revokedAt: z.ZodNullable<z.ZodDate>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                id: string;
                createdAt: Date;
                createdBy: string;
                revokedAt: Date | null;
            }, {
                name: string;
                id: string;
                createdAt: Date;
                createdBy: string;
                revokedAt: Date | null;
            }>, "many">;
        };
    };
    readonly revokeApiKey: {
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
            keyId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
            keyId: string;
        }, {
            clusterId: string;
            keyId: string;
        }>;
        readonly method: "DELETE";
        readonly body: z.ZodUndefined;
        path: "/clusters/:clusterId/api-keys/:keyId";
        headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        responses: {
            readonly 204: z.ZodUndefined;
        };
    };
    readonly listMachines: {
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
        }, {
            clusterId: string;
        }>;
        readonly query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            limit: number;
        }, {
            limit?: number | undefined;
        }>;
        readonly method: "GET";
        path: "/clusters/:clusterId/machines";
        headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        responses: {
            readonly 200: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                lastPingAt: z.ZodDate;
                ip: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
                lastPingAt: Date;
                ip: string;
            }, {
                id: string;
                lastPingAt: Date;
                ip: string;
            }>, "many">;
        };
    };
    readonly listTools: {
        readonly pathParams: z.ZodObject<{
            clusterId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clusterId: string;
        }, {
            clusterId: string;
        }>;
        readonly method: "GET";
        path: "/clusters/:clusterId/tools";
        headers: z.ZodObject<{
            authorization: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            authorization: string;
        }, {
            authorization: string;
        }>;
        responses: {
            readonly 200: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                description: z.ZodNullable<z.ZodString>;
                schema: z.ZodNullable<z.ZodString>;
                config: z.ZodNullable<z.ZodObject<{
                    cache: z.ZodOptional<z.ZodObject<{
                        keyPath: z.ZodString;
                        ttlSeconds: z.ZodNumber;
                    }, "strip", z.ZodTypeAny, {
                        keyPath: string;
                        ttlSeconds: number;
                    }, {
                        keyPath: string;
                        ttlSeconds: number;
                    }>>;
                    retryCountOnStall: z.ZodOptional<z.ZodNumber>;
                    timeoutSeconds: z.ZodOptional<z.ZodNumber>;
                    private: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
                }, "strip", z.ZodTypeAny, {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                }, {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                }>>;
                shouldExpire: z.ZodBoolean;
                lastPingAt: z.ZodNullable<z.ZodDate>;
                createdAt: z.ZodDate;
            }, "strip", z.ZodTypeAny, {
                name: string;
                createdAt: Date;
                description: string | null;
                schema: string | null;
                config: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | null;
                lastPingAt: Date | null;
                shouldExpire: boolean;
            }, {
                name: string;
                createdAt: Date;
                description: string | null;
                schema: string | null;
                config: {
                    cache?: {
                        keyPath: string;
                        ttlSeconds: number;
                    } | undefined;
                    retryCountOnStall?: number | undefined;
                    timeoutSeconds?: number | undefined;
                    private?: boolean | undefined;
                } | null;
                lastPingAt: Date | null;
                shouldExpire: boolean;
            }>, "many">;
            readonly 401: z.ZodUndefined;
        };
    };
};
