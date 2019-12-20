import {
    _SharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { ISerializableNavigationNode } from "../navigation/types";
import { defaultPath } from "../decorators";
import { Site, ISite } from "../sites/types";
import { tag } from "../telemetry";

@defaultPath("_api/hubsites")
export class _HubSites extends _SharePointQueryableCollection<IHubSiteInfo[]> {

    /**	    
     * Gets a Hub Site from the collection by id	     
     *	    
     * @param id The Id of the Hub Site	    
     */
    public getById(id: string): IHubSite {
        return tag.configure(HubSite(this, `GetById?hubSiteId='${id}'`), "hss.getById");

    }
}
export interface IHubSites extends _HubSites { }
export const HubSites = spInvokableFactory<IHubSites>(_HubSites);

export class _HubSite extends _SharePointQueryableInstance<IHubSiteInfo> {

    /**
     * Gets the ISite instance associated with this hubsite
     */
    @tag("hs.getSite")
    public async getSite(): Promise<ISite> {
        const d = await this.select("SiteUrl")();
        return Site(d.SiteUrl);
    }
}
export interface IHubSite extends _HubSite { }
export const HubSite = spInvokableFactory<IHubSite>(_HubSite);

export interface IHubSiteInfo {
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
