import { Logger, LogLevel } from "@pnp/logging";
import { graphSetup } from "./setup.js";
import "@pnp/graph/users";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {

    const graph = graphSetup(settings);

    const users = await graph.users();
 
    Logger.log({
      data: users,
      level: LogLevel.Info,
      message: "List of Users Data",
    });
  
    process.exit(0);
}
