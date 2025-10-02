/**
 * Provides raw API access to the Inferable API.
 */
export declare const createApiClient: ({ baseUrl, machineId, clientAbortController, apiSecret, }: {
    baseUrl?: string;
    machineId?: string;
    clientAbortController?: AbortController;
    apiSecret?: string;
}) => {
    readonly live: (args?: {
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: Record<string, string | undefined> | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
    } | undefined) => Promise<{
        status: 200;
        body: {
            status: string;
        };
        headers: Headers;
    } | {
        status: 401 | 204 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly createEphemeralSetup: (args?: {
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: Record<string, string | undefined> | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
    } | undefined) => Promise<{
        status: 200;
        body: {
            clusterId: string;
            apiKey: string;
        };
        headers: Headers;
    } | {
        status: 401 | 204 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly getContract: (args?: {
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: Record<string, string | undefined> | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
    } | undefined) => Promise<{
        status: 200;
        body: {
            contract: string;
        };
        headers: Headers;
    } | {
        status: 401 | 204 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly getJob: (args: {
        params: {
            clusterId: string;
            jobId: string;
        };
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            authorization?: string | undefined;
        } | undefined;
        query?: {
            waitTime?: number | undefined;
        } | undefined;
    }) => Promise<{
        status: 200;
        body: {
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
        };
        headers: Headers;
    } | {
        status: 401 | 204 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly getJobListing: (args: {
        params: {
            clusterId: string;
        };
        cache?: RequestCache | undefined;
        query: {
            limit: string;
            status?: "pending" | "running" | "done" | "failure" | "stalled" | "interrupted" | undefined;
            targetFn?: string | undefined;
            after?: string | undefined;
        };
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            authorization?: string | undefined;
        } | undefined;
    }) => Promise<{
        status: 200;
        body: {
            status: string;
            id: string;
            targetFn: string;
            executingMachineId: string | null;
            createdAt: Date;
            approved: boolean | null;
        }[];
        headers: Headers;
    } | {
        status: 401 | 204 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly createJob: (args: {
        params: {
            clusterId: string;
        };
        cache?: RequestCache | undefined;
        body: {
            input: {} & {
                [k: string]: unknown;
            };
            function?: string | undefined;
            tool?: string | undefined;
        };
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            authorization?: string | undefined;
        } | undefined;
        query?: {
            waitTime?: number | undefined;
        } | undefined;
    }) => Promise<{
        status: 200;
        body: {
            status: "pending" | "running" | "done" | "failure" | "stalled" | "interrupted";
            id: string;
            resultType: "resolution" | "rejection" | "interrupt" | null;
            result?: any;
        };
        headers: Headers;
    } | {
        status: 401;
        body: undefined;
        headers: Headers;
    } | {
        status: 204 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly cancelJob: (args: {
        params: {
            clusterId: string;
            jobId: string;
        };
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            authorization?: string | undefined;
        } | undefined;
    }) => Promise<{
        status: 401;
        body: undefined;
        headers: Headers;
    } | {
        status: 204;
        body: undefined;
        headers: Headers;
    } | {
        status: 200 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly createJobResult: (args: {
        params: {
            clusterId: string;
            jobId: string;
        };
        cache?: RequestCache | undefined;
        body: {
            resultType: "resolution" | "rejection" | "interrupt";
            meta: {
                functionExecutionTime?: number | undefined;
            };
            result?: any;
        };
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
            "x-machine-id"?: undefined;
            "x-machine-sdk-version"?: undefined;
            "x-machine-sdk-language"?: undefined;
            "x-forwarded-for"?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            "x-forwarded-for"?: string | undefined;
            authorization?: string | undefined;
            "x-machine-id"?: string | undefined;
            "x-machine-sdk-version"?: string | undefined;
            "x-machine-sdk-language"?: string | undefined;
        } | undefined;
    }) => Promise<{
        status: 401;
        body: undefined;
        headers: Headers;
    } | {
        status: 204;
        body: undefined;
        headers: Headers;
    } | {
        status: 200 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly listJobs: (args: {
        params: {
            clusterId: string;
        };
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
            "x-machine-id"?: undefined;
            "x-machine-sdk-version"?: undefined;
            "x-machine-sdk-language"?: undefined;
            "x-forwarded-for"?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            "x-forwarded-for"?: string | undefined;
            authorization?: string | undefined;
            "x-machine-id"?: string | undefined;
            "x-machine-sdk-version"?: string | undefined;
            "x-machine-sdk-language"?: string | undefined;
        } | undefined;
        query?: {
            status?: "pending" | "running" | "done" | "paused" | "failed" | undefined;
            waitTime?: number | undefined;
            limit?: number | undefined;
            tools?: string | undefined;
            acknowledge?: boolean | undefined;
        } | undefined;
    }) => Promise<{
        status: 200;
        body: {
            function: string;
            id: string;
            approved: boolean;
            input?: any;
            authContext?: any;
            runContext?: any;
        }[];
        headers: Headers;
    } | {
        status: 401;
        body: undefined;
        headers: Headers;
    } | {
        status: 410;
        body: {
            message: string;
        };
        headers: Headers;
    } | {
        status: 204 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly createJobApproval: (args: {
        params: {
            clusterId: string;
            jobId: string;
        };
        cache?: RequestCache | undefined;
        body: {
            approved: boolean;
        };
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            authorization?: string | undefined;
        } | undefined;
    }) => Promise<{
        status: 204;
        body: undefined;
        headers: Headers;
    } | {
        status: 404;
        body: {
            message: string;
        };
        headers: Headers;
    } | {
        status: 200 | 401 | 410 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly createMachine: (args?: {
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
            "x-machine-id"?: undefined;
            "x-machine-sdk-version"?: undefined;
            "x-machine-sdk-language"?: undefined;
            "x-forwarded-for"?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            "x-forwarded-for"?: string | undefined;
            authorization?: string | undefined;
            "x-machine-id"?: string | undefined;
            "x-machine-sdk-version"?: string | undefined;
            "x-machine-sdk-language"?: string | undefined;
        } | undefined;
        body?: {
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
        } | undefined;
    } | undefined) => Promise<{
        status: 200;
        body: {
            clusterId: string;
        };
        headers: Headers;
    } | {
        status: 204;
        body: undefined;
        headers: Headers;
    } | {
        status: 401 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly createCluster: (args: {
        cache?: RequestCache | undefined;
        body: {
            description: string;
            name?: string | undefined;
            isDemo?: boolean | undefined;
        };
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            authorization?: string | undefined;
        } | undefined;
    }) => Promise<{
        status: 204;
        body: undefined;
        headers: Headers;
    } | {
        status: 200 | 401 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly deleteCluster: (args: {
        params: {
            clusterId: string;
        };
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            authorization?: string | undefined;
        } | undefined;
    }) => Promise<{
        status: 204;
        body: undefined;
        headers: Headers;
    } | {
        status: 200 | 401 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly updateCluster: (args: {
        params: {
            clusterId: string;
        };
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            authorization?: string | undefined;
        } | undefined;
        body?: {
            name?: string | undefined;
            description?: string | undefined;
            debug?: boolean | undefined;
            enableCustomAuth?: boolean | undefined;
            enableKnowledgebase?: boolean | undefined;
            handleCustomAuthFunction?: string | undefined;
        } | undefined;
    }) => Promise<{
        status: 401;
        body: undefined;
        headers: Headers;
    } | {
        status: 204;
        body: undefined;
        headers: Headers;
    } | {
        status: 200 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly getCluster: (args: {
        params: {
            clusterId: string;
        };
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            authorization?: string | undefined;
        } | undefined;
    }) => Promise<{
        status: 200;
        body: {
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
        };
        headers: Headers;
    } | {
        status: 401;
        body: undefined;
        headers: Headers;
    } | {
        status: 404;
        body: undefined;
        headers: Headers;
    } | {
        status: 204 | 410 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly listClusters: (args?: {
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            authorization?: string | undefined;
        } | undefined;
    } | undefined) => Promise<{
        status: 200;
        body: {
            name: string;
            id: string;
            createdAt: Date;
            description: string | null;
        }[];
        headers: Headers;
    } | {
        status: 401;
        body: undefined;
        headers: Headers;
    } | {
        status: 204 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly listEvents: (args: {
        params: {
            clusterId: string;
        };
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            authorization?: string | undefined;
        } | undefined;
        query?: {
            type?: string | undefined;
            jobId?: string | undefined;
            machineId?: string | undefined;
            runId?: string | undefined;
            includeMeta?: string | undefined;
        } | undefined;
    }) => Promise<{
        status: 200;
        body: {
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
        }[];
        headers: Headers;
    } | {
        status: 401;
        body: undefined;
        headers: Headers;
    } | {
        status: 404;
        body: undefined;
        headers: Headers;
    } | {
        status: 204 | 410 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly getEventMeta: (args: {
        params: {
            clusterId: string;
            eventId: string;
        };
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            authorization?: string | undefined;
        } | undefined;
    }) => Promise<{
        status: 200;
        body: {
            type: string;
            status: string | null;
            jobId: string | null;
            id: string;
            targetFn: string | null;
            resultType: string | null;
            createdAt: Date;
            machineId: string | null;
            meta?: unknown;
        };
        headers: Headers;
    } | {
        status: 401;
        body: undefined;
        headers: Headers;
    } | {
        status: 404;
        body: undefined;
        headers: Headers;
    } | {
        status: 204 | 410 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly oas: (args?: {
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: Record<string, string | undefined> | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
    } | undefined) => Promise<{
        status: 200;
        body: unknown;
        headers: Headers;
    } | {
        status: 401 | 204 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly createApiKey: (args: {
        params: {
            clusterId: string;
        };
        cache?: RequestCache | undefined;
        body: {
            name: string;
        };
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            authorization?: string | undefined;
        } | undefined;
    }) => Promise<{
        status: 200;
        body: {
            key: string;
            id: string;
        };
        headers: Headers;
    } | {
        status: 401 | 204 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly listApiKeys: (args: {
        params: {
            clusterId: string;
        };
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            authorization?: string | undefined;
        } | undefined;
    }) => Promise<{
        status: 200;
        body: {
            name: string;
            id: string;
            createdAt: Date;
            createdBy: string;
            revokedAt: Date | null;
        }[];
        headers: Headers;
    } | {
        status: 401 | 204 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly revokeApiKey: (args: {
        params: {
            clusterId: string;
            keyId: string;
        };
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            authorization?: string | undefined;
        } | undefined;
    }) => Promise<{
        status: 204;
        body: undefined;
        headers: Headers;
    } | {
        status: 200 | 401 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly listMachines: (args: {
        params: {
            clusterId: string;
        };
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            authorization?: string | undefined;
        } | undefined;
        query?: {
            limit?: number | undefined;
        } | undefined;
    }) => Promise<{
        status: 200;
        body: {
            id: string;
            lastPingAt: Date;
            ip: string;
        }[];
        headers: Headers;
    } | {
        status: 401 | 204 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
    readonly listTools: (args: {
        params: {
            clusterId: string;
        };
        cache?: RequestCache | undefined;
        fetchOptions?: import("@ts-rest/core").FetchOptions | undefined;
        extraHeaders?: ({
            authorization?: undefined;
        } & Record<string, string | undefined>) | undefined;
        overrideClientOptions?: Partial<import("@ts-rest/core").OverrideableClientArgs> | undefined;
        headers?: {
            authorization?: string | undefined;
        } | undefined;
    }) => Promise<{
        status: 200;
        body: {
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
        }[];
        headers: Headers;
    } | {
        status: 401;
        body: undefined;
        headers: Headers;
    } | {
        status: 204 | 410 | 404 | 100 | 101 | 102 | 201 | 202 | 203 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 402 | 403 | 405 | 406 | 407 | 408 | 409 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
        body: unknown;
        headers: Headers;
    }>;
};
