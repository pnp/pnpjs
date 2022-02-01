import { User as IUser } from "@microsoft/microsoft-graph-types";
import "@pnp/graph/users";
import { Logger, LogLevel } from "@pnp/logging";
import { stringIsNullOrEmpty } from "@pnp/core";
import { Context } from "mocha";

let cachedValidUser = null;
const usersToCheck = 20;

export default async function getValidUser(this: Context, ignoreCache = false): Promise<IUser> {

    if (!ignoreCache && cachedValidUser !== null) {
        return cachedValidUser;
    }

    const username = this.pnp.settings.testUser;

    if(stringIsNullOrEmpty(username)) {
        throw Error(`getValidUser: ${this.pnp.settings.testUser} is not defined. A test calling this should skip.`);
    }

    const testUserName = username.substring(username.lastIndexOf("|") + 1);

    try {
        cachedValidUser = await this.pnp.graph.users.getById(testUserName)();
    } catch (e) {
        cachedValidUser = null;
        Logger.write(`getValidUser: Failed looking up user '${testUserName}'`, LogLevel.Verbose);
    }


    if (cachedValidUser === null) {
        throw Error(`getValidUser: Could not find a valid user in the first ${usersToCheck} results.`);
    }

    return cachedValidUser;
}
