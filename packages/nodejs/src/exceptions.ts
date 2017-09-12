import { Logger, LogLevel } from "@pnp/logging";

export class AuthUrlException extends Error {

    constructor(data: any, msg = "Auth URL Endpoint could not be determined from data. Data logged.") {
        super(msg);
        this.name = "APIUrlException";
        Logger.log({ data: data, level: LogLevel.Error, message: this.message });
    }
}
