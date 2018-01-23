import { Logger, LogLevel } from "@pnp/logging";
import { graph } from "@pnp/graph";

declare var process: { exit(code?: number): void };

export function Example() {

    graph.v1.groups.get().then(g => {

        Logger.log({
            data: g,
            level: LogLevel.Info,
            message: "List of Groups",
        });

        process.exit(0);

    }).catch(e => {

        // logging results to the Logger
        Logger.error(e);
        process.exit(1);
    });
}
