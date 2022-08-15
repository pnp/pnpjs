// import { body } from "@pnp/queryable";
import { body, BufferParse } from "@pnp/queryable";
import { _SPInstance, defaultPath, spInvokableFactory, spPost } from "@pnp/sp";
import { IRenderListDataParameters } from "@pnp/sp/lists/index.js";
import { IHubSiteInfo } from "@pnp/sp/hubsites/index.js";
import {
    IHomeSitesDetails,
    IPortalHealthStatus,
    IPowerAppsEnvironment,
    ISiteAdministratorsFieldsData,
    ISiteAdminsInfo,
    ISiteCreationProps,
    ISitePropertiesEnumerableFilter,
    ISiteUserGroupsData,
    ISPHubSiteCreationInfo,
    ISPOOperation,
    ISPOSiteCreationSource,
    ISPOWebTemplatesInfo,
    ITenantInfo,
    ITenantSitePropertiesInfo,
    IUpdateGroupSiteProperties,
    SPOHubSiteUserRights,
} from "./types.js";

@defaultPath("_api/SPO.Tenant")
class _Tenant extends _SPInstance<ITenantInfo> {

    /**
    * Choose which fields to return
    *
    * @param selects One or more fields to return
    * @description we limit the selects here because there are so many values possible and it improves discoverability.
    * Unfortunately this doesn't work as a general solution due to expands
    */
    public select(...selects: ("*" | keyof ITenantInfo)[]): this {
        return super.select(...selects);
    }

    /**
     * Returns a site object for the given URL
     *
     * @param url URL of the requested site object
     * @param includeDetail true to include details
     * @returns Returns a site object for the given URL
     */
    public getSitePropertiesByUrl(url: string, includeDetail = false): Promise<Partial<ITenantSitePropertiesInfo>> {
        return spPost(Tenant(this, "GetSitePropertiesByUrl"), body({
            url,
            includeDetail,
        }));
    }

    /**
     * Gets SPOSiteProperties objects for all sites from SharePoint in the tenancy that match the filter expression
     *
     * @param speFilter If the filter is null or empty string, then all the sites are returned
     */
    public getSitePropertiesFromSharePointByFilters(speFilter: (Partial<ISitePropertiesEnumerableFilter> | null | "")): Promise<Partial<ITenantSitePropertiesInfo>[]> {
        return spPost(Tenant(this, "GetSitePropertiesFromSharePointByFilters"), body({
            speFilter,
        }));
    }

    /**
     * Get whether this tenant has valid education license
     */
    public hasValidEducationLicense(): Promise<boolean> {
        return spPost(Tenant(this, "HasValidEducationLicense"));
    }

    /**
     * Queues a site collection for creation with the given properties
     *
     * @param siteCreationProperties The initial properties for the site which is to be created
     * @returns Queues a site collection for creation with the given properties
     */
    public createSite(siteCreationProperties: ISiteCreationProps): Promise<ISPOOperation> {
        return spPost(Tenant(this, "CreateSite"), body({
            siteCreationProperties,
        }));
    }

    /**
     * Gets all the SPWebTemplates on this Tenant
     *
     * @returns An SPOWebTemplateCollection containing a SPOWebTemplate information for each template
     */
    public getSPOTenantAllWebTemplates(): Promise<ISPOWebTemplatesInfo> {
        return spPost(Tenant(this, "GetSPOTenantAllWebTemplates"));
    }

    /**
     * Handles updating the properties based on updateType of all the sites which are part of the groupId
     *
     * @param groupId Group Id
     * @param siteId Site Id
     * @param updateType Property which is required to be updated
     * @param UpdateGroupSitePropertiesParameters
     * @param parameters Params which are required to be passed based on the updateType
     * @returns string denoting the user storage key which can be used by client to pull the async workflow status
     */
    // eslint-disable-next-line max-len
    public updateGroupSiteProperties(groupId: string, siteId: string, updateType: "Unknow" | "StorageQuota", parameters: Partial<IUpdateGroupSiteProperties> = {}): Promise<string> {
        return spPost(Tenant(this, "UpdateGroupSiteProperties"), body({
            groupId,
            siteId,
            updateType,
            parameters,
        }));
    }

