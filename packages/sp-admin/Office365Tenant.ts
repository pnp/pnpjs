import { body } from "@pnp/queryable";
import { _SPInstance, defaultPath, spPost, IResourcePath } from "@pnp/sp";
import { boolean } from "yargs";
import { IOffice365TenantInfo, SPOrgAssetType, SPOTenantCdnType } from "./types.js";

@defaultPath("_api/Microsoft.Online.SharePoint.TenantManagement.Office365Tenant")
export class _Office365Tenant extends _SPInstance<IOffice365TenantInfo> {

    // TODO::test
    /**
     * Sets the configuration values for Idle session sign out for unmanaged devices
     * 
     * @param enabled Boolean indicating if the policy should be enabled
     * @param warnAfter TimeSpan containing the time before warning the user
     * @param signOutAfter TimeSpan containing the time before signing out the user
     * @returns True if the operation succeeds, false otherwise
     */
    public setIdleSessionSignOutForUnmanagedDevices(enabled: boolean, warnAfter: any, signOutAfter: any): Promise<boolean> {
        return spPost(Office365Tenant(this, "SetIdleSessionSignOutForUnmanagedDevices"), body({
            enabled,
            warnAfter,
            signOutAfter,
        }));
    }

    // TODO::test
    /**
     * Gets the configuration values, as a string, for Idle session sign out for unmanaged devices
     * The return string is a comma delineated list of the three policy settings.  The policy settings consist of
     * 1. Enabled: true or false
     * 2. Warn after: Time until user should be warned in seconds.
     * 3. Sign out after: Time until user should be signed out in seconds.
     * 
     * @returns A string indicating the current policy settings
     */
    public getIdleSessionSignOutForUnmanagedDevices(): Promise<string> {
        return spPost(Office365Tenant(this, "GetIdleSessionSignOutForUnmanagedDevices"));
    }

    // TODO::test
    /**
     * Adds a SharePoint document library to the list of Organization Assets libraries
     * 
     * @param cdnType 
     * @param libUrl Url of a SharePoint document library to be added to the list of Organization Assets libraries
     * @param thumbnailUrl 
     * @param orgAssetType 
     * @param defaultOriginAdded 
     */
    public addToOrgAssetsLibAndCdn(cdnType: SPOTenantCdnType, libUrl: IResourcePath, thumbnailUrl: IResourcePath, orgAssetType: SPOrgAssetType, defaultOriginAdded: boolean): Promise<void> {
        return spPost(Office365Tenant(this, "AddToOrgAssetsLibAndCdn"), body({
            cdnType,
            libUrl,
            thumbnailUrl,
            orgAssetType,
            defaultOriginAdded,
        }));
    }

    // TODO::test
    public removeFromOrgAssetsAndCdn(remove: boolean, cdnType: SPOTenantCdnType, libUrl: IResourcePath): Promise<void> {
        return spPost(Office365Tenant(this, "RemoveFromOrgAssetsAndCdn"), body({
            remove,
            cdnType,
            libUrl,
        }));
    }

    // TODO::test
    /**
     * Removes an entry from the list of Organization Assets libraries
     */
    public removeFromOrgAssets(libUrl: IResourcePath, listId: string): Promise<void> {
        return spPost(Office365Tenant(this, "RemoveFromOrgAssets"), body({
            libUrl,
            listId,
        }));
    }

    // TODO::test
    /**
     * Sets a SharePoint library thumbnail in Organization Assets libraries
     * 
     * @param libUrl Url of a SharePoint library to be set in Organization Assets
     * @param thumbnailUrl Url to an image used as the thumbnail for this library in the FilePicker
     * @param orgAssetType Type of Organization Assets Document Library
     * @returns 
     */
    public setOrgAssetsLib(libUrl: IResourcePath, thumbnailUrl: IResourcePath, orgAssetType: SPOrgAssetType): Promise<void> {
        return spPost(Office365Tenant(this, "SetOrgAssetsLib"), body({
            libUrl,
            thumbnailUrl,
            orgAssetType,
        }));
    }

