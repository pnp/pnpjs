import { User as IUser } from "@microsoft/microsoft-graph-types";
import { GraphFI } from "@pnp/graph";
import "@pnp/graph/users";
import { Logger, LogLevel } from "@pnp/logging";
import { getGraph, testSettings } from "../../main.js";

let cachedValidUser = null;
const usersToCheck = 20;

export default async function getValidUser(ignoreCache = false): Promise<IUser> {

    if (!ignoreCache && cachedValidUser !== null) {
        return cachedValidUser;
    }

    const testUserName = testSettings.testUser.substr(testSettings.testUser.lastIndexOf("|") + 1);

    try {
        const _graphFI: GraphFI = getGraph();
        cachedValidUser = await _graphFI.users.getById(testUserName)();
    } catch (e) {
        cachedValidUser = null;
        Logger.write(`getValidUser: Failed looking up user '${testUserName}'`, LogLevel.Verbose);
    }


    if (cachedValidUser === null) {
        throw Error(`getValidUser: Could not find a valid user in the first ${usersToCheck} results.`);
    }

    return cachedValidUser;
}
