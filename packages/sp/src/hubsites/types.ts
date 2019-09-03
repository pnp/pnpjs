import { IInvokable } from "@pnp/odata";
import {
    _SharePointQueryableInstance,
    ISharePointQueryableCollection,
    _SharePointQueryableCollection,
    spInvokableFactory,
    ISharePointQueryableInstance,
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


@defaultPath("_api/hubsites")
export class _HubSites extends _SharePointQueryableCollection<IHubSiteData[]> implements _IHubSites {

    public getById(id: string): IHubSite {
        return HubSite(this, `GetById?hubSiteId='${id}'`);

    }
}

/**
 * Describes a collection of Hub Sites
 *
 */
export interface _IHubSites {

    /**	    
     * Gets a Hub Site from the collection by id	     
     *	    
     * @param id The Id of the Hub Site	    
     */
    getById(id: string): IHubSite;
}

export interface IHubSites extends _IHubSites, IInvokable, ISharePointQueryableCollection<IHubSiteData[]> { }

export const HubSites = spInvokableFactory<IHubSites>(_HubSites);

export class _HubSite extends _SharePointQueryableInstance<IHubSiteData> implements _IHubSite { }

/**
 * Represents a hub site instance
 */
export interface _IHubSite { }

export interface IHubSite extends _IHubSite, IInvokable, ISharePointQueryableInstance<IHubSiteData> { }

export const HubSite = spInvokableFactory<IHubSite>(_HubSite);
