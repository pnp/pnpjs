import { body } from "@pnp/queryable";
import { _SPInstance, defaultPath, spPost, IResourcePath, spInvokableFactory } from "@pnp/sp";
import {
    IGetExternalUsersResults,
    IImportProfilePropertiesJobInfo,
    ImportProfilePropertiesUserIdTypes,
    IOffice365TenantInfo,
    IRemoveExternalUsersResults,
    ISPOUserSessionRevocationResult,
    IThemeProperties,
    SortOrder,
    SPOrgAssetType,
    SPOTenantCdnPolicyType,
    SPOTenantCdnType,
} from "./types.js";

@defaultPath("_api/Microsoft.Online.SharePoint.TenantManagement.Office365Tenant")
class _Office365Tenant extends _SPInstance<IOffice365TenantInfo> {

    /**
    * Choose which fields to return
    *
    * @param selects One or more fields to return
    * @description we limit the selects here because there are so many values possible and it improves discoverability.
    * Unfortunately this doesn't work as a general solution due to expands
    */
    public select(...selects: ("*" | keyof IOffice365TenantInfo)[]): this {
        return super.select(...selects);
    }

    /**
     *Sets the configuration values for Idle session sign out for unmanaged devices
     *
     *@param enabled Boolean indicating if the policy should be enabled
     *@param warnAfter TimeSpan containing the time before warning the user
     *@param signOutAfter TimeSpan containing the time before signing out the user
     *@returns True if the operation succeeds, false otherwise
     */
    public setIdleSessionSignOutForUnmanagedDevices(enabled: boolean, warnAfter: any, signOutAfter: any): Promise<boolean> {
        return spPost(Office365Tenant(this, "SetIdleSessionSignOutForUnmanagedDevices"), body({
            enabled,
            warnAfter,
            signOutAfter,
        }));
    }

    /**
     *Gets the configuration values, as a string, for Idle session sign out for unmanaged devices
     *The return string is a comma delineated list of the three policy settings.  The policy settings consist of
     *1. Enabled: true or false
     *2. Warn after: Time until user should be warned in seconds.
     *3. Sign out after: Time until user should be signed out in seconds.
     *
     *@returns A string indicating the current policy settings
     */
    public getIdleSessionSignOutForUnmanagedDevices(): Promise<string> {
        return spPost(Office365Tenant(this, "GetIdleSessionSignOutForUnmanagedDevices"));
    }

    /**
     *Adds a SharePoint document library to the list of Organization Assets libraries
     *
     *@param cdnType
     *@param libUrl Url of a SharePoint document library to be added to the list of Organization Assets libraries
     *@param thumbnailUrl
     *@param orgAssetType
     *@param defaultOriginAdded
     */
    // eslint-disable-next-line max-len
    public addToOrgAssetsLibAndCdn(cdnType: SPOTenantCdnType, libUrl: IResourcePath, thumbnailUrl: IResourcePath, orgAssetType: SPOrgAssetType, defaultOriginAdded: boolean): Promise<void> {
        return spPost(Office365Tenant(this, "AddToOrgAssetsLibAndCdn"), body({
            cdnType,
            libUrl,
            thumbnailUrl,
            orgAssetType,
            defaultOriginAdded,
        }));
    }

    public removeFromOrgAssetsAndCdn(remove: boolean, cdnType: SPOTenantCdnType, libUrl: IResourcePath): Promise<void> {
        return spPost(Office365Tenant(this, "RemoveFromOrgAssetsAndCdn"), body({
            remove,
            cdnType,
            libUrl,
        }));
    }

    /**
     *Removes an entry from the list of Organization Assets libraries
     */
    public removeFromOrgAssets(libUrl: IResourcePath, listId: string): Promise<void> {
        return spPost(Office365Tenant(this, "RemoveFromOrgAssets"), body({
            libUrl,
            listId,
        }));
    }

    /**
     *Sets a SharePoint library thumbnail in Organization Assets libraries
     *
     *@param libUrl Url of a SharePoint library to be set in Organization Assets
     *@param thumbnailUrl Url to an image used as the thumbnail for this library in the FilePicker
     *@param orgAssetType Type of Organization Assets Document Library
     */
    public setOrgAssetsLib(libUrl: IResourcePath, thumbnailUrl: IResourcePath, orgAssetType: SPOrgAssetType): Promise<void> {
        return spPost(Office365Tenant(this, "SetOrgAssetsLib"), body({
            libUrl,
            thumbnailUrl,
            orgAssetType,
        }));
    }

