import {
    _SharePointQueryableInstance,
    ISharePointQueryableCollection,
    ISharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { SiteUsers, ISiteUsers } from "../site-users/types";
import { assign, TypedHash, hOP } from "@pnp/common";
import { metadata } from "../utils/metadata";
import { IInvokable, body } from "@pnp/odata";
import { defaultPath, clientTagMethod } from "../decorators";
import { spPost } from "../operations";
import "../security/web";

@defaultPath("sitegroups")
export class _SiteGroups extends _SharePointQueryableCollection implements _ISiteGroups {

    public getById(id: number): ISiteGroup {
        return clientTagMethod.configure(SiteGroup(this).concat(`(${id})`), "sgs.getById");
    }

    public async add(properties: TypedHash<any>): Promise<IGroupAddResult> {

        const postBody = body(assign(metadata("SP.Group"), properties));

        const data = await spPost(clientTagMethod.configure(this, "sgs.add"), postBody);
        return {
            data,
            group: this.getById(data.Id),
        };
    }

    public getByName(groupName: string): ISiteGroup {
        return clientTagMethod.configure(SiteGroup(this, `getByName('${groupName}')`), "sgs.getByName");
    }

    @clientTagMethod("sgs.removeById")
    public removeById(id: number): Promise<void> {
        return spPost(this.clone(SiteGroups, `removeById('${id}')`));
    }

    @clientTagMethod("sgs.removeByLoginName")
    public removeByLoginName(loginName: string): Promise<any> {
        return spPost(this.clone(SiteGroups, `removeByLoginName('${loginName}')`));
    }
}

/**
 * Describes a collection of site groups
 *
 */
export interface _ISiteGroups {
    /**	
     * Gets a group from the collection by id	
     *	
     * @param id The id of the group to retrieve	
     */
    getById(id: number): ISiteGroup;
    /**
     * Adds a new group to the site collection
     *
     * @param properties The group properties object of property names and values to be set for the group
     */
    add(properties: TypedHash<any>): Promise<IGroupAddResult>;
    /**
     * Gets a group from the collection by name
     *
     * @param groupName The name of the group to retrieve
     */
    getByName(groupName: string): ISiteGroup;
    /**
     * Removes the group with the specified member id from the collection
     *
     * @param id The id of the group to remove
     */
    removeById(id: number): Promise<void>;
    /**
     * Removes the cross-site group with the specified name from the collection
     *
     * @param loginName The name of the group to remove
     */
    removeByLoginName(loginName: string): Promise<any>;
}

export interface ISiteGroups extends _ISiteGroups, IInvokable, ISharePointQueryableCollection { }

export const SiteGroups = spInvokableFactory<ISiteGroups>(_SiteGroups);

export class _SiteGroup extends _SharePointQueryableInstance implements _ISiteGroup {

    public get users(): ISiteUsers {
        return clientTagMethod.configure(SiteUsers(this, "users"), "sg.users");
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

/**
 * Describes a single group
 *
 */
export interface _ISiteGroup {
    /**
     * Gets the users for this group
     *
     */
    readonly users: ISiteUsers;
    /**
     * Updates the group with the given property values
     * 
     * @param props The group properties object of property names and values to be set for the group
     */
    update(props: TypedHash<any>): Promise<IGroupUpdateResult>;
}

export interface ISiteGroup extends _ISiteGroup, IInvokable, ISharePointQueryableInstance { }

export const SiteGroup = spInvokableFactory<ISiteGroup>(_SiteGroup);

/**
 * Result from updating a group
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