    // TODO::test
    /**
     * Gets the minor version that should be used to generate the next iteration of the custom font catalog for the
     * font org asset library specified by libUrl
     * 
     * @param libUrl 
     * @returns 
     */
    public getCustomFontsMinorVersion(libUrl: IResourcePath): Promise<number> {
        return spPost(Office365Tenant(this, "GetCustomFontsMinorVersion"), body({
            libUrl,
        }));
    }

    // TODO::test
    /**
     * Uploads fonts and font catalogs to a font asset library
     */
    public uploadCustomFontsAndCatalogLib(customFontFiles: any, libUrl: IResourcePath): Promise<boolean> {
        return spPost(Office365Tenant(this, "UploadCustomFontsAndCatalogLib"), body({
            customFontFiles,
            libUrl,
        }));
    }

    // TODO::test
    /**
     * Removes old Custom Fonts files
     */
    public removePreviousCustomFontUpload(majVersions: string[], libUrl: IResourcePath): Promise<void> {
        return spPost(Office365Tenant(this, "RemovePreviousCustomFontUpload"), body({
            majVersions,
            libUrl,
        }));
    }

    // TODO::test
    /**
     * Increments the minor version for libUrl
     */
    public incrementCustomFontsMinorVersion(libUrl: IResourcePath): Promise<void> {
        return spPost(Office365Tenant(this, "IncrementCustomFontsMinorVersion"), body({
            libUrl,
        }));
    }

    // TODO::test
    /**
     * Gets a list of tenant CDN origins
     * 
     * @param cdnType Type of CDN: private or public
     */
    public getTenantCdnOrigins(cdnType: SPOTenantCdnType): Promise<string[]> {
        return spPost(Office365Tenant(this, "GetTenantCdnOrigins"), body({
            cdnType,
        }));
    }

    /// <summary>
    /// Adds a tenant cdn origin.
    /// </summary>
    /// <param name="cdnType">Type of CDN: private or public</param>
    /// <param name="originUrl">origin Url to add</param>

