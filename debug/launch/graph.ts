import { Logger, LogLevel } from "@pnp/logging";
import { graphSetup } from "./setup.js";
import "@pnp/graph/sites";
import { encodeSharingUrl } from "@pnp/graph/files";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {

  const graph = graphSetup(settings);

  const y = await graph.sites.getAllSites().select("modifiedDateTime")();


  // Logger.log({
  //   data: users,
  //   level: LogLevel.Info,
  //   message: "List of Users Data",
  // });

  process.exit(0);
}
