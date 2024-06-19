import {
    _SPCollection,
    spInvokableFactory,
    _SPInstance,
    IDeleteable,
    deleteable,
    spPost,
    spPostMerge,
} from "../spqueryable.js";
import { SiteGroups, ISiteGroups } from "../site-groups/types.js";
import { body } from "@pnp/queryable";
import { defaultPath } from "../decorators.js";
import { PrincipalType } from "../types.js";

@defaultPath("siteusers")
export class _SiteUsers extends _SPCollection<ISiteUserInfo[]> {

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
     *   e.g. SharePoint Online: 'i:0#.f|membership|user@domain'
     */
    public getByLoginName(loginName: string): ISiteUser {
        return SiteUser(this).concat(`('!@v::${loginName}')`);
    }

    /**
     * Removes a user from the collection by id
     *
     * @param id The id of the user to remove
     */
    public removeById(id: number): Promise<any> {
        return spPost(SiteUsers(this, `removeById(${id})`));
    }

    /**
     * Removes a user from the collection by login name
     *
     * @param loginName The login name of the user to remove
     */
    public removeByLoginName(loginName: string): Promise<any> {
        const o = SiteUsers(this, "removeByLoginName(@v)");
        o.query.set("@v", `'${loginName}'`);
        return spPost(o);
    }

    /**
     * Adds a user to a site collection
     *
     * @param loginName The login name of the user to add  to a site collection
     *
     */
    public async add(loginName: string): Promise<ISiteUser> {
        await spPost(this, body({ LoginName: loginName }));
        return this.getByLoginName(loginName);
    }

    /**
     * Add a user to the collection by id
     *
     * @param id The id of the user to add
     */
    public addById(id: number): Promise<any> {
        return spPost(SiteUsers(this, `addUserById(${id})`));
    }
}
export interface ISiteUsers extends _SiteUsers { }
export const SiteUsers = spInvokableFactory<ISiteUsers>(_SiteUsers);

/**
 * Describes a single user
 *
 */
export class _SiteUser extends _SPInstance<ISiteUserInfo> {

    public delete = deleteable();

    /**
     * Gets the groups for this user
     *
     */
    public get groups(): ISiteGroups {
        return SiteGroups(this, "groups");
    }

    /**
     * Updates this user
     *
     * @param props Group properties to update
     */
    public async update(props: Partial<ISiteUserInfo>): Promise<void> {

        return spPostMerge(this, body(props));

    }

}
export interface ISiteUser extends _SiteUser, IDeleteable { }
export const SiteUser = spInvokableFactory<ISiteUser>(_SiteUser);

export interface ISiteUserInfo {

    Id: number;
    IsHiddenInUI: boolean;
    LoginName: string;
    Title: string;
    PrincipalType: number;
    Email: string;
    Expiration: string;
    IsEmailAuthenticationGuestUser: boolean;
    IsShareByEmailGuestUser: boolean;
    IsSiteAdmin: boolean;
    UserId: {
        NameId: string;
        NameIdIssuer: string;
    };
    UserPrincipalName: string | null;
}

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
