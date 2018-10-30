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

    const batch = graph.createBatch();

    graph.groups.inBatch(batch).get().then(g => {

        Logger.log({
            data: g,
            level: LogLevel.Info,
            message: "graph.planner.plans",
        });

    }).catch(e => {

        // logging results to the Logger
        Logger.error(e);
    });

    graph.groups.select("mailNickname").inBatch(batch).get().then(g => {

        Logger.log({
            data: g,
            level: LogLevel.Info,
            message: "graph.planner.tasks.",
        });

    }).catch(e => {

        // logging results to the Logger
        Logger.error(e);
    });

    batch.execute().catch(e => {
        console.log("here");
        console.error(e);
    });
}