    /**
     * Gets all the site collection templates available in SPO for the given UI culture
     *
     * @returns An SPOWebTemplateCollection for all the site collection templates available in SPO for the given UI culture.
     */
    public getSPOAllWebTemplates(cultureName: string, compatibilityLevel: number): Promise<ISPOWebTemplatesInfo> {
        return spPost(Tenant(this, "GetSPOAllWebTemplates"), body({
            cultureName,
            compatibilityLevel,
        }));
    }

    /**
     * Gets all the SPWebTemplates for site collections on this Tenant
     *
     * @returns An SPOWebTemplateCollection for all the site collection templates available in SPO for the given UI culture.
     */
    public getSPOTenantWebTemplates(localeId: number, compatibilityLevel: number): Promise<ISPOWebTemplatesInfo> {
        return spPost(Tenant(this, "GetSPOTenantWebTemplates"), body({
            localeId,
            compatibilityLevel,
        }));
    }

    /**
     * Returns the site header logo by site URL.
     *
     * @param siteUrl Absolute URL to the site
     * @returns Stream containing the site logo data
     */
    public getSiteThumbnailLogo(siteUrl: string): Promise<ArrayBuffer> {
        return spPost(Tenant(this, "GetSiteThumbnailLogo").using(BufferParse()), body({
            siteUrl,
        }));
    }

    /**
     * Gets all the SPSiteCreationSources
     */
    public getSPOSiteCreationSources(): Promise<ISPOSiteCreationSource[]> {
        return spPost(Tenant(this, "GetSPOSiteCreationSources"));
    }

    /**
     * Deletes the site to the recycle bin
     *
     * @param siteUrl Absolute url of the site to remove
     */
    public removeSite(siteUrl: string): Promise<ISPOOperation> {
        return spPost(Tenant(this, "RemoveSite"), body({
            siteUrl,
        }));
    }

    /**
     * Gets the health Status of the site
     *
     * @param sourceUrl Absolute url of the site
     */
    public getSiteHealthStatus(sourceUrl: string): Promise<IPortalHealthStatus> {
        return spPost(Tenant(this, "GetSiteHealthStatus"), body({
            sourceUrl,
        }));
    }

    /**
     * Performs the Swap operation on the provided sites
     */
    public swapSiteWithSmartGestureOptionForce(sourceUrl: string, targetUrl: string, archiveUrl: string, includeSmartGestures: boolean, force: boolean): Promise<ISPOOperation> {
        return spPost(Tenant(this, "SwapSiteWithSmartGestureOptionForce"), body({
            sourceUrl,
            targetUrl,
            archiveUrl,
            includeSmartGestures,
            force,
        }));
    }

    /**
     * Performs the Swap operation on the provided sites
     */
    public swapSiteWithSmartGestureOption(sourceUrl: string, targetUrl: string, archiveUrl: string, includeSmartGestures: boolean): Promise<ISPOOperation> {
        return spPost(Tenant(this, "SwapSiteWithSmartGestureOption"), body({
            sourceUrl,
            targetUrl,
            archiveUrl,
            includeSmartGestures,
        }));
    }

    /**
     * Performs the Swap operation on the provided sites
     */
    public swapSite(sourceUrl: string, targetUrl: string, archiveUrl: string): Promise<ISPOOperation> {
        return spPost(Tenant(this, "SwapSite"), body({
            sourceUrl,
            targetUrl,
            archiveUrl,
        }));
    }

    /**
     * Permanently deletes the site from the recycle bin
     *
     * @param siteUrl URL of the site to be deleted
     */
    public removeDeletedSite(siteUrl: string): Promise<ISPOOperation> {
        return spPost(Tenant(this, "RemoveDeletedSite"), body({
            siteUrl,
        }));
    }

