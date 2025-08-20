import { Logger, LogLevel } from "@pnp/logging";
import { graphSetup } from "./setup.js";
import "@pnp/graph/users";
import { graphPut, graphGet, GraphQueryable } from "@pnp/graph";
import { body } from "@pnp/queryable";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {

  const graph = graphSetup(settings);

  // const y = await graphPut(GraphQueryable([graph.me, "drives/b!VhBykwJtl0Suh2DOl1X207oLr5edsxJIq22l9fszjes-bn6DkWgNRpmUtMPs7zZc/special/approot:/subfolder-1/subfolder-2/text.txt:/content"]), body("Hello"));

  // const y = await graphGet(GraphQueryable([graph.me, "drives/b!VhBykwJtl0Suh2DOl1X207oLr5edsxJIq22l9fszjes-bn6DkWgNRpmUtMPs7zZc/special/approot:/subfolder-1/subfolder-2/text.txt:/content"]));

  const y = await graphGet(GraphQueryable([graph.me, "drives/b!VhBykwJtl0Suh2DOl1X207oLr5edsxJIq22l9fszjes-bn6DkWgNRpmUtMPs7zZc/special/approot:/subfolder-1/subfolder-2/text.txt:/listItem"]));

  process.exit(0);
}