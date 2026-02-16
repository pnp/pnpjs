import { Logger, LogLevel } from "@pnp/logging";
import { graphSetup } from "./setup.js";
import "@pnp/graph/users";
import "@pnp/graph/files";
import { graphPost } from "@pnp/graph";
import { body } from "@pnp/queryable";

declare var process: { exit(code?: number): void };

export async function Example(settings: any) {

    const graph = graphSetup(settings);

    const postobj = {
        "@microsoft.graph.conflictBehavior": "rename",
        name: "PnPjsDocuments",
        remoteItem: {
            sharepointIds: {
                listId: "22569c8b-384e-45f1-9bbf-604ec4eb16d1",
                listItemUniqueId: "root",
                siteId: "b08c11c3-2adb-4a88-8994-c6e30e4319dd",
                siteUrl: "https://sympjt.sharepoint.com/sites/pnpjsteam",
                webId: "4774e4ca-97fb-4fa5-8bac-2d20a1914110"
            }
        }
    }

    //const users = await graph.users.getById('julie@sympjt.onmicrosoft.com')();
    const q = graph.users.getById('julie@sympjt.onmicrosoft.com').drive.root.children;
    const users = await graphPost(q, body(postobj));

    Logger.log({
        data: users,
        level: LogLevel.Info,
        message: "List of Users Data",
    });

    process.exit(0);
}