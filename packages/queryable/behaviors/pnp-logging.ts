import { TimelinePipe } from "@pnp/core";
import { Logger, LogLevel } from "@pnp/logging";
import { Queryable } from "../queryable.js";

export function PnPLogging(activeLevel: LogLevel): TimelinePipe<Queryable> {

    // TODO: we set the active level here? or rework logger to be instance based for each behavior
    Logger.activeLogLevel = activeLevel;

    return (instance: Queryable) => {

        instance.on.log(function (message: string, level: LogLevel) {
            Logger.write(message, level);
        });

        return instance;
    };
}
