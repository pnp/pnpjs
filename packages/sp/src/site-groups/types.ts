import {
    _SharePointQueryableInstance,
    ISharePointQueryableCollection,
    ISharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { SiteUsers, ISiteUsers } from "../site-users/types";
import { extend, TypedHash, hOP } from "@pnp/common";
import { metadata } from "../utils/metadata";
import { IInvokable, body } from "@pnp/odata";
import { defaultPath } from "../decorators";
import { spPost } from "../operations";

/**
 * Describes a collection of site groups
 *
 */
@defaultPath("sitegroups")
export class _SiteGroups extends _SharePointQueryableCollection implements ISiteGroups {

    /**	
     * Gets a group from the collection by id	
     *	
     * @param id The id of the group to retrieve	
     */
    public getById(id: number): ISiteGroup {
        return SiteGroup(this).concat(`(${id})`);
    }

    /**
     * Adds a new group to the site collection
     *
     * @param props The group properties object of property names and values to be set for the group
     */
    public async add(properties: TypedHash<any>): Promise<IGroupAddResult> {

        const postBody = body(extend(metadata("SP.Group"), properties));

        const data = await spPost(this, postBody);
        return {
            data,
            group: this.getById(data.Id),
        };
    }

    /**
     * Gets a group from the collection by name
     *
     * @param groupName The name of the group to retrieve
     */
    public getByName(groupName: string): ISiteGroup {
        return SiteGroup(this, `getByName('${groupName}')`);
    }

    /**
     * Removes the group with the specified member id from the collection
     *
     * @param id The id of the group to remove
     */
    public removeById(id: number): Promise<void> {
        return spPost(this.clone(SiteGroups, `removeById('${id}')`));
    }

    /**
     * Removes the cross-site group with the specified name from the collection
     *
     * @param loginName The name of the group to remove
     */
    public removeByLoginName(loginName: string): Promise<any> {
        return spPost(this.clone(SiteGroups, `removeByLoginName('${loginName}')`));
    }
}

export interface ISiteGroups extends IInvokable, ISharePointQueryableCollection {
    getById(id: number): ISiteGroup;
    add(properties: TypedHash<any>): Promise<IGroupAddResult>;
    getByName(groupName: string): ISiteGroup;
    removeById(id: number): Promise<void>;
    removeByLoginName(loginName: string): Promise<any>;
}
export interface _SiteGroups extends IInvokable { }
export const SiteGroups = spInvokableFactory<ISiteGroups>(_SiteGroups);

/**
 * Describes a single group
 *
 */
export class _SiteGroup extends _SharePointQueryableInstance implements ISiteGroup {

    /**
     * Gets the users for this group
     *
     */
    public get users(): ISiteUsers {
        return SiteUsers(this, "users");
    }

    public update = this._update<IGroupUpdateResult, TypedHash<any>, any>("SP.Group", (d, p) => {

        let retGroup: ISiteGroup = this;

        if (hOP(p, "Title")) {
            /* tslint:disable-next-line no-string-literal */
            retGroup = this.getParent(_SiteGroup, this.parentUrl, `getByName('${p["Title"]}')`);
        }

        return {
            data: d,
            group: retGroup,
        };
    });
}

export interface ISiteGroup extends IInvokable, ISharePointQueryableInstance {
    readonly users: ISiteUsers;
    update(props: TypedHash<any>): Promise<IGroupUpdateResult>;
}
export interface _SiteGroup extends IInvokable { }
export const SiteGroup = spInvokableFactory<ISiteGroup>(_SiteGroup);

export interface SiteGroupAddResult {
    group: ISiteGroup;
    data: any;
}

/**
 * Results from updating a group
 *
 */
export interface IGroupUpdateResult {
    group: ISiteGroup;
    data: any;
}

/**
 * Results from adding a group
 *
 */
export interface IGroupAddResult {
    group: ISiteGroup;
    data: any;
}