    public void AddTenantCdnOrigin(SPOTenantCdnType cdnType, string originUrl) {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Create);
        this.DataAccess.AddTenantCdnOrigin(cdnType, originUrl);
    }

    /// <summary>
    /// Removes a tenant cdn origin.
    /// </summary>
    /// <param name="cdnType">Type of CDN: private or public</param>
    /// <param name="originUrl">origin Url to add</param>

    public void RemoveTenantCdnOrigin(SPOTenantCdnType cdnType, string originUrl) {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Delete);
        this.DataAccess.RemoveTenantCdnOrigin(cdnType, originUrl);
    }

    /// <summary>
    /// Enables or disabled tenant CDN feature.
    /// </summary>
    /// <param name="cdnType">Type of CDN: private or public</param>
    /// <param name="isEnabled">value to set</param>

    public void SetTenantCdnEnabled(SPOTenantCdnType cdnType, bool isEnabled) {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Update);
        this.DataAccess.SetTenantCdnEnabled(cdnType, isEnabled);
    }

    /// <summary>
    /// Gets whether tenant CDN feature is enabled.
    /// </summary>
    /// <param name="cdnType">Type of CDN: private or public</param>
    /// <returns>True if CDN is enabled; false otherwise</returns>

    public bool GetTenantCdnEnabled(SPOTenantCdnType cdnType) {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Read);
        return this.DataAccess.GetTenantCdnEnabled(cdnType);
    }

    /// <summary>
    /// Sets policy for the tenant CDN.
    /// </summary>
    /// <param name="cdnType">CDN type</param>
    /// <param name="policy">Policy type</param>
    /// <param name="policyValue">Policy value</param>

    public void SetTenantCdnPolicy(SPOTenantCdnType cdnType, SPOTenantCdnPolicyType policy, string policyValue) {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Update);
        this.DataAccess.SetTenantCdnPolicy(cdnType, policy, policyValue);
    }

    /// <summary>
    /// Gets list of policies for the tenant CDN.
    /// </summary>
    /// <param name="cdnType">CDN type</param>
    /// <returns>List of policies</returns>

    public IList<string> GetTenantCdnPolicies(SPOTenantCdnType cdnType) {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Read);
        return this.DataAccess.GetTenantCdnPolicies(cdnType);
    }

    /// <summary>
    /// Creates default origins for requested CDN type.
    /// </summary>
    /// <returns></returns>

    public void CreateTenantCdnDefaultOrigins(SPOTenantCdnType cdnType) {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Create);
        this.DataAccess.CreateTenantCdnDefaultOrigins(cdnType);
    }

    #endregion

    #region Theming

    /// <summary>
    /// Add a custom theme to the tenant so that it will be available when selecting a site theme.
    /// </summary>
    /// <param name="name">The name of the theme.</param>
    /// <param name="themeJson">A JSON representation of the theme information.</param>
    /// <returns>True, if the theme is added successfully.</returns>

    public bool AddTenantTheme(string name, string themeJson) {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Create);
        return this.DataAccess.AddTenantTheme(name, themeJson);
    }

    /// <summary>
    /// Update the properties of a custom theme.
    /// </summary>
    /// <param name="name">The name of the theme to update.</param>
    /// <param name="themeJson">A JSON representation of the new theme information.</param>
    /// <returns>True, if the theme is updated successfully.</returns>

    public bool UpdateTenantTheme(string name, string themeJson) {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Update);
        return this.DataAccess.UpdateTenantTheme(name, themeJson);
    }

    /// <summary>
    /// Remove a custom theme from the tenant.
    /// </summary>
    /// <param name="name">The name of the theme to delete.</param>

    public void DeleteTenantTheme(string name) {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Delete);
        this.DataAccess.DeleteTenantTheme(name);
    }

    /// <summary>
    /// Retrieves a custom theme previously added to the tenant.
    /// </summary>
    /// <param name="name">The name of the theme to retrieve.</param>
    /// <returns>A ThemeProperties object representing the theme.</returns>

    public ThemeProperties GetTenantTheme(string name) {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Read);
        return this.DataAccess.GetTenantTheme(name);
    }

    /// <summary>
    /// Retrieves all custom themes added to the tenant.
    /// </summary>
    /// <returns>ThemeProperties objects representing all of the custom themes added to the tenant.</returns>

    public IList<ThemeProperties> GetAllTenantThemes() {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Read);
        return this.DataAccess.GetAllTenantThemes();
    }

    /// <summary>
    /// Retrieves a setting specifying whether default SharePoint themes should be hidden from the web UI.
    /// </summary>
    /// <returns>True, if default SharePoint themes should be hidden from the web UI</returns>

    public bool GetHideDefaultThemes() {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Read);
        return this.DataAccess.GetHideDefaultThemes();
    }

    /// <summary>
    /// Updates a setting specifying whether default SharePoint themes should be hidden from the web UI.
    /// </summary>
    /// <returns>True, if the setting is updated successfully.</returns>

    public bool SetHideDefaultThemes(bool hideDefaultThemes) {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Update);
        return this.DataAccess.SetHideDefaultThemes(hideDefaultThemes);
    }

    /// <summary>
    /// Adds an SDN provider to the tenant.
    /// </summary>
    /// <param name="identifier">id of an SDN provider to be added</param>
    /// <param name="license">license number provided by SDN provider</param>

    public void AddSdnProvider(string identifier, string license) {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Create);
        this.DataAccess.AddSdnProvider(identifier, license);
    }

    /// <summary>
    /// Removes an entry from the list of supported SDN providers.
    /// </summary>

    public void RemoveSdnProvider() {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Delete);
        this.DataAccess.RemoveSdnProvider();
    }
    #endregion
    /// <summary>
    /// Returns a collection of User objects corresponding to external users in the tenancy.
    /// </summary>
    /// <param name="position">Zero-based index of the position in the sorted collection of the first result to be returned.</param>
    /// <param name="pageSize">The maximum number of ExternalUsers to be returned in the collection.  Must be less than or equal to 50.</param>
    /// <param name="filter">Limits the results to only those ExternalUers whose display name or invitedAs email address
    /// begins with the text in the string, using a case-insensitive comparison.</param>
    /// <param name="sortOrder">Specifies whether a call to GetExternalUsers should sort results in Ascending or
    /// Descending order on the ExternalUser.invitedAs property</param>
    /// <returns>
    /// A GetExternalUsersResults object containing up to pageSize users that match the filter criteria, in the order
    /// specified, starting from the specified position.  Further pages can be fetched by calling again with
    /// the same filter and sortOrder parameters but specifying for position the
    /// GetExternalUsersResults.UserCollectionPosition value returned from the previous call.  If
    /// GetExternalUsersResults.ExternalUserCollection.Count is less than pageSize, all available users have been returned
    /// (it is the last page of results.)
    /// </returns>
    /// <remarks>This method is unaffected by the value of the SharingCapability property.</remarks>
    /// <id guid="EC4771AB-489F-4164-89A7-52E9DBA3DF0B" />

    public GetExternalUsersResults GetExternalUsers(int position, int pageSize, string filter = null, SortOrder sortOrder = SortOrder.Ascending) {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantIdentities, Permissions.Read);
        return GetExternalUsersInternal(null /*no site url*/, position, pageSize, filter, sortOrder, null /*no sort by*/);
    }

    /// <summary>
    /// Returns a collection of external users with sort property name.
    /// </summary>
    /// <param name="position">Zero-based index of the position in the sorted collection of the first result to be returned.</param>
    /// <param name="pageSize">The maximum number of ExternalUsers to be returned in the collection.  Must be less than or equal to 500.</param>
    /// <param name="filter">Limits the results to only those ExternalUers whose display name or AcceptedAs email address
    /// begins with the text in the string, using a case-insensitive comparison.</param>
    /// <param name="sortPropertyName">Name of the property to sort by. Support ExternalUser.acceptedAs and ExternalUser.whenCreated property.</param>
    /// <param name="sortOrder">Specifies whether a call to GetExternalUsers should sort results in Ascending or Descending order.</param>
    /// <returns>Return a collection of ExternalUsers.</returns>

    public GetExternalUsersResults GetExternalUsersWithSortBy(int position, int pageSize, string filter = null, string sortPropertyName = MsoAdAttributeNames.OtherMail, SortOrder sortOrder = SortOrder.Ascending) {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantIdentities, Permissions.Read);
        return GetExternalUsersInternal(null /*no site url*/, position, pageSize, filter, sortOrder, sortPropertyName);
    }

    /// <summary>
    /// Returns a collection of User objects corresponding to external users who have accessed this site collection.
    /// </summary>
    /// <param name="siteUrl">The site url whose external users are required.</param>
    /// <param name="position">Zero-based index of the position in the sorted collection of the first result to be returned.</param>
    /// <param name="pageSize">The maximum number of ExternalUsers to be returned in the collection.  Must be less than or equal to 50.</param>
    /// <param name="filter">Limits the results to only those ExternalUers whose display name or invitedAs email address
    /// begins with the text in the string, using a case-insensitive comparison.</param>
    /// <param name="sortOrder">Specifies whether a call to GetExternalUsers should sort results in Ascending or
    /// Descending order on the ExternalUser.invitedAs property</param>
    /// <returns>
    /// A GetExternalUsersResults object containing up to pageSize users that match the filter criteria, in the order
    /// specified, starting from the specified position.  Further pages can be fetched by calling again with
    /// the same filter and sortOrder parameters but specifying for position the
    /// GetExternalUsersResults.UserCollectionPosition value returned from the previous call.  If
    /// GetExternalUsersResults.ExternalUserCollection.Count is less than pageSize, all available users have been returned
    /// (it is the last page of results.)
    /// </returns>
    /// <remarks>This method is unaffected by the value of the SharingCapability property.</remarks>
    /// <id guid="("F0FD624B-BF88-4BA5-A636-19F573112327")" />
    [SuppressMessage("Microsoft.Design", "CA1026:DefaultParametersShouldNotBeUsed")]

    public GetExternalUsersResults GetExternalUsersForSite(string siteUrl, int position, int pageSize, string filter = null, SortOrder sortOrder = SortOrder.Ascending) {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantIdentities, Permissions.Read);
        if (string.IsNullOrEmpty(siteUrl)) {
            throw new ArgumentException("siteUrl");
        }
        return GetExternalUsersInternal(siteUrl, position, pageSize, filter, sortOrder);
    }


    /// <summary>
    /// Removes from the directory external users whose full ExternalUser.UniqueId property belongs in (case insensitive) the
    /// array of strings.  This method is unaffected by the value of the SharingCapability property.
    /// </summary>
    /// <param name="emailNames">An array of strings, where each string is the UniqueId of an external user to delete</param>
    /// <returns>A RemoveExternalUsersResults object with the RemoveSucceeded and RemoveFailed arrays populated
    /// based on the results of attempting to remove the specified users.</returns>
    /// <id guid="0E26ABE4-F8AF-4314-A6DB-24A009575BB6" />

    public RemoveExternalUsersResults RemoveExternalUsers(string[] uniqueIds) {
        this.rbacManager.AssertAccess(TenantAdminResources.TenantIdentities, Permissions.Delete);
        SpoCommonHelper.ValidateNotNull(Office365Tenant.UniqueIdsParameterName, uniqueIds);
        return this.DataAccess.RemoveExternalUsers(uniqueIds);
    }

    /// <summary>
    /// Queues an import of custom properties into user profiles from an external data source. This is a mostly asynchronous call in that it doesn't download the source data or do the import, it simply
    /// adds it to a queue to do later.
    ///
    /// The overall process for this import is as follows:
    /// 1) Create users in the User Profile Service. The custom property import process does not import users, only properties.
    /// 2) Create the custom properties in the User Profile Service. The custom property import process does not create the properties, just imports the values.
    /// 3) Create an external data source, the uri of which is passed to this method as the sourceUri parameter. The Uri must point to a resource that is accessible from within the SharePoint Online data center. It must have a record for each user with properties to import. Users are identified in the source data using the property passed to sourceDataIdProperty.
    /// 4) Call this method. This mehod queues the import. The data pointed to by sourceUri will be downloaded to the server and later imported into the User Profile Service. Data will be downloaded roughly once an hour and then queued for actual import.
    ///
    /// </summary>
    /// <param name="idType">The type of id to use when looking up the user profile. See docs for ImportProfilePropertiesUserIdType for details. Note that regardless of the type the user must already exist in the User Profile Service for import to work.</param>
    /// <param name="sourceDataIdProperty">The name of the id property in the source data. The value of the property from the source data will be used to look up the user. The User Profile Service property used for the lookup depends on the value of idType.</param>
    /// <param name="propertyMap">A map from source property name to User Profile Service property name. Note that the User Profile Service properties must already exist.</param>
    /// <param name="sourceUri">The URI of the source data to import. This must not be transient as it may not be downloaded for some time.</param>
    /// <returns>Guid identifying the import job that has been queued.</returns>
    [ClientCallable]
    public Guid QueueImportProfileProperties(ImportProfilePropertiesUserIdType idType, string sourceDataIdProperty, IDictionary<string, string> propertyMap, Uri sourceUri)
{
    this.rbacManager.AssertAccess(TenantAdminResources.TenantIdentities, Permissions.Update);
    return UPImport.ImportProfilePropertiesImpl.QueueImportProfileProperties(SPContext.Current, idType.ToDirectoryObjectIdentityAttributeTemp(), sourceDataIdProperty, propertyMap, sourceUri);
}

