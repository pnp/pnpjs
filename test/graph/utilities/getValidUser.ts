import { User as IUser } from "@microsoft/microsoft-graph-types";
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import { Logger, LogLevel } from "@pnp/logging";

let cachedValidUser = null;
const usersToCheck = 20;

export default async function getValidUser(ignoreCache = false, ...selects: string[]): Promise<IUser> {

    if (!ignoreCache && cachedValidUser !== null) {
        return cachedValidUser;
    }

    const allUsers = await graph.users.top(usersToCheck).select("userPrincipalName")();

    for (let i = 0; i < allUsers.length; i++) {

        const testUserName = allUsers[i].userPrincipalName;

        try {

            const query = graph.users.getById(testUserName);
            if (selects && selects.length > 0) {
                query.select(...selects);
            }
            cachedValidUser = await query();
            break;

        } catch (e) {
            cachedValidUser = null;
            Logger.write(`getValidUser: Failed looking up user '${testUserName}'`, LogLevel.Verbose);
        }
    }

    if (cachedValidUser === null) {
        throw Error(`getValidUser: Could not find a valid user in the first ${usersToCheck} results.`);
    }

    return cachedValidUser;
}
