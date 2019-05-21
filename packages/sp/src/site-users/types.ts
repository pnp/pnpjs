import {
    _SharePointQueryableInstance,
    ISharePointQueryableCollection,
    ISharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { SiteGroups, ISiteGroups } from "../site-groups/types";
import { TypedHash, extend } from "@pnp/common";
import { metadata } from "../utils/metadata";
import {IInvokable, body } from "@pnp/odata";
import { defaultPath, IDeleteable, deleteable } from "../decorators";
import { spPost } from "../operations";


/**
 * Describes a collection of all site collection users
 *
 */
@defaultPath("siteusers")
export class _SiteUsers extends _SharePointQueryableCollection implements ISiteUsers {

    /**
     * Gets a user from the collection by id
     *
     * @param id The id of the user to retrieve
     */
    public getById(id: number): ISiteUser {
        return SiteUser(this, `getById(${id})`);
    }

    /**
     * Gets a user from the collection by email
     *
     * @param email The email address of the user to retrieve
     */
    public getByEmail(email: string): ISiteUser {
        return SiteUser(this, `getByEmail('${email}')`);
    }

    /**
     * Gets a user from the collection by login name
     *
     * @param loginName The login name of the user to retrieve
     */
    public getByLoginName(loginName: string): ISiteUser {
        return SiteUser(this).concat(`('!@v::${encodeURIComponent(loginName)}')`);
    }

    /**
     * Removes a user from the collection by id
     *
     * @param id The id of the user to remove
     */
    public removeById(id: number): Promise<any> {
        return spPost(this.clone(SiteUsers, `removeById(${id})`));
    }

    /**
     * Removes a user from the collection by login name
     *
     * @param loginName The login name of the user to remove
     */
    public removeByLoginName(loginName: string): Promise<any> {
        const o = this.clone(SiteUsers, `removeByLoginName(@v)`);
        o.query.set("@v", `'${encodeURIComponent(loginName)}'`);
        return spPost(o);
    }

    /**
     * Adds a user to a group
     *
     * @param loginName The login name of the user to add to the group
     *
     */
    public async add(loginName: string): Promise<ISiteUser> {

        await spPost(this.clone(SiteUsers, null), body(extend(metadata("SP.User"), { LoginName: loginName })));

        return this.getByLoginName(loginName);
    }
}

export interface ISiteUsers extends IInvokable, ISharePointQueryableCollection {
    getById(id: number): ISiteUser;
    getByEmail(email: string): ISiteUser;
    getByLoginName(loginName: string): ISiteUser;
    removeById(id: number): Promise<any>;
    removeByLoginName(loginName: string): Promise<any>;
    add(loginName: string): Promise<ISiteUser>;
}
export interface _SiteUsers extends IInvokable { }
export const SiteUsers = spInvokableFactory<ISiteUsers>(_SiteUsers);

/**
 * Describes a single user
 *
 */
@deleteable()
export class _SiteUser extends _SharePointQueryableInstance implements ISiteUser {

    /**
     * Gets the groups for this user
     *
     */
    public get groups(): ISiteGroups {
        return SiteGroups(this, "groups");
    }

    /**
    * Updates this user instance with the supplied properties
    *
    * @param properties A plain object of property names and values to update for the user
    */
    public update: (props: TypedHash<any>) => Promise<IUserUpdateResult> = this._update<IUserUpdateResult, TypedHash<any>, any>("SP.User", data => ({ data, user: this }));
}

export interface ISiteUser extends IInvokable, ISharePointQueryableInstance, IDeleteable {
    readonly groups: ISiteGroups;
    update(props: TypedHash<any>): Promise<IUserUpdateResult>;
}
export interface _SiteUser extends IInvokable, IDeleteable { }
export const SiteUser = spInvokableFactory<ISiteUser>(_SiteUser);

export interface ISiteUserProps {
    Email: string;
    Id: number;
    IsHiddenInUI: boolean;
    IsShareByEmailGuestUser: boolean;
    IsSiteAdmin: boolean;
    LoginName: string;
    PrincipalType: number;
    Title: string;
}

/**
 * Properties that provide both a getter, and a setter.
 *
 */
export interface IUserUpdateResult {
    user: ISiteUser;
    data: any;
}

/**
 * Result from ensuring a user
 *
 */
export interface IWebEnsureUserResult {
    data: ISiteUserProps;
    user: ISiteUser;
}
