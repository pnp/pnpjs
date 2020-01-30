import { Logger, LogLevel } from "@pnp/logging";
import { AdalFetchClient } from "@pnp/nodejs";
import { graph } from "@pnp/graph";
import "@pnp/graph/groups";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {

    graph.setup({
        graph: {
            fetchClientFactory: () => {
                return new AdalFetchClient(settings.testing.graph.tenant, settings.testing.graph.id, settings.testing.graph.secret);
            },
        },
    });


    const g = await graph.groups();

    Logger.log({
        data: g,
        level: LogLevel.Info,
        message: "List of Groups",
    });

    process.exit(0);
}
