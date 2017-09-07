import { SharePointQueryable, SharePointQueryableInstance, SharePointQueryableCollection } from "./sharepointqueryable";
import { SiteUsers } from "./siteusers";
import { Util } from "../utils/util";
import { TypedHash } from "../collections/collections";

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
export class SiteGroups extends SharePointQueryableCollection {

    /**
     * Creates a new instance of the SiteGroups class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this group collection
     */
    constructor(baseUrl: string | SharePointQueryable, path = "sitegroups") {
        super(baseUrl, path);
    }

    /**
     * Adds a new group to the site collection
     *
     * @param props The group properties object of property names and values to be set for the group
     */
    public add(properties: TypedHash<any>): Promise<GroupAddResult> {
        const postBody = JSON.stringify(Util.extend(
            { "__metadata": { "type": "SP.Group" } }, properties));

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

    /**
    * Updates this group instance with the supplied properties
    *
    * @param properties A GroupWriteableProperties object of property names and values to update for the group
    */
    /* tslint:disable no-string-literal */
    public update(properties: TypedHash<any>): Promise<GroupUpdateResult> {

        const postBody = Util.extend({ "__metadata": { "type": "SP.Group" } }, properties);

        return this.postCore({
            body: JSON.stringify(postBody),
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then((data) => {

            let retGroup: SiteGroup = this;

            if (properties.hasOwnProperty("Title")) {
                retGroup = this.getParent(SiteGroup, this.parentUrl, `getByName('${properties["Title"]}')`);
            }

            return {
                data: data,
                group: retGroup,
            };
        });
    }
    /* tslint:enable */
}

export interface SiteGroupAddResult {
    group: SiteGroup;
    data: any;
}
