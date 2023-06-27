import { Logger, LogLevel } from "@pnp/logging";
import { graphSetup } from "./setup.js";
import "@pnp/graph/users";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {

  const graph = graphSetup(settings);

  for await (const val of graph.users.top(1).paged()) {
    console.log(JSON.stringify(val, null, 2));
  }

  const users = await graph.users();

  const count = await graph.users.count();

  process.exit(0);
}
