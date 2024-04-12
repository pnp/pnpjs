import { addProp, body } from "@pnp/queryable";
import { _Web, Web } from "../webs/types.js";
import { ISiteUsers, SiteUsers, ISiteUser, SiteUser, ISiteUserInfo } from "./types.js";
import { spPost } from "../spqueryable.js";

declare module "../webs/types" {
    interface _Web {
        readonly siteUsers: ISiteUsers;
        readonly currentUser: ISiteUser;
        ensureUser(loginName: string): Promise<ISiteUserInfo>;
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
        ensureUser(loginName: string): Promise<ISiteUserInfo>;

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

_Web.prototype.ensureUser = async function (this: _Web, logonName: string): Promise<ISiteUserInfo> {

    return spPost(Web(this, "ensureuser"), body({ logonName }));
};

_Web.prototype.getUserById = function (id: number): ISiteUser {
    return SiteUser(this, `getUserById(${id})`);
};
