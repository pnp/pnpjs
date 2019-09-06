import { IInvokable } from "@pnp/odata";
import {
    _SharePointQueryableInstance,
    ISharePointQueryableCollection,
    _SharePointQueryableCollection,
    spInvokableFactory,
    ISharePointQueryableInstance,
} from "../sharepointqueryable";
import { ISerializableNavigationNode } from "../navigation/types";
import { defaultPath, clientTagMethod } from "../decorators";
import { Site, ISite } from "../sites/types";

export interface IHubSiteData {
    ID: string;
    Title: string;
    SiteId: string;
    TenantInstanceId: string;
    SiteUrl: string;
    LogoUrl: string;
    Description: string;
    Targets: string;
    SiteDesignId: string;
    RequiresJoinApproval: boolean;
    RelatedHubSiteIds: string[];
    ParentHubSiteId: string;
    HideNameInNavigation: boolean;
    EnablePermissionsSync: boolean;
}

export interface IHubSiteWebData {
    headerEmphasis: string | null;
    themeKey: string | null;
    name: string | null;
    url: string;
    logoUrl: string | null;
    usesMetadataNavigation: boolean;
    megaMenuEnabled: boolean;
    navigation: ISerializableNavigationNode[];
    isNavAudienceTargeted: boolean;
    siteDesignId: string;
    requiresJoinApproval: boolean;
    hideNameInNavigation: boolean;
    parentHubSiteId: string;
    relatedHubSiteIds: string | null;
}

@defaultPath("_api/hubsites")
export class _HubSites extends _SharePointQueryableCollection<Partial<IHubSiteData>[]> implements _IHubSites {

    public getById(id: string): IHubSite {
        return clientTagMethod.configure(HubSite(this, `GetById?hubSiteId='${id}'`), "hss.getById");

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

export class _HubSite extends _SharePointQueryableInstance<Partial<IHubSiteData>> implements _IHubSite {

    @clientTagMethod("hs.getSite")
    public async getSite(): Promise<ISite> {

        const d = await this.select("SiteUrl")();
        return Site(d.SiteUrl);
    }
}

/**
 * Represents a hub site instance
 */
export interface _IHubSite {
    /**
     * Gets the ISite instance associated with this hubsite
     */
    getSite(): Promise<ISite>;
}

export interface IHubSite extends _IHubSite, IInvokable, ISharePointQueryableInstance<IHubSiteData> { }

export const HubSite = spInvokableFactory<IHubSite>(_HubSite);