    /**
     * Gets the minor version that should be used to generate the next iteration of the custom font catalog for the
     * font org asset library specified by libUrl
     */
    public getCustomFontsMinorVersion(libUrl: IResourcePath): Promise<number> {
        return spPost(Office365Tenant(this, "GetCustomFontsMinorVersion"), body({
            libUrl,
        }));
    }

    /**
     *Uploads fonts and font catalogs to a font asset library
     */
    public uploadCustomFontsAndCatalogLib(customFontFiles: any, libUrl: IResourcePath): Promise<boolean> {
        return spPost(Office365Tenant(this, "UploadCustomFontsAndCatalogLib"), body({
            customFontFiles,
            libUrl,
        }));
    }

    /**
     *Removes old Custom Fonts files
     */
    public removePreviousCustomFontUpload(majVersions: string[], libUrl: IResourcePath): Promise<void> {
        return spPost(Office365Tenant(this, "RemovePreviousCustomFontUpload"), body({
            majVersions,
            libUrl,
        }));
    }

    /**
     *Increments the minor version for libUrl
     */
    public incrementCustomFontsMinorVersion(libUrl: IResourcePath): Promise<void> {
        return spPost(Office365Tenant(this, "IncrementCustomFontsMinorVersion"), body({
            libUrl,
        }));
    }

    /**
     *Gets a list of tenant CDN origins
     *
     *@param cdnType Type of CDN: private or public
     */
    public getTenantCdnOrigins(cdnType: SPOTenantCdnType): Promise<string[]> {
        return spPost(Office365Tenant(this, "GetTenantCdnOrigins"), body({
            cdnType,
        }));
    }

    /**
     *Adds a tenant cdn origin
     *
     *@param cdnType Type of CDN: private or public
     *@param originUrl origin Url to add
     */
    public addTenantCdnOrigin(cdnType: SPOTenantCdnType, originUrl: string): Promise<void> {
        return spPost(Office365Tenant(this, "AddTenantCdnOrigin"), body({
            cdnType,
            originUrl,
        }));
    }

    /**
     *Removes a tenant cdn origin
     *
     *@param cdnType Type of CDN: private or public
     *@param originUrl origin Url to remove
     */
    public removeTenantCdnOrigin(cdnType: SPOTenantCdnType, originUrl: string): Promise<void> {
        return spPost(Office365Tenant(this, "RemoveTenantCdnOrigin"), body({
            cdnType,
            originUrl,
        }));
    }

    /**
     *Enables or disabled tenant CDN feature
     *
     *@param cdnType Type of CDN: private or public
     *@param isEnabled value to set
     */
    public setTenantCdnEnabled(cdnType: SPOTenantCdnType, isEnabled: boolean): Promise<void> {
        return spPost(Office365Tenant(this, "setTenantCdnEnabled"), body({
            cdnType,
            isEnabled,
        }));
    }

    /**
     *Gets whether tenant CDN feature is enabled
     *
     *@param cdnType Type of CDN: private or public
     *@returns True if CDN is enabled; false otherwise
     */
    public getTenantCdnEnabled(cdnType: SPOTenantCdnType): Promise<boolean> {
        return spPost(Office365Tenant(this, "GetTenantCdnEnabled"), body({
            cdnType,
        }));
    }

    /**
     *Sets policy for the tenant CDN
     *
     *@param cdnType CDN type
     *@param policy Policy type
     *@param policyValue Policy value
     */
    public setTenantCdnPolicy(cdnType: SPOTenantCdnType, policy: SPOTenantCdnPolicyType, policyValue: string): Promise<void> {
        return spPost(Office365Tenant(this, "SetTenantCdnPolicy"), body({
            cdnType,
            policy,
            policyValue,
        }));
    }

    /**
     *Gets list of policies for the tenant CDN
     *
     *@param cdnType CDN type
     *@returns List of policies
     */
    public getTenantCdnPolicies(cdnType: SPOTenantCdnType): Promise<string[]> {
        return spPost(Office365Tenant(this, "GetTenantCdnPolicies"), body({
            cdnType,
        }));
    }

    /**
     *Creates default origins for requested CDN type
     */
    public createTenantCdnDefaultOrigins(cdnType: SPOTenantCdnType): Promise<void> {
        return spPost(Office365Tenant(this, "CreateTenantCdnDefaultOrigins"), body({
            cdnType,
        }));
    }

    /**
     *Add a custom theme to the tenant so that it will be available when selecting a site theme
     *
     *@param name The name of the theme
     *@param themeJson A JSON representation of the theme information
     *@returns True, if the theme is added successfully
     */
    public addTenantTheme(name: string, themeJson: string): Promise<boolean> {
        return spPost(Office365Tenant(this, "AddTenantTheme"), body({
            name,
            themeJson,
        }));
    }

