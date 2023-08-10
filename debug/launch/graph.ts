import { Logger, LogLevel } from "@pnp/logging";
import { graphSetup } from "./setup.js";
import "@pnp/graph/sites";
import "@pnp/graph/users";
import "@pnp/graph/files";
import "@pnp/graph/operations";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {

    const graph = graphSetup(settings);

    const site = await graph.sites.getByUrl("318studios.sharepoint.com", "/sites/dev")

    const ops = await site.operations();
    

    Logger.log({
      data: ops,
      level: LogLevel.Info,
      message: "List of Users Data",
    });
  
    process.exit(0);
}
