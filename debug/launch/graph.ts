import { Logger, LogLevel } from "@pnp/logging";
import { graphSetup } from "./setup.js";
import "@pnp/graph/groups";
import "@pnp/graph/users";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {

    const graph = graphSetup(settings);

    const count = await graph.users.count();

    const allUsers = [];
    let users = await graph.users.top(20).select("displayName").paged();

    allUsers.push(...users.value);

    while (users.hasNext) {
        users = await users.next();
        allUsers.push(...users.value);
    }
 
    Logger.log({
      data: users,
      level: LogLevel.Info,
      message: "List of Users Data",
    });
  
    process.exit(0);
}
