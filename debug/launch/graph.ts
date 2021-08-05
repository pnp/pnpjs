import { Logger, LogLevel } from "@pnp/logging";
import { graph } from "@pnp/graph";
import { graphSetup } from "./setup.js";
import "@pnp/graph/groups";
import "@pnp/graph/users";
import "@pnp/graph/outlook";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {

    graphSetup(settings);

    const me = await graph.me();
   
    Logger.log({
        data: me,
        level: LogLevel.Info,
        message: "List of Groups",
    });

    process.exit(0);
}