/// <summary>
/// Deletes a previously queued job to import of custom properties into user profiles. Only certain jobs can be deleted:
///  -Only jobs that haven't been started yet (have been queued but not imported) can be deleted.
///  -Only top-level jobs can be cancelled. The job id returned by QueueImportProfileProperties will be a top-level job.
/// </summary>
/// <param name="jobId">The job id returned by QueueImportProfileProperties to delete.</param>
/// <returns>True if the job is deleted, false otherwise.</returns>
/// <exception cref="System.ArgumentException">Thrown when a job is not found or is invalid in some other way.</exception>
[ClientCallable]
        public bool DeleteImportProfilePropertiesJob(Guid jobId)
{
    this.rbacManager.AssertAccess(TenantAdminResources.TenantIdentities, Permissions.Delete);
    return UPImport.ImportProfilePropertiesImpl.DeleteImportProfilePropertiesJob(SPContext.Current, jobId);
}

/// <summary>
/// Gets high-level status for all the import profile properties jobs for the current tenant.
/// </summary>
/// <returns>A collection of ImportProfilePropertiesJobStatus objects with high-level status information for the jobs.</returns>
[ClientCallable]
        public ImportProfilePropertiesJobStatusCollection GetImportProfilePropertyJobs()
{
    this.rbacManager.AssertAccess(TenantAdminResources.TenantIdentities, Permissions.Read);
    return new ImportProfilePropertiesJobStatusCollection(UPImport.ImportProfilePropertiesImpl.GetWorkItems(SPContext.Current, wi => new ImportProfilePropertiesJobInfo(wi)));
}