    /**
     *Update the properties of a custom theme
     *
     *@param name The name of the theme to update
     *@param themeJson A JSON representation of the new theme information
     *@returns True, if the theme is updated successfully
     */
    public updateTenantTheme(name: string, themeJson: string): Promise<boolean> {
        return spPost(Office365Tenant(this, "UpdateTenantTheme"), body({
            name,
            themeJson,
        }));
    }

    /**
     *Remove a custom theme from the tenant
     *
     *@param name The name of the theme to delete
     */
    public deleteTenantTheme(name: string): Promise<void> {
        return spPost(Office365Tenant(this, "DeleteTenantTheme"), body({
            name,
        }));
    }

    /**
     *Retrieves a custom theme previously added to the tenant
     *
     *@param name The name of the theme to retrieve
     *@returns A ThemeProperties object representing the theme
     */
    public getTenantTheme(name: string): Promise<IThemeProperties> {
        return spPost(Office365Tenant(this, "GetTenantTheme"), body({
            name,
        }));
    }

    /**
     *Retrieves all custom themes added to the tenant
     *
     *@returns ThemeProperties objects representing all of the custom themes added to the tenant
     */
    public getAllTenantThemes(): Promise<IThemeProperties[]> {
        return spPost(Office365Tenant(this, "GetAllTenantThemes"));
    }

    /**
     *Retrieves a setting specifying whether default SharePoint themes should be hidden from the web UI
     *
     *@return True, if default SharePoint themes should be hidden from the web UI
     */
    public getHideDefaultThemes(): Promise<boolean> {
        return spPost(Office365Tenant(this, "GetHideDefaultThemes"));
    }

    /**
     *Updates a setting specifying whether default SharePoint themes should be hidden from the web UI
     *
     *@param hideDefaultThemes
     *@returns True, if the setting is updated successfully
     */
    public setHideDefaultThemes(hideDefaultThemes: boolean): Promise<boolean> {
        return spPost(Office365Tenant(this, "SetHideDefaultThemes"), body({
            hideDefaultThemes,
        }));
    }

    /**
     *Adds an SDN provider to the tenant
     *
     *@param identifier id of an SDN provider to be added
     *@param license license number provided by SDN provider
     */
    public addSdnProvider(identifier: string, license: string): Promise<void> {
        return spPost(Office365Tenant(this, "AddSdnProvider"), body({
            identifier,
            license,
        }));
    }

    /**
     *Removes an entry from the list of supported SDN providers
     */
    public removeSdnProvider(): Promise<void> {
        return spPost(Office365Tenant(this, "RemoveSdnProvider"));
    }

    /**
     *Returns a collection of User objects corresponding to external users in the tenancy
     *
     *@param position Zero-based index of the position in the sorted collection of the first result to be returned
     *@param pageSize The maximum number of ExternalUsers to be returned in the collection.  Must be less than or equal to 50
     *@param filter Limits the results to only those ExternalUers whose display name or invitedAs email address begins with the text in the string, using case-insensitive
     *@param sortOrder Specifies whether a call to GetExternalUsers should sort results in Ascending or Descending order on the ExternalUser.invitedAs property
     *@returns A GetExternalUsersResults object containing up to pageSize users that match the filter criteria, in the order specified, starting from the specified position.
     *Further pages can be fetched by calling again with the same filter and sortOrder parameters but specifying for position the
     *GetExternalUsersResults.UserCollectionPosition value returned from the previous call.  If GetExternalUsersResults.ExternalUserCollection.Count is less than pageSize,
     *all available users have been returned (it is the last page of results.)
     */
    public getExternalUsers(position = 0, pageSize = 50, filter: string = null, sortOrder = SortOrder.Ascending): Promise<IGetExternalUsersResults> {
        return spPost(Office365Tenant(this, "GetExternalUsers").select(<any>"ExternalUserCollection").expand("ExternalUserCollection"), body({
            position,
            pageSize,
            filter,
            sortOrder,
        }));
    }

