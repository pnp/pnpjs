import { Logger, LogLevel } from "@pnp/logging";

export class NoCacheAvailableException extends Error {

    constructor(msg = "Cannot create a caching configuration provider since cache is not available.") {
        super(msg);
        this.name = "NoCacheAvailableException";
        Logger.log({ data: {}, level: LogLevel.Error, message: `[${this.name}]::${this.message}` });
    }
}
