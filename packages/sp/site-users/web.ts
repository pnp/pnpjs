import { addProp, body } from "@pnp/queryable";
import { _Web, Web } from "../webs/types.js";
import { ISiteUsers, SiteUsers, ISiteUser, SiteUser, IWebEnsureUserResult } from "./types.js";
import { odataUrlFrom } from "../utils/odata-url-from.js";
import { spPost } from "../operations.js";

declare module "../webs/types" {
    interface _Web {
        readonly siteUsers: ISiteUsers;
        readonly currentUser: ISiteUser;
        ensureUser(loginName: string): Promise<IWebEnsureUserResult>;
        getUserById(id: number): ISiteUser;
    }
    interface IWeb {

        /**
         * The site users
         */
        readonly siteUsers: ISiteUsers;

        /**
         * Information on the current user
         */
        readonly currentUser: ISiteUser;

        /**
        * Checks whether the specified login name belongs to a valid user in the web. If the user doesn't exist, adds the user to the web.
        *
        * @param loginName The login name of the user (ex: i:0#.f|membership|user@domain.onmicrosoft.com)
        */
        ensureUser(loginName: string): Promise<IWebEnsureUserResult>;

        /**
         * Returns the user corresponding to the specified member identifier for the current site
         *
         * @param id The id of the user
         */
        getUserById(id: number): ISiteUser;
    }
}

addProp(_Web, "siteUsers", SiteUsers);
addProp(_Web, "currentUser", SiteUser);

_Web.prototype.ensureUser = async function (this: _Web, logonName: string): Promise<IWebEnsureUserResult> {

    const data = await spPost(Web(this, "ensureuser"), body({ logonName }));
    return {
        data,
        user: SiteUser([this, odataUrlFrom(data)]),
    };
};

_Web.prototype.getUserById = function (id: number): ISiteUser {
    return SiteUser(this, `getUserById(${id})`);
};