    /**
     *Returns a collection of User objects corresponding to external users in the tenancy
     *
     *@param position Zero-based index of the position in the sorted collection of the first result to be returned
     *@param pageSize The maximum number of ExternalUsers to be returned in the collection.  Must be less than or equal to 50
     *@param filter Limits the results to only those ExternalUers whose display name or invitedAs email address begins with the text in the string, case-insensitive
     *@param sortPropertyName Name of the property to sort by. Support ExternalUser.acceptedAs and ExternalUser.whenCreated property
     *@param sortOrder Specifies whether a call to GetExternalUsers should sort results in Ascending or Descending order on the ExternalUser.invitedAs property
     *@returns A GetExternalUsersResults object containing up to pageSize users that match the filter criteria, in the order specified, starting from the specified position.
     *Further pages can be fetched by calling again with the same filter and sortOrder parameters but specifying for position the
     *GetExternalUsersResults.UserCollectionPosition value returned from the previous call.  If GetExternalUsersResults.ExternalUserCollection.Count is less than pageSize,
     *all available users have been returned (it is the last page of results.)
     */
    // eslint-disable-next-line max-len
    public getExternalUsersWithSortBy(position = 0, pageSize = 50, filter: string = null, sortPropertyName = "OtherMail", sortOrder = SortOrder.Ascending): Promise<IGetExternalUsersResults> {
        return spPost(Office365Tenant(this, "GetExternalUsersWithSortBy").select(<any>"ExternalUserCollection").expand("ExternalUserCollection"), body({
            position,
            pageSize,
            filter,
            sortPropertyName,
            sortOrder,
        }));
    }

    /**
     *Returns a collection of User objects corresponding to external users who have accessed this site collection
     *
     *@param siteUrl The site url whose external users are required
     *@param position Zero-based index of the position in the sorted collection of the first result to be returned
     *@param pageSize The maximum number of ExternalUsers to be returned in the collection.  Must be less than or equal to 50
     *@param filter Limits the results to only those ExternalUers whose display name or invitedAs email address begins with the text in the string, case-insensitive
     *@param sortOrder Specifies whether a call to GetExternalUsers should sort results in Ascending or Descending order on the ExternalUser.invitedAs property
     *@returns A GetExternalUsersResults object containing up to pageSize users that match the filter criteria, in the order specified, starting from the specified position.
     * Further pages can be fetched by calling again with the same filter and sortOrder parameters but specifying for position the GetExternalUsersResults.UserCollectionPosition
     * value returned from the previous call.  If GetExternalUsersResults.ExternalUserCollection.Count is less than pageSize,
     * all available users have been returned (it is the last page of results.)
     */
    public getExternalUsersForSite(siteUrl: string, position = 0, pageSize = 50, filter: string = null, sortOrder = SortOrder.Ascending): Promise<IGetExternalUsersResults> {
        return spPost(Office365Tenant(this, "GetExternalUsersForSite").select(<any>"ExternalUserCollection").expand("ExternalUserCollection"), body({
            siteUrl,
            position,
            pageSize,
            filter,
            sortOrder,
        }));
    }

    /**
     *Removes from the directory external users whose full ExternalUser.UniqueId property belongs in (case insensitive) the array of strings.
     *This method is unaffected by the value of the SharingCapability property
     *
     *@param uniqueIds An array of strings, where each string is the UniqueId of an external user to delete
     *@returns A RemoveExternalUsersResults object with the RemoveSucceeded and RemoveFailed arrays populated based on the results of attempting to remove the specified users.
     */
    public removeExternalUsers(uniqueIds: string[]): Promise<IRemoveExternalUsersResults> {
        return spPost(Office365Tenant(this, "RemoveExternalUsers"), body({
            uniqueIds,
        }));
    }

    /**
     * Queues an import of custom properties into user profiles from an external data source. This is a mostly asynchronous call in that it doesn't download
     * the source data or do the import, it simply adds it to a queue to do later
     *
     *@description The overall process for this import is as follows:
     *1) Create users in the User Profile Service. The custom property import process does not import users, only properties.
     *2) Create the custom properties in the User Profile Service. The custom property import process does not create the properties, just imports the values.
     *3) Create an external data source, the uri of which is passed to this method as the sourceUri parameter. The Uri must point to a resource that is accessible
     *   from within the SharePoint Online data center. It must have a record for each user with properties to import. Users are identified in the source data using
     *   the property passed to sourceDataIdProperty.
     *4) Call this method. This mehod queues the import. The data pointed to by sourceUri will be downloaded to the server and later imported into the User
     *   Profile Service. Data will be downloaded roughly once an hour and then queued for actual import.
     *
     *@param idType The type of id to use when looking up the user profile. See docs for ImportProfilePropertiesUserIdType for details.
     * Note that regardless of the type the user must already exist in the User Profile Service for import to work.
     *@param sourceDataIdProperty The name of the id property in the source data. The value of the property from the source data will be used to look up the user.
     * The User Profile Service property used for the lookup depends on the value of idType.</param>
     *@param propertyMap A map from source property name to User Profile Service property name. Note that the User Profile Service properties must already exist.
     *@param sourceUri The URI of the source data to import. This must not be transient as it may not be downloaded for some time.
     *@returns Guid identifying the import job that has been queued
     */
    // eslint-disable-next-line max-len
    public queueImportProfileProperties(idType: ImportProfilePropertiesUserIdTypes, sourceDataIdProperty: string, propertyMap: Record<string, string>, sourceUri: string): Promise<string> {
        return spPost(Office365Tenant(this, "QueueImportProfileProperties"), body({
            idType,
            sourceDataIdProperty,
            propertyMap,
            sourceUri,
        }));
    }

