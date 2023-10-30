import { Logger, LogLevel } from "@pnp/logging";
import { graphSetup } from "./setup.js";
import "@pnp/graph/users";
import { encodeSharingUrl } from "@pnp/graph/files";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {

  const graph = graphSetup(settings);

  const ur = new URLSearchParams();
  ur.set("$filter", "NOT groupTypes/any(c:c+eq+'Unified')");

  const url = encodeSharingUrl("https://microsoft.sharepoint-df.com/teams/ODSPProductDay2/SitePages/ODSP-Seme.aspx");

  const users = graph.users.filter("NOT groupTypes/any(c:c+eq+'Unified')");

  const y = ur.toString();

  Logger.log({
    data: users,
    level: LogLevel.Info,
    message: "List of Users Data",
  });

  process.exit(0);
}