/// <summary>
/// Gets high-level status for the import profile properties job specified by jobId. This jobId would have been returned by the original call to QueueImportProfileProperties.
/// </summary>
/// <param name="jobId">The id of the job for which to get high-level status.</param>
/// <returns>An ImportProfilePropertiesJobStatus obect with high level status information about the specified job.</returns>
[ClientCallable]
        public ImportProfilePropertiesJobInfo GetImportProfilePropertyJob(Guid jobId)
{
    this.rbacManager.AssertAccess(TenantAdminResources.TenantIdentities, Permissions.Read);
    return new ImportProfilePropertiesJobInfo(UPImport.ImportProfilePropertiesImpl.GetWorkItem(SPContext.Current, jobId));
}

/// <summary>
/// Disables non-owners of a site to share content to users that are not members of the site collection.
/// </summary>
/// <param name="siteUrl">The siteUrl of the site collection.</param>
[ClientCallable]
        public void DisableSharingForNonOwnersOfSite(string siteUrl)
{
    this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Update);
    this.DataAccess.DisableSharingForNonOwnersOfSite(siteUrl);
}

/// <summary>
/// Gets whether non-owners of a site can share content to users that are not members of the site collection.
/// </summary>
/// <param name="siteUrl">The siteUrl of the site collection to check if restrict sharing is enabled.</param>
/// <returns>A Boolean indicating if sharing is disabled for site members in the site collection.</returns>
[ClientCallable]
        public bool IsSharingDisabledForNonOwnersOfSite(string siteUrl)
{
    this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Read);
    return this.DataAccess.IsSharingDisabledForNonOwnersOfSite(siteUrl);
}

