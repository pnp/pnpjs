import { SharePointQueryable, SharePointQueryableInstance, SharePointQueryableCollection } from "./sharepointqueryable";
import { SiteGroups } from "./sitegroups";
import { Util } from "../utils/util";
import { TypedHash } from "../collections/collections";

/**
 * Properties that provide both a getter, and a setter.
 *
 */
export interface UserUpdateResult {
    user: SiteUser;
    data: any;
}

/**
 * Describes a collection of all site collection users
 *
 */
export class SiteUsers extends SharePointQueryableCollection {

    /**
     * Creates a new instance of the SiteUsers class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this user collection
     */
    constructor(baseUrl: string | SharePointQueryable, path = "siteusers") {
        super(baseUrl, path);
    }

    /**
     * Gets a user from the collection by email
     *
     * @param email The email address of the user to retrieve
     */
    public getByEmail(email: string): SiteUser {
        return new SiteUser(this, `getByEmail('${email}')`);
    }

    /**
     * Gets a user from the collection by id
     *
     * @param id The id of the user to retrieve
     */
    public getById(id: number): SiteUser {
        return new SiteUser(this, `getById(${id})`);
    }

    /**
     * Gets a user from the collection by login name
     *
     * @param loginName The login name of the user to retrieve
     */
    public getByLoginName(loginName: string): SiteUser {
        const su = new SiteUser(this);
        su.concat("(@v)");
        su.query.add("@v", `'${encodeURIComponent(loginName)}'`);
        return su;
    }

    /**
     * Removes a user from the collection by id
     *
     * @param id The id of the user to remove
     */
    public removeById(id: number | SharePointQueryable): Promise<any> {
        return this.clone(SiteUsers, `removeById(${id})`).postCore();
    }

    /**
     * Removes a user from the collection by login name
     *
     * @param loginName The login name of the user to remove
     */
    public removeByLoginName(loginName: string): Promise<any> {
        const o = this.clone(SiteUsers, `removeByLoginName(@v)`);
        o.query.add("@v", `'${encodeURIComponent(loginName)}'`);
        return o.postCore();
    }

    /**
     * Adds a user to a group
     *
     * @param loginName The login name of the user to add to the group
     *
     */
    public add(loginName: string): Promise<SiteUser> {
        return this.clone(SiteUsers, null).postCore({
            body: JSON.stringify({ "__metadata": { "type": "SP.User" }, LoginName: loginName }),
        }).then(() => this.getByLoginName(loginName));
    }
}


/**
 * Describes a single user
 *
 */
export class SiteUser extends SharePointQueryableInstance {

    /**
     * Gets the groups for this user
     *
     */
    public get groups() {
        return new SiteGroups(this, "groups");
    }

    /**
    * Updates this user instance with the supplied properties
    *
    * @param properties A plain object of property names and values to update for the user
    */
    public update(properties: TypedHash<any>): Promise<UserUpdateResult> {

        const postBody = Util.extend({ "__metadata": { "type": "SP.User" } }, properties);

        return this.postCore({
            body: JSON.stringify(postBody),
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then((data) => {
            return {
                data: data,
                user: this,
            };
        });
    }

    /**
     * Delete this user
     *
     */
    public delete(): Promise<void> {
        return this.postCore({
            headers: {
                "X-HTTP-Method": "DELETE",
            },
        });
    }
}

/**
 * Represents the current user
 */
export class CurrentUser extends SharePointQueryableInstance {

    constructor(baseUrl: string | SharePointQueryable, path = "currentuser") {
        super(baseUrl, path);
    }
}

export interface SiteUserProps {
    Email: string;
    Id: number;
    IsHiddenInUI: boolean;
    IsShareByEmailGuestUser: boolean;
    IsSiteAdmin: boolean;
    LoginName: string;
    PrincipalType: number;
    Title: string;
}
