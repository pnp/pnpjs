import { Logger, LogLevel } from "@pnp/logging";

export class UrlException extends Error {

    constructor(msg: string) {
        super(msg);
        this.name = "UrlException";
        Logger.log({ data: {}, level: LogLevel.Error, message: `[${this.name}]::${this.message}` });
    }
}