    /**
     * Permanently deletes the site from the recycle bin
     *
     * @param siteUrl URL of the site to be deleted
     * @param siteId SiteID of the site to be deleted
     */
    public removeDeletedSitePreferId(siteUrl: string, siteId: string): Promise<ISPOOperation> {
        return spPost(Tenant(this, "RemoveDeletedSitePreferId"), body({
            siteUrl,
            siteId,
        }));
    }

    /**
     * Restores site from deleted state (recycle bin)
     *
     * @param siteUrl URL of the site to be restored
     */
    public restoreDeletedSite(siteUrl: string): Promise<ISPOOperation> {
        return spPost(Tenant(this, "RestoreDeletedSite"), body({
            siteUrl,
        }));
    }

    /**
     * Restores site from deleted state (recycle bin)
     *
     * @param siteId SiteID of the site to be restored
     */
    public restoreDeletedSiteById(siteId: string): Promise<ISPOOperation> {
        return spPost(Tenant(this, "RestoreDeletedSiteById"), body({
            siteId,
        }));
    }

    /**
     * Restores site from deleted state (recycle bin)
     *
     * @param siteUrl URL of the site to be restored
     * @param siteId SiteID of the site to be deleted
     */
    public restoreDeletedSitePreferId(siteUrl: string, siteId: string): Promise<ISPOOperation> {
        return spPost(Tenant(this, "RestoreDeletedSitePreferId"), body({
            siteUrl,
            siteId,
        }));
    }

    /**
     * A collection of PowerApps environments
     */
    public getPowerAppsEnvironments(): Promise<IPowerAppsEnvironment[]> {
        return spPost(Tenant(this, "GetPowerAppsEnvironments"));
    }

    /**
     * Sets the configuration values for Idle session sign out for unmanaged devices
     * @param enabled Boolean indicating if the policy should be enabled
     * @param warnAfter TimeSpan containing the time before warning the user
     * @param signOutAfter TimeSpan containing the time before signing out the user
     * @returns True if the operation succeeds, false otherwise
     */
    public setIdleSessionSignOutForUnmanagedDevices(enabled: boolean, warnAfter: string, signOutAfter: string): Promise<IPowerAppsEnvironment[]> {
        return spPost(Tenant(this, "SetIdleSessionSignOutForUnmanagedDevices"), body({
            enabled,
            warnAfter,
            signOutAfter,
        }));
    }

    /**
     * Gets the configuration values for Idle session sign out for unmanaged devices
     */
    public getIdleSessionSignOutForUnmanagedDevices(): Promise<string> {
        return spPost(Tenant(this, "GetIdleSessionSignOutForUnmanagedDevices"));
    }

    /**
     * RESTful API to export SPList to CSV file and return file download link
     *
     * @param viewXml XML of the export view
     */
    public exportToCSV(viewXml: string): Promise<string> {
        return spPost(Tenant(this, "ExportToCSV"), body({
            viewXml,
        }));
    }

    /**
     * RESTful API to export SPList to CSV file and return file download link
     *
     * @param viewXml XML of the export view
     * @param listName Name of Admin SPList to be exported
     */
    public exportAdminListToCSV(viewXml: string, listName: string): Promise<string> {
        return spPost(Tenant(this, "ExportAdminListToCSV"), body({
            viewXml,
            listName,
        }));
    }

    /**
     * RESTful API to set site's user groups
     *
     */
    public setSiteUserGroups(siteUserGroupsData: ISiteUserGroupsData): Promise<void> {
        return spPost(Tenant(this, "SetSiteUserGroups"), body({
            siteUserGroupsData,
        }));
    }

    /**
     * RESTful API to set site administrators
     */
    public setSiteAdministrators(siteAdministratorsFieldsData: ISiteAdministratorsFieldsData): Promise<void> {
        return spPost(Tenant(this, "SetSiteAdministrators"), body({
            siteAdministratorsFieldsData,
        }));
    }

    /**
     * RESTful API to check tenant licenses.
     *
     * @returns True if and only if tenant has all licenses in parameter
     */
    public checkTenantLicenses(licenses: string[]): Promise<boolean> {
        return spPost(Tenant(this, "CheckTenantLicenses"), body({
            licenses,
        }));
    }

