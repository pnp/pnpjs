import { Logger, LogLevel } from "@pnp/logging";

/**
 * Represents an exception with an HttpClient request
 *
 */
export class ProcessHttpClientResponseException extends Error {

    constructor(public readonly status: number, public readonly statusText: string, public readonly data: any) {
        super(`Error making HttpClient request in queryable: [${status}] ${statusText}`);
        this.name = "ProcessHttpClientResponseException";
        Logger.log({ data: this.data, level: LogLevel.Error, message: this.message });
    }
}

export class AlreadyInBatchException extends Error {

    constructor(msg = "This query is already part of a batch.") {
        super(msg);
        this.name = "AlreadyInBatchException";
        Logger.log({ data: {}, level: LogLevel.Error, message: `[${this.name}]::${this.message}` });
    }
}

