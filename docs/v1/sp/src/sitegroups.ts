import { SharePointQueryableInstance, SharePointQueryableCollection, defaultPath } from "./sharepointqueryable";
import { SiteUsers } from "./siteusers";
import { extend, TypedHash, jsS, hOP } from "@pnp/common";
import { metadata } from "./utils/metadata";

/**
 * Principal Type enum
 *
 */
export enum PrincipalType {
    None = 0,
    User = 1,
    DistributionList = 2,
    SecurityGroup = 4,
    SharePointGroup = 8,
    All = 15,
}

/**
 * Results from updating a group
 *
 */
export interface GroupUpdateResult {
    group: SiteGroup;
    data: any;
}

/**
 * Results from adding a group
 *
 */
export interface GroupAddResult {
    group: SiteGroup;
    data: any;
}

/**
 * Describes a collection of site groups
 *
 */
@defaultPath("sitegroups")
export class SiteGroups extends SharePointQueryableCollection {

    /**	
     * Gets a group from the collection by id	
     *	
     * @param id The id of the group to retrieve	
     */
    public getById(id: number) {
        const sg = new SiteGroup(this);
        sg.concat(`(${id})`);
        return sg;
    }

    /**
     * Adds a new group to the site collection
     *
     * @param props The group properties object of property names and values to be set for the group
     */
    public add(properties: TypedHash<any>): Promise<GroupAddResult> {
        const postBody = jsS(extend(metadata("SP.Group"), properties));

        return this.postCore({ body: postBody }).then((data) => {
            return {
                data: data,
                group: this.getById(data.Id),
            };
        });
    }

    /**
     * Gets a group from the collection by name
     *
     * @param groupName The name of the group to retrieve
     */
    public getByName(groupName: string): SiteGroup {
        return new SiteGroup(this, `getByName('${groupName}')`);
    }

    /**
     * Removes the group with the specified member id from the collection
     *
     * @param id The id of the group to remove
     */
    public removeById(id: number): Promise<void> {
        return this.clone(SiteGroups, `removeById('${id}')`).postCore();
    }

    /**
     * Removes the cross-site group with the specified name from the collection
     *
     * @param loginName The name of the group to remove
     */
    public removeByLoginName(loginName: string): Promise<any> {
        return this.clone(SiteGroups, `removeByLoginName('${loginName}')`).postCore();
    }
}

/**
 * Describes a single group
 *
 */
export class SiteGroup extends SharePointQueryableInstance {

    /**
     * Gets the users for this group
     *
     */
    public get users(): SiteUsers {
        return new SiteUsers(this, "users");
    }

    public update = this._update<GroupUpdateResult, TypedHash<any>, any>("SP.Group", (d, p) => {
        let retGroup: SiteGroup = this;

        if (hOP(p, "Title")) {
            /* tslint:disable-next-line no-string-literal */
            retGroup = this.getParent(SiteGroup, this.parentUrl, `getByName('${p["Title"]}')`);
        }

        return {
            data: d,
            group: retGroup,
        };
    });
}

export interface SiteGroupAddResult {
    group: SiteGroup;
    data: any;
}