/// <summary>
/// Revokes all user sessions for a given username.
/// </summary>
/// <param name="userName">
/// The home tenant user name, which is being used at authentication time.
/// <example>user@contoso.com</example>
/// </param>
/// <returns>An SPOUserSessionRevocationResult enum value which represents the state of the operation.</returns>
[ClientCallable]
        public SPOUserSessionRevocationResult RevokeAllUserSessions(string userName)
{
    this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Update);
    SpoCommonHelper.ValidateString("userName", userName);
    return this.DataAccess.RevokeAllUserSessions(userName);
}

/// <summary>
/// Revokes all user sessions for a given user's puid.
/// </summary>
/// <param name="puidList">
/// A list of puids to be revoked.
/// Each value should look like this:
/// <example>10037ffe8000008d</example>
/// </param>
/// <returns>An SPOUserSessionRevocationResult enum value which represents the state of the operation.</returns>
[ClientCallable]
        public IList < SPOUserSessionRevocationResult > RevokeAllUserSessionsByPuid(IList < string > puidList)
{
    this.rbacManager.AssertAccess(TenantAdminResources.TenantSettings, Permissions.Update);
    return this.DataAccess.RevokeAllUserSessionsByPuid(puidList);
}

        /// <summary>
        /// Create a new Office 365 Group and connect it to an existing site.  After this succeeds for a given site, calling it again with the same site will throw an Exception.
        /// </summary>
        /// <param name="siteUrl">The full URL of the site to connect to.</param>
        /// <param name="displayName">The desired display name of the new group</param>
        /// <param name="alias">The desired email alias for the new group</param>
        /// <param name="isPublic">Whether the new group should be public or private</param>
        /// <param name="optionalParams">An optional set of creation parameters for the group</param>
        
        public void CreateGroupForSite(string siteUrl, string displayName, string alias, bool isPublic, GroupCreationParams optionalParams)
{
    this.rbacManager.AssertAccess(TenantAdminResources.UnifiedGroups, Permissions.Create);
    this.DataAccess.CreateGroupForSite(siteUrl, displayName, alias, isPublic, optionalParams);
}
}
export interface IOffice365Tenant extends _Office365Tenant { }
export const Office365Tenant = spInvokableFactory<IOffice365Tenant>(_Office365Tenant);





