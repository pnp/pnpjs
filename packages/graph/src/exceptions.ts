import { Logger, LogLevel } from "@pnp/logging";

export class NoGraphClientAvailableException extends Error {

    constructor(msg = "There is no Graph Client available, either set one using configuraiton or provide a valid SPFx Context using setup.") {
        super(msg);
        this.name = "NoGraphClientAvailableException";
        Logger.log({ data: null, level: LogLevel.Error, message: this.message });
    }
}

export class GraphBatchParseException extends Error {

    constructor(msg: string) {
        super(msg);
        this.name = "GraphBatchParseException";
        Logger.log({ data: {}, level: LogLevel.Error, message: `[${this.name}]::${this.message}` });
    }
}