    /**
     * RESTful API to check tenant intune license
     */
    public checkTenantIntuneLicense(): Promise<boolean> {
        return spPost(Tenant(this, "CheckTenantIntuneLicense"));
    }

    /**
     * Gets a list of site administrators for the given site
     *
     * @param siteId guid site id
     * @returns Array of site admins
     */
    public getSiteAdministrators(siteId: string): Promise<ISiteAdminsInfo[]> {
        return spPost(Tenant(this, "GetSiteAdministrators"), body({
            siteId,
        }));
    }

    /**
     * Renders Tenant Admin SPList Data after filtering based on the groupId the site belongs to
     *
     * @param groupId Group Id the sites belong to
     */
    public renderFilteredAdminListDataByGroupId(groupId: string): Promise<ArrayBuffer> {
        return spPost(Tenant(this, "RenderFilteredAdminListDataByGroupId").using(BufferParse()), body({
            groupId,
        }));
    }

    /**
     * Renders Tenant Admin SPList Data
     */
    public renderAdminListData(listName: string, parameters: IRenderListDataParameters, overrideParameters: any = null): Promise<ArrayBuffer> {
        return spPost(Tenant(this, "RenderAdminListData").using(BufferParse()), body({
            parameters,
            overrideParameters,
            listName,
        }));
    }

    /**
     * Renders Tenant Admin SPList Data after filtering based on filter conditions
     */
    public renderFilteredAdminListData(listName: string, parameters: IRenderListDataParameters): Promise<ArrayBuffer> {
        return spPost(Tenant(this, "RenderFilteredAdminListData").using(BufferParse()), body({
            parameters,
            listName,
        }));
    }

    /**
     * Gets SPList total item Count
     *
     * @param listName Optional List Name. By Default Aggregated TenantAdmin SPList will be used
     * @returns List item count
     */
    public getSPListItemCount(listName?: string): Promise<number> {
        return spPost(Tenant(this, "GetSPListItemCount"), body({
            listName,
        }));
    }

    /**
     * Registers the site with the specified URL as a HubSite
     *
     * @param siteUrl The URL of the site to make into a HubSite
     * @returns The properties of the new HubSite
     */
    public registerHubSite(siteUrl: string): Promise<IHubSiteInfo> {
        return spPost(Tenant(this, "RegisterHubSite"), body({
            siteUrl,
        }));
    }

    /**
     * Registers the site with the specified URL as a HubSite
     *
     * @param siteUrl The URL of the site to make into a HubSite
     * @param creationInformation Information used to create this HubSite, If not specified, some default properties will be set instead
     * @returns The properties of the new HubSite
     */
    public registerHubSiteWithCreationInformation(siteUrl: string, creationInformation: Partial<ISPHubSiteCreationInfo> = null): Promise<IHubSiteInfo> {
        return spPost(Tenant(this, "RegisterHubSiteWithCreationInformation"), body({
            siteUrl,
            creationInformation,
        }));
    }

    /**
     * Makes the specified site no longer a HubSite and removes it from the list of HubSites The site is not deleted by this operation;
     * it is merely removed from the list of available HubSites
     *
     * @param siteUrl The URL of the site which should no longer be a HubSite
     */
    public unregisterHubSite(siteUrl: string): Promise<IHubSiteInfo> {
        return spPost(Tenant(this, "UnregisterHubSite"), body({
            siteUrl,
        }));
    }

    /**
     * Connects a site to a HubSite using hub site id, support multi-geo
     *
     * @param siteUrl URL of the site to connect to the HubSite
     * @param hubSiteId Guid of the HubSite ID
     */
    public connectSiteToHubSiteById(siteUrl: string, hubSiteId: string): Promise<void> {
        return spPost(Tenant(this, "ConnectSiteToHubSiteById"), body({
            siteUrl,
            hubSiteId,
        }));
    }

