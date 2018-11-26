import { SharePointQueryable, SharePointQueryableInstance, SharePointQueryableCollection, defaultPath } from "./sharepointqueryable";
import { SiteGroups } from "./sitegroups";
import { TypedHash, jsS, extend } from "@pnp/common";
import { metadata } from "./utils/metadata";

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
@defaultPath("siteusers")
export class SiteUsers extends SharePointQueryableCollection {

    /**
     * Gets a user from the collection by id
     *
     * @param id The id of the user to retrieve
     */
    public getById(id: number): SiteUser {
        return new SiteUser(this, `getById(${id})`);
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
     * Gets a user from the collection by login name
     *
     * @param loginName The login name of the user to retrieve
     */
    public getByLoginName(loginName: string): SiteUser {
        const su = new SiteUser(this);
        su.concat(`('!@v::${encodeURIComponent(loginName)}')`);
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
        o.query.set("@v", `'${encodeURIComponent(loginName)}'`);
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
            body: jsS(extend(metadata("SP.User"), { LoginName: loginName })),
        }).then(() => this.getByLoginName(loginName));
    }
}

/**
 * Base class for a user
 * 
 */
export class UserBase extends SharePointQueryableInstance {

    /**
     * Gets the groups for this user
     *
     */
    public get groups() {
        return new SiteGroups(this, "groups");
    }
}

/**
 * Describes a single user
 *
 */
export class SiteUser extends UserBase {

    /**
    * Updates this user instance with the supplied properties
    *
    * @param properties A plain object of property names and values to update for the user
    */
    public update = this._update<UserUpdateResult, TypedHash<any>, any>("SP.User", data => ({ data, user: this }));

    /**
     * Delete this user
     *
     */
    public delete = this._delete;
}

/**
 * Represents the current user
 */
@defaultPath("currentuser")
export class CurrentUser extends UserBase { }

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
