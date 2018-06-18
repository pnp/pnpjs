import { Logger, LogLevel } from "@pnp/logging";
import { graph } from "@pnp/graph";
import { AdalFetchClient } from "@pnp/nodejs";

declare var process: { exit(code?: number): void };

export function Example(settings: any) {

    graph.setup({
        graph: {
            fetchClientFactory: () => {
                return new AdalFetchClient(settings.testing.graph.tenant, settings.testing.graph.id, settings.testing.graph.secret);
            },
        },
    });

    graph.groups.get().then(g => {

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
