import { IInvokable } from "@pnp/odata";
import {
    _SharePointQueryableInstance,
    ISharePointQueryableCollection,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { INavigationNode } from "../navigation/types";
import { defaultPath } from "../decorators";

export interface IHubSiteData {
    Id?: string;
    Title?: string;
    SiteId?: string;
    TenantInstanceId?: string;
    SiteUrl?: string;
    LogoUrl?: string;
    Description?: string;
    Targets?: string;
}

export interface IHubSiteWebData {
    ThemeKey: string;
    Name: string;
    Url: string;
    LogoUrl: string;
    UsesMetadataNavigation: boolean;
    Navigation?: INavigationNode;
}

/**
 * Describes a collection of Hub Sites
 *
 */
@defaultPath("_api/hubsites")
export class _HubSites extends _SharePointQueryableCollection<IHubSiteData[]> implements IHubSites {

    /**	    
     * Gets a Hub Site from the collection by id	     
     *	    
     * @param id The Id of the Hub Site	    
     */
    public getById(id: string): IHubSite {
        return HubSite(this, `GetById?hubSiteId='${id}'`);

    }
}

export interface IHubSites extends IInvokable, ISharePointQueryableCollection<IHubSiteData[]> {
    getById(id: string): IHubSite;
}
export interface _HubSites extends IInvokable {}
export const HubSites = spInvokableFactory(_HubSites);



/**
 * Represents a hub site instance
 */
export class _HubSite extends _SharePointQueryableInstance<IHubSiteData> implements IHubSite { }

export interface IHubSite extends IInvokable, _SharePointQueryableInstance<IHubSiteData> {}
export interface _HubSite extends IInvokable {}
export const HubSite = spInvokableFactory<IHubSite>(_HubSite);
