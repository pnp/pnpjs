import { Logger, LogLevel } from "@pnp/logging";
import { graph } from "@pnp/graph";
import { graphSetup } from "./setup";
import "@pnp/graph/groups";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {

    graphSetup(settings);

    const g = await graph.groups();

    Logger.log({
        data: g,
        level: LogLevel.Info,
        message: "List of Groups",
    });

    process.exit(0);
}
