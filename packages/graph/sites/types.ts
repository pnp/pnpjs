import { combine } from "@pnp/core";
import { defaultPath } from "../decorators.js";
import { graphInvokableFactory, _GraphCollection, _GraphInstance } from "../graphqueryable.js";
import { Site as ISiteType } from "@microsoft/microsoft-graph-types";
import { graphPost } from "../ops.js";
import { body } from "@pnp/queryable";

/**
 * Sites
 */
@defaultPath("sites")
export class _Sites extends _GraphCollection<ISiteType[]> {
    /**
     * Gets the team site for the group
     */
    public get root(): ISite {
        return Site(this, "root");
    }

    public getById(id: string): ISite {
        return Site(this, id);
    }

    /**
     * Get a Site by URL
     * @param hostname: string, the host of the site e.g. "contoso.sharepoint.com"
     * @param siteUrl: string, the server relative url of the site e.g. "/sites/teamsite1"
     * @returns ISite
    */
    public async getByUrl(hostname: string, siteUrl: string): Promise<ISite> {

        return Site(this, `${hostname}:${combine("/", siteUrl)}:`).rebase();
    }

    /**
     * List sites across geographies in an organization. This API can also be used to enumerate all sites in a non-multi-geo tenant.
     *
     * @returns A ISites collection which can be used with async iteration to page through the collection
     */
    public getAllSites(): ISites {
        return Sites(this, "getAllSites");
    }
}
export interface ISites extends _Sites { }
export const Sites = graphInvokableFactory<ISites>(_Sites);

/**
 * Site
 */
export class _Site extends _GraphInstance<ISiteType> {

    public get sites(): ISites {
        return Sites(this);
    }

    /**
     * Rebases this ISite instances to ensure it is of the pattern /sites/{site id} regardless of how it was first retrieved
     */
    public async rebase(): Promise<ISite> {
        const siteInfo = await Site(this).select("id")();
        return Site([this, `sites/${siteInfo.id}`]);
    }
}
export interface ISite extends _Site { }
export const Site = graphInvokableFactory<ISite>(_Site);

/**
 * Followed Sites
 *
 * Note: At this time listing a user's followed sites is not supported with app-only permissions
 */
@defaultPath("followedsites")
export class _FollowedSites extends _GraphCollection<ISiteType[]> {

    /**
     * Adds site(s) to the user's collection of followed sites
     *
     * @param siteIds The collection of site ids to add
     * @returns Site info for the newly followed sites
     */
    public add(...siteIds: string[]): Promise<ISiteType[]> {

        return graphPost(FollowedSites(this, "add"), body({ value: siteIds.map(id => ({ id })) }));
    }

    /**
     * REmoves site(s) to the user's collection of followed sites
     *
     * @param siteIds The collection of site ids to remove
     */
    public remove(...siteIds: string[]): Promise<void> {

        return graphPost(FollowedSites(this, "remove"), body({ value: siteIds.map(id => ({ id })) }));
    }
}
export interface IFollowedSites extends _FollowedSites { }
export const FollowedSites = graphInvokableFactory<IFollowedSites>(_FollowedSites);
