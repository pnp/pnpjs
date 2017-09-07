import { Logger, LogLevel } from "@pnp/logging";

function defaultLog(error: Error) {
    Logger.log({ data: {}, level: LogLevel.Error, message: `[${error.name}]::${error.message}` });
}

export class NoCacheAvailableException extends Error {

    constructor(msg = "Cannot create a caching configuration provider since cache is not available.") {
        super(msg);
        this.name = "NoCacheAvailableException";
        defaultLog(this);
    }
}

export class APIUrlException extends Error {

    constructor(msg = "Unable to determine API url.") {
        super(msg);
        this.name = "APIUrlException";
        defaultLog(this);
    }
}

export class AuthUrlException extends Error {

    constructor(data: any, msg = "Auth URL Endpoint could not be determined from data. Data logged.") {
        super(msg);
        this.name = "APIUrlException";
        Logger.log({ data: data, level: LogLevel.Error, message: this.message });
    }
}

export class NodeFetchClientUnsupportedException extends Error {

    constructor(msg = "Using NodeFetchClient in the browser is not supported.") {
        super(msg);
        this.name = "NodeFetchClientUnsupportedException";
        defaultLog(this);
    }
}

export class MaxCommentLengthException extends Error {

    constructor(msg = "The maximum comment length is 1023 characters.") {
        super(msg);
        this.name = "MaxCommentLengthException";
        defaultLog(this);
    }
}

export class NotSupportedInBatchException extends Error {

    constructor(operation = "This operation") {
        super(`${operation} is not supported as part of a batch.`);
        this.name = "NotSupportedInBatchException";
        defaultLog(this);
    }
}

export class ODataIdException extends Error {

    constructor(data: any, msg = "Could not extract odata id in object, you may be using nometadata. Object data logged to logger.") {
        super(msg);
        this.name = "ODataIdException";
        Logger.log({ data: data, level: LogLevel.Error, message: this.message });
    }
}

export class BatchParseException extends Error {

    constructor(msg: string) {
        super(msg);
        this.name = "BatchParseException";
        defaultLog(this);
    }
}

export class AlreadyInBatchException extends Error {

    constructor(msg = "This query is already part of a batch.") {
        super(msg);
        this.name = "AlreadyInBatchException";
        defaultLog(this);
    }
}

export class FunctionExpectedException extends Error {

    constructor(msg = "This query is already part of a batch.") {
        super(msg);
        this.name = "FunctionExpectedException";
        defaultLog(this);
    }
}

export class UrlException extends Error {

    constructor(msg: string) {
        super(msg);
        this.name = "UrlException";
        defaultLog(this);
    }
}
