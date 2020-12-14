import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import { ISiteUserProps } from "@pnp/sp/site-users";
import { Logger, LogLevel } from "@pnp/logging";

let cachedValidUser = null;
const usersToCheck = 20;

export default async function getValidUser(ignoreCache = false, ...selects: string[]): Promise<ISiteUserProps> {

    if (!ignoreCache && cachedValidUser !== null) {
        return cachedValidUser;
    }

    const allUsers = await sp.web.siteUsers.top(usersToCheck).select("Id")();

    for (let i = 0; i < allUsers.length; i++) {

        const testUserId = allUsers[i].Id;

        try {

            const query = sp.web.siteUsers.getById(testUserId);
            if (selects && selects.length > 0) {
                query.select(...selects);
            }
            cachedValidUser = await query();
            break;

        } catch (e) {
            cachedValidUser = null;
            Logger.write(`getValidUser: Failed looking up user '${testUserId}'`, LogLevel.Verbose);
        }
    }

    if (cachedValidUser === null) {
        throw Error(`getValidUser: Could not find a valid user in the first ${usersToCheck} results.`);
    }

    return cachedValidUser;
}