    /**
     * Grant HubSite rights to users giving HubSite ID, support multi-geo
     *
     * @param hubSiteId ID of the HubSite
     * @param principals principals of users to grant rights
     * @param grantedRights The HubSite rights to grant
     */
    public grantHubSiteRightsById(hubSiteId: string, principals: string[], grantedRights: SPOHubSiteUserRights): Promise<IHubSiteInfo> {
        return spPost(Tenant(this, "GrantHubSiteRightsById"), body({
            hubSiteId,
            principals,
            grantedRights,
        }));
    }

    /**
     * Revoke HubSite rights from users giving HubSite ID, support multi-geo
     *
     * @param hubSiteId ID of the HubSite
     * @param principals principals of users to revoke rights
     */
    public revokeHubSiteRightsById(hubSiteId: string, principals: string[]): Promise<IHubSiteInfo> {
        return spPost(Tenant(this, "RevokeHubSiteRightsById"), body({
            hubSiteId,
            principals,
        }));
    }

    /**
     * Get the home site Ids, url and site title
     *
     * @param bypasscache bypass tenant store cache
     * @param expandDetails call the expensive API with cross geo call to fill siteUrl and site title
     */
    public getHomeSitesDetails(bypasscache = false, expandDetails = false): Promise<IHomeSitesDetails> {

        const q = Tenant(this, "GetHomeSitesDetails");
        if (bypasscache) {
            q.query.set("bypasscache", "true");
        }
        if (expandDetails) {
            q.query.set("expandDetails", "true");
        }

        return spPost(q);
    }

    /**
     * Add a new home site in tenant admin setting
     *
     * @param homeSiteUrl The home site URL
     * @param audiences The targeting audiences
     * @param order The rank order of this home site. The order starts at 1, defaults to end of order if not provided
     * @returns Details about ID, title, URL from the adding home site
     */
    public addHomeSite(homeSiteUrl: string, audiences: string[], order?: number): Promise<IHomeSitesDetails> {
        return spPost(Tenant(this, "AddHomeSite"), body({
            homeSiteUrl,
            audiences,
            order,
        }));
    }

    /**
     * Update the home site with specific URL for its audiences
     *
     * @param homeSiteUrl The home site URL
     * @param audiences The targeting audiences
     * @param order The rank order of this home site. The order starts at 1, defaults to end of order if not provided
     * @returns Details about ID, title, URL from the adding home site
     */
    public updateHomeSite(homeSiteUrl: string, audiences: string[], order?: number): Promise<IHomeSitesDetails> {
        return spPost(Tenant(this, "UpdateHomeSite"), body({
            homeSiteUrl,
            audiences,
            order,
        }));
    }

    /**
     * Reorder the rank of all home sites in tenant admin setting
     *
     * @param homeSitesSiteIds All home sites siteId with new order
     * @returns Details about siteId and webId from all home sites in a new order
     */
    public reorderHomeSites(homeSitesSiteIds: string[]): Promise<IHomeSitesDetails[]> {
        return spPost(Tenant(this, "ReorderHomeSites"), body({
            homeSitesSiteIds,
        }));
    }

    /**
     * Remove a home site in tenant admin setting
     *
     * @param homeSiteUrl The home site URL
     */
    public removeHomeSite(homeSiteUrl: string): Promise<void> {
        return spPost(Tenant(this, "RemoveHomeSite"), body({
            homeSiteUrl,
        }));
    }

    /**
     * Get site subscription id
     */
    public getSiteSubscriptionId(): Promise<string> {
        return spPost(Tenant(this, "GetSiteSubscriptionId"));
    }

    /**
     * Supports calling POST methods not added explicitly to this class
     *
     * @param method method name, used in url path (ex: "CreateGroupForSite")
     * @param args optional, any arguments to include in the body
     * @returns The result of the method invocation T
     */
    public call<T = any>(method: string, args?: any): Promise<T> {
        const query = Tenant(this, method);
        if (typeof args !== "undefined") {
            return spPost(query, body(args));
        } else {
            return spPost(query);
        }
    }
}
export interface ITenant extends _Tenant { }
export const Tenant = spInvokableFactory<ITenant>(_Tenant);
