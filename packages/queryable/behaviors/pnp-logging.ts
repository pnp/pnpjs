import { TimelinePipe } from "@pnp/core";
import { Logger, LogLevel } from "@pnp/logging";
import { Queryable2 } from "../queryable-2.js";

export function PnPLogging(activeLevel: LogLevel): TimelinePipe<Queryable2> {

    // TODO: we set the active level here? or rework logger to be instance based for each behavior
    Logger.activeLogLevel = activeLevel;

    return (instance: Queryable2) => {

        instance.on.log(function (message: string, level: LogLevel) {
            Logger.write(message, level);
        });

        return instance;
    };
}