    /**
     *Deletes a previously queued job to import of custom properties into user profiles. Only certain jobs can be deleted:
     *- Only jobs that haven't been started yet (have been queued but not imported) can be deleted.
     *- Only top-level jobs can be cancelled. The job id returned by QueueImportProfileProperties will be a top-l
     *
     *@param jobId The job id returned by QueueImportProfileProperties to delete
     *@returns True if the job is deleted, false otherwise
     */
    public deleteImportProfilePropertiesJob(jobId: string): Promise<boolean> {
        return spPost(Office365Tenant(this, "DeleteImportProfilePropertiesJob"), body({
            jobId,
        }));
    }

    /**
     *Gets high-level status for all the import profile properties jobs for the current tenant
     *
     *@returns A collection of ImportProfilePropertiesJobStatus objects with high-level status information for the jobs
     */
    public getImportProfilePropertyJobs(): Promise<IImportProfilePropertiesJobInfo[]> {
        return spPost(Office365Tenant(this, "GetImportProfilePropertyJobs"));
    }

    /**
     *Gets high-level status for the import profile properties job specified by jobId. This jobId would have been returned by the original call to QueueImportProfileProperties
     *
     *@param jobId The id of the job for which to get high-level status
     *@returns An ImportProfilePropertiesJobStatus obect with high level status information about the specified job
     */
    public getImportProfilePropertyJob(jobId: string): Promise<IImportProfilePropertiesJobInfo> {
        return spPost(Office365Tenant(this, "GetImportProfilePropertyJob"), body({
            jobId,
        }));
    }

    /**
     *Disables non-owners of a site to share content to users that are not members of the site collection
     *
     *@param siteUrl The siteUrl of the site collection
     */
    public disableSharingForNonOwnersOfSite(siteUrl: string): Promise<void> {
        return spPost(Office365Tenant(this, "DisableSharingForNonOwnersOfSite"), body({
            siteUrl,
        }));
    }

    /**
     * Gets whether non-owners of a site can share content to users that are not members of the site collection
     *
     *@param siteUrl The siteUrl of the site collection to check if restrict sharing is enabled
     *@returns A Boolean indicating if sharing is disabled for site members in the site collection
     */
    public isSharingDisabledForNonOwnersOfSite(siteUrl: string): Promise<boolean> {
        return spPost(Office365Tenant(this, "IsSharingDisabledForNonOwnersOfSite"), body({
            siteUrl,
        }));
    }

    /**
     * Revokes all user sessions for a given username
     *
     *@param userName The home tenant user name, which is being used at authentication time (user@contoso.com)
     *@returns An value which represents the state of the operation
     */
    public revokeAllUserSessions(userName: string): Promise<ISPOUserSessionRevocationResult> {
        return spPost(Office365Tenant(this, "RevokeAllUserSessions"), body({
            userName,
        }));
    }

    /**
     * Revokes all user sessions for a given user's puid
     *
     *@param puidList A list of puids to be revoked (ex: 10037ffe8000008d)
     *@returns An SPOUserSessionRevocationResult enum value which represents the state of the operation
     */
    public revokeAllUserSessionsByPuid(puidList: string[]): Promise<ISPOUserSessionRevocationResult[]> {
        return spPost(Office365Tenant(this, "RevokeAllUserSessionsByPuid"), body({
            puidList,
        }));
    }

    /**
     * Supports calling POST methods not added explicitly to this class
     *
     * @param method method name, used in url path (ex: "AddTenantCdnOrigin")
     * @param args optional, any arguments to include in the body
     * @returns The result of the method invocation T
     */
    public call<T = any>(method: string, args?: any): Promise<T> {
        const query = Office365Tenant(this, method);
        if (typeof args !== "undefined") {
            return spPost(query, body(args));
        } else {
            return spPost(query);
        }
    }
}
export interface IOffice365Tenant extends _Office365Tenant { }
export const Office365Tenant = spInvokableFactory<IOffice365Tenant>(_Office365Tenant);





