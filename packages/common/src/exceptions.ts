import { Logger, LogLevel } from "@pnp/logging";

export class NodeFetchClientUnsupportedException extends Error {

    constructor(msg = "Using NodeFetchClient in the browser is not supported.") {
        super(msg);
        this.name = "NodeFetchClientUnsupportedException";
        Logger.log({ data: {}, level: LogLevel.Error, message: `[${this.name}]::${this.message}` });
    }
}

export class FunctionExpectedException extends Error {

    constructor(msg = "Expected a function.") {
        super(msg);
        this.name = "FunctionExpectedException";
        Logger.log({ data: {}, level: LogLevel.Error, message: `[${this.name}]::${this.message}` });
    }
}

export class UrlException extends Error {

    constructor(msg: string) {
        super(msg);
        this.name = "UrlException";
        Logger.log({ data: {}, level: LogLevel.Error, message: `[${this.name}]::${this.message}` });
    }
}
