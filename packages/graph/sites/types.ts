import { defaultPath } from "../decorators.js";
import { graphInvokableFactory, _GraphQueryableCollection, _GraphQueryableInstance } from "../graphqueryable.js";
import { Site as ISiteType } from "@microsoft/microsoft-graph-types";

/**
 * Sites
 */
@defaultPath("sites")
export class _Sites extends _GraphQueryableCollection<ISiteType[]> {
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
    public getByUrl(hostname: string, siteUrl: string): ISite {
        return Site(this, `${hostname}:${siteUrl}:`);
    }
}
export interface ISites extends _Sites { }
export const Sites = graphInvokableFactory<ISites>(_Sites);

/**
 * Site
 */
export class _Site extends _GraphQueryableInstance<ISiteType> {

    public get sites(): ISites {
        return Sites(this);
    }
}
export interface ISite extends _Site { }
export const Site = graphInvokableFactory<ISite>(_Site);

