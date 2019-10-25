import {
    _SharePointQueryableInstance,
    ISharePointQueryableCollection,
    ISharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { SiteGroups, ISiteGroups } from "../site-groups/types";
import { TypedHash, assign } from "@pnp/common";
import { metadata } from "../utils/metadata";
import { IInvokable, body } from "@pnp/odata";
import { defaultPath, IDeleteable, deleteable } from "../decorators";
import { spPost } from "../operations";
import { PrincipalType } from "../types";



@defaultPath("siteusers")
export class _SiteUsers extends _SharePointQueryableCollection implements _ISiteUsers {

    public getById(id: number): ISiteUser {
        return SiteUser(this, `getById(${id})`);
    }

    public getByEmail(email: string): ISiteUser {
        return SiteUser(this, `getByEmail('${email}')`);
    }

    public getByLoginName(loginName: string): ISiteUser {
        return SiteUser(this).concat(`('!@v::${encodeURIComponent(loginName)}')`);
    }

    public removeById(id: number): Promise<any> {
        return spPost(this.clone(SiteUsers, `removeById(${id})`));
    }

    public removeByLoginName(loginName: string): Promise<any> {
        const o = this.clone(SiteUsers, `removeByLoginName(@v)`);
        o.query.set("@v", `'${encodeURIComponent(loginName)}'`);
        return spPost(o);
    }

    public async add(loginName: string): Promise<ISiteUser> {

        await spPost(this.clone(SiteUsers, null), body(assign(metadata("SP.User"), { LoginName: loginName })));
        return this.getByLoginName(loginName);
    }
}

/**
 * Describes a collection of all site collection users
 *
 */
export interface _ISiteUsers {
    /**
     * Gets a user from the collection by id
     *
     * @param id The id of the user to retrieve
     */
    getById(id: number): ISiteUser;

    /**
     * Gets a user from the collection by email
     *
     * @param email The email address of the user to retrieve
     */
    getByEmail(email: string): ISiteUser;

    /**
     * Gets a user from the collection by login name
     *
     * @param loginName The login name of the user to retrieve
     */
    getByLoginName(loginName: string): ISiteUser;

    /**
     * Removes a user from the collection by id
     *
     * @param id The id of the user to remove
     */
    removeById(id: number): Promise<any>;

    /**
     * Removes a user from the collection by login name
     *
     * @param loginName The login name of the user to remove
     */
    removeByLoginName(loginName: string): Promise<any>;

    /**
     * Adds a user to a site collection
     *
     * @param loginName The login name of the user to add  to a site collection
     *
     */
    add(loginName: string): Promise<ISiteUser>;
}

export interface ISiteUsers extends _ISiteUsers, IInvokable, ISharePointQueryableCollection { }

export const SiteUsers = spInvokableFactory<ISiteUsers>(_SiteUsers);

/**
 * Describes a single user
 *
 */
@deleteable("su")
export class _SiteUser extends _SharePointQueryableInstance implements _ISiteUser {

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
    public update: (props: TypedHash<any>) => Promise<IUserUpdateResult> = this._update<IUserUpdateResult, TypedHash<any>, any>("SP.User", data => ({ data, user: <any>this }));
}

/**
 * Describes a single user
 *
 */
export interface _ISiteUser {
    /**
     * Gets the groups for this user
     *
     */
    readonly groups: ISiteGroups;

    /**
    * Updates this user instance with the supplied properties
    *
    * @param properties A plain object of property names and values to update for the user
    */
    update(props: TypedHash<any>): Promise<IUserUpdateResult>;
}

export interface ISiteUser extends _ISiteUser, IInvokable, ISharePointQueryableInstance, IDeleteable {}

export const SiteUser = spInvokableFactory<ISiteUser>(_SiteUser);

/**
 * Describes a single user properties
 *
 */
export interface ISiteUserProps {

    /**
     * Contains Site user email
     * 
     */
    Email: string;

    /**
     * Contains Site user Id
     * 
     */
    Id: number;

    /**
     * Site user IsHiddenInUI
     * 
     */
    IsHiddenInUI: boolean;

    /**
     * Site user IsShareByEmailGuestUser 
     * 
     */
    IsShareByEmailGuestUser: boolean;

    /**
     * Describes if Site user Is Site Admin 
     * 
     */
    IsSiteAdmin: boolean;

    /**
     * Site user LoginName
     * 
     */
    LoginName: string;

    /**
     * Site user Principal type
     * 
     */
    PrincipalType: number | PrincipalType;

    /**
     * Site user Title
     * 
     */
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
