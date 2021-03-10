import { User as IUser } from "@microsoft/microsoft-graph-types";
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import { Logger, LogLevel } from "@pnp/logging";
import { testSettings } from "../../main.js";

let cachedValidUser = null;
const usersToCheck = 20;

export default async function getValidUser(ignoreCache = false, ...selects: string[]): Promise<IUser> {

    if (!ignoreCache && cachedValidUser !== null) {
        return cachedValidUser;
    }

    const testUserName = testSettings.testUser.substr(testSettings.testUser.lastIndexOf("|") + 1);

    try {
        cachedValidUser = await graph.users.getById(testUserName)();
    } catch (e) {
        cachedValidUser = null;
        Logger.write(`getValidUser: Failed looking up user '${testUserName}'`, LogLevel.Verbose);
    }


    if (cachedValidUser === null) {
        throw Error(`getValidUser: Could not find a valid user in the first ${usersToCheck} results.`);
    }

    return cachedValidUser;
}
