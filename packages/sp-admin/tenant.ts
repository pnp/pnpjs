// import { body } from "@pnp/queryable";
import { body } from "@pnp/queryable";
import { _SPInstance, defaultPath, spInvokableFactory, spPost } from "@pnp/sp";
import { ITenantInfo } from "./types.js";

@defaultPath("_api/Microsoft.Online.SharePoint.TenantAdministration.Tenant")
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
    public getSitePropertiesByUrl(url: string, includeDetail = false): Promise<any> {
        return spPost(Tenant(this, "GetSitePropertiesByUrl"), body({
            url,
            includeDetail,
        }));
    }

    /**
*    #region Client Callable Methods



   /// <summary>
   /// Gets SPOSiteProperties objects for all sites from SharePoint in the tenancy that match the filter expression.
   /// If the filter is null or empty string, then all the sites are returned.
   /// </summary>
   /// <returns>IEnumerable&lt;SPOSiteProperties&gt;</returns>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.All)]
   public SitePropertiesEnumerable GetSitePropertiesFromSharePointByFilters(SitePropertiesEnumerableFilter speFilter)
   {
  
   }





   /// <summary>
   /// Get whether this tenant has valid education license.
   /// </summary>
   /// <returns>bool;</returns>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.RESTful, OperationType = OperationType.Read)]
   public bool HasValidEducationLicense()
   {
  
   }




   /// <summary>
   /// Queues a site collection for creation with the given properties
   /// </summary>
   /// <param name="SiteCreationProperties"> The initial properties for the site which is to be created. </param>
   /// <returns>Queues a site collection for creation with the given properties</returns>
   /// <id guid="3c1e5508-b720-4346-b9cb-d374736e613d" />
   [ClientCallableMethod(ResourceUsageHints = ResourceUsageHints.LongOperation)]
   public SpoOperation CreateSite(SiteCreationProperties siteCreationProperties)
   {
  
   }

   /// <summary>
   /// Gets all the SPWebTemplates on this Tenant.
   /// </summary>
   /// <returns>An SPOWebTemplateCollection containing a SPOWebTemplate information for each template</returns>
   [ClientCallableMethod(OperationType = OperationType.Read, ClientLibraryTargets = ClientLibraryTargets.All)]
   public SPOWebTemplateCollection GetSPOTenantAllWebTemplates()
   {
  
   }

   /// <summary>
   /// Parameters required to be passed based on the <cref>UpdateGroupSitePropertiesType</cref>
   /// </summary>
   [ClientCallableType(Name = "UpdateGroupSitePropertiesParameters",
  ServerTypeId = "{6d8cb9b8-0c8a-11ec-82a8-0242ac130003}",
  ValueObject = true)]
   public class UpdateGroupSitePropertiesParameters
   {
  [ClientCallableProperty(Name = "storageMaximumLevel")]
  public Int64 StorageMaximumLevel { get; set; }

  [ClientCallableProperty(Name = "storageWarningLevel")]
  public Int64 StorageWarningLevel { get; set; }

  public override string ToString()
  {
 return JsonConvert.SerializeObject(this);
  }
   }

   /// <summary>
   /// Handles updating the properties based on updateType <cref>UpdateGroupSitePropertiesType</cref> of all the sites which are part of the groupId
   /// </summary>
   /// <example>
   ///POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/UpdateGroupSiteProperties
   ///RequestBody: {"groupId":"<Guid>","siteId":"<Guid>","updateType":"StorageQuota","parameters":{"storageMaximumLevel":<Int>,"storageWarningLevel":<Int>}}
   /// </example>
   /// <param name="groupId">Group Id</param>
   /// <param name="siteId">Site Id</param>
   /// <param name="updateType">Property which is required to be updated</param>
   /// <param name="parameters">Params which are required to be passed based on the updateType</param>
   /// <returns>string denoting the user storage key which can be used by client to pull the async workflow status</returns>
   [ClientCallableMethod(Name = "UpdateGroupSiteProperties",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful)]
   public string UpdateGroupSiteProperties(Guid groupId, Guid siteId, string updateType, UpdateGroupSitePropertiesParameters parameters)
   {
 
   }

   
   /// <summary>
   /// Gets all the site collection templates available in SPO for the given UI culture.
   /// </summary>
   /// <returns>An SPOWebTemplateCollection for all the site collection templates available in SPO for the given UI culture.</returns>
   [ClientCallableMethod(
  OperationType = OperationType.Read,
  ClientLibraryTargets = ClientLibraryTargets.All,
  AllowedReadRoles = new SecurityGroup[] { SecurityGroup.GlobalReader },
  RequiredRight = ResourceRight.GlobalReader)]
   public SPOWebTemplateCollection GetSPOAllWebTemplates(string cultureName, int compatibilityLevel)
   {
 
   }

   /// <summary>
   /// Gets all the SPWebTemplates for site collections on this Tenant
   /// </summary>
   /// <returns>An SPOWebTemplateCollection containing a SPOWebTemplate information for each template</returns>
   [ClientCallableMethod(OperationType = OperationType.Read, ClientLibraryTargets = ClientLibraryTargets.All)]
   public SPOWebTemplateCollection GetSPOTenantWebTemplates(uint localeId, int compatibilityLevel)
   {
 
   }

   /// <summary>
   /// Returns the site header logo by site URL.
   /// </summary>
   /// <param name="siteUrl"></param>
   /// <returns>Stream containing the site logo data</returns>
   [ClientCallableMethod(OperationType = OperationType.Read,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader,
  IsBeta = true)]
   public Stream GetSiteThumbnailLogo(string siteUrl)
   {
 
   }

   /// <summary>
   /// Gets all the SPSiteCreationSources.
   /// </summary>
   /// <returns>A list of SPOSiteCreationSource objects, each object is mapped to a SPSiteCreationSource enum</returns>
   [ClientCallableMethod(
  OperationType = OperationType.Read,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   public IList<SPOSiteCreationSource> GetSPOSiteCreationSources()
   {
 
   }

  

  

   /// <summary>
   /// Deletes the site to the recycle bin
   /// </summary>
   /// <param name="url">URL of the site to be deleted</param>
   [ClientCallableMethod(ResourceUsageHints = ResourceUsageHints.LongOperation)]
   public SpoOperation RemoveSite(string siteUrl)
   {
 
   }

   /// <summary>
   /// Gets the health Status of the site from WEX api
   /// https://constoso-admin.sharepoint.com/_api/SPOInternalUseOnly.Tenant/GetSiteHealthStatus?sourceUrl='https://contoso.sharepoint.com/sites/pwa'
   /// </summary>
   [ClientCallableMethodAttribute(Name = "GetSiteHealthStatus",
  OperationType = OperationType.Read,
  ClientLibraryTargets = ClientLibraryTargets.RESTful)]
   public PortalHealthStatus GetSiteHealthStatus([ClientCallableParameter(Name = "sourceUrl")] String sourceUrl)
   {
  
   }

   /// <summary>
   /// Performs the Swap operation on the provided sites
   /// </summary>
   [ClientCallableMethod(ResourceUsageHints = ResourceUsageHints.LongOperation)]
   public SpoOperation SwapSiteWithSmartGestureOptionForce(string sourceUrl, string targetUrl, string archiveUrl, bool includeSmartGestures, bool force)
   {
  
   }

   /// <summary>
   /// Performs the Swap operation on the provided sites
   /// </summary>
   [ClientCallableMethod(ResourceUsageHints = ResourceUsageHints.LongOperation)]
   public SpoOperation SwapSiteWithSmartGestureOption(string sourceUrl, string targetUrl, string archiveUrl, bool includeSmartGestures)
   {
  
   }

   /// <summary>
   /// Performs the Swap operation on the provided sites
   /// </summary>
   [ClientCallableMethod(ResourceUsageHints = ResourceUsageHints.LongOperation)]
   public SpoOperation SwapSite(string sourceUrl, string targetUrl, string archiveUrl)
   {
  
   }

   

   /// <summary>
   /// Permanently deletes the site from the recycle bin
   /// </summary>
   /// <param name="siteUrl">URL of the site to be deleted</param>
   /// <returns>operation for the request</returns>
   [ClientCallableMethod(ResourceUsageHints = ResourceUsageHints.LongOperation)]
   public SpoOperation RemoveDeletedSite(string siteUrl)
   {
  
   }

   /// <summary>
   /// Permanently deletes the site from the recycle bin
   /// </summary>
   /// <param name="siteUrl">URL of the site to be deleted</param>
   /// <param name="siteId">SiteID of the site to be deleted</param>
   /// <returns>operation for the request</returns>
   [ClientCallableMethod(ResourceUsageHints = ResourceUsageHints.LongOperation)]
   public SpoOperation RemoveDeletedSitePreferId(string siteUrl, Guid siteId)
   {
 
   }

   /// <summary>
   /// Restores site from deleted state (recycle bin)
   /// </summary>
   /// <param name="siteUrl">URL of the site to be restored</param>
   /// <returns>operation for the request</returns>
   [ClientCallableMethod]
   public SpoOperation RestoreDeletedSite(string siteUrl)
   {
  
   }

   /// <summary>
   /// Restores site from deleted state (recycle bin)
   /// </summary>
   /// <param name="siteId">SiteID of the site to be deleted</param>
   /// <returns>operation for the request</returns>
   [ClientCallableMethod]
   public SpoOperation RestoreDeletedSiteById(Guid siteId)
   {
 
   }

   /// <summary>
   /// Restores site from deleted state (recycle bin)
   /// </summary>
   /// <param name="siteUrl">URL of the site to be restored</param>
   /// <param name="siteId">SiteID of the site to be deleted</param>
   /// <returns>operation for the request</returns>
   [ClientCallableMethod]
   public SpoOperation RestoreDeletedSitePreferId(string siteUrl, Guid siteId)
   {
 
   }


   /// <summary>
   /// A collection of PowerApps environments
   /// </summary>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.RESTful, OperationType = OperationType.Read)]
   public ReadOnlyCollection<PowerAppsEnvironment> GetPowerAppsEnvironments()
   {
  
   }


   /// <summary>
   /// Sets the configuration values for the following policy:
   ///  * Idle session sign out for unmanaged devices.
   /// </summary>
   /// <param name="enabled">Boolean indicating if the policy should be enabled.</param>
   /// <param name="warnAfter">TimeSpan containing the time before warning the user</param>
   /// <param name="signOutAfter">TimeSpan containing the time before signing out the user.</param>
   /// <returns>True if the operation succeeds, false otherwise.</returns>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.All)]
   public bool SetIdleSessionSignOutForUnmanagedDevices(Boolean enabled, TimeSpan warnAfter, TimeSpan signOutAfter)
   {
  
   }

   /// <summary>
   /// Gets the configuration values, as a string, for the following policy:
   ///  * Idle session sign out for unmanaged devices.
   /// </summary>
   /// <remarks>
   /// The return string is a comma delineated list of the three policy settings.  The policy settings consist of:
   /// 1. Enabled: true or false
   /// 2. Warn after: Time until user should be warned in seconds.
   /// 3. Sign out after: Time until user should be signed out in seconds.
   /// </remarks>
   /// <returns>A string indicating the current policy settings.</returns>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.All,
  AllowedWriteRoles = new SecurityGroup[] { SecurityGroup.GlobalReader },
  RequiredRight = ResourceRight.GlobalReader)]
   public string GetIdleSessionSignOutForUnmanagedDevices()
   {
 
   }


   /// <summary>
   /// RESTful API to export SPList to CSV file and return file download link.
   /// </summary>
   /// <param name="viewXml">XML of the export view </param>
   /// <example>
   /// POST _api/SPO.Tenant/ExportToCSV
   /// </example>
   [ClientCallableMethodAttribute(Name = "ExportToCSV",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful)]
   public string ExportToCSV(string viewXml)
   {
 
   }

   /// <summary>
   /// RESTful API to export SPList to CSV file and return file download link.
   /// </summary>
   /// <param name="viewXml">XML of the export view </param>
   /// <param name="listName">Name of Admin SPList to be exported</param>
   /// <example>
   /// POST _api/SPO.Tenant/ExportAdminListToCSV
   /// </example>
   [ClientCallableMethodAttribute(Name = "ExportAdminListToCSV",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful)]
   public string ExportAdminListToCSV(string viewXml, string listName)
   {
 
   }

   /// <summary>
   /// RESTful API to set site's user groups
   /// </summary>
   /// <param name="SiteUserGroupsData.siteId">The guid of site.</param>
   /// <param name="SiteUserGroupsData.SiteUserGroups">The array of site's user groups that will replace the current user groups.</param>
   /// <example>
   /// POST https://prepspo-admin.spgrid.com/_api/SPO.Tenant/SetSiteUserGroups
   /// </example>
   [ClientCallableMethodAttribute(Name = "SetSiteUserGroups",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  IsBeta = true)]
   public void SetSiteUserGroups(
  [ClientCallableParameter(Name = "siteUserGroupsData")]
  SiteUserGroupsData siteUserGroupsData)
   {
  
   }

   /// <summary>
   /// RESTful API to set site administrators
   /// </summary>
   /// <param name="siteAdministratorsFieldsData.siteId">The guid of site.</param>
   /// <param name="siteAdministratorsFieldsData.siteAdministrators">The array of site's administrators that will replace current administrators.</param>
   /// <example>
   /// POST https://prepspo-admin.spgrid.com/_api/Microsoft.Online.SharePoint.TenantAdministration.Tenant/SetSiteAdministrators
   /// with payload:
   /// {
   ///"siteAdministratorsFieldsData":
   ///{
   ///    "siteId":"1ae2d477-3e17-4dba-9f30-f1cc8bc594b9",
   ///    "siteAdministrators":["User1@prepspo.msolctp-int.com","User2@prepspo.msolctp-int.com"]
   ///}
   /// }
   /// </example>
   [ClientCallableMethodAttribute(Name = "SetSiteAdministrators",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  IsBeta = true)]
   public void SetSiteAdministrators(
  [ClientCallableParameter(Name = "siteAdministratorsFieldsData")]
  SiteAdministratorsFieldsData siteAdministratorsFieldsData)
   {
  
   }

   /// <summary>
   /// RESTful API to check tenant licenses.
   /// Full list of licenses are defined in TenantConstants class in %SRCROOT%\sporel\sts\stsom\Administration\SPOnlineProvisioning\SPTenantOMConstants.cs
   /// </summary>
   /// <param name="licenses">The licenses to check on tenant.</param>
   /// <example>
   /// GET https://prepspo-admin.spgrid.com/_api/Microsoft.Online.SharePoint.TenantAdministration.Tenant/CheckTenantLicenses?licenses=["SPO_Standard","SPO_Project"]
   ///It returns true for onebox.
   /// </example>
   /// <returns>True if and only if tenant has all licenses in parameter</returns>
   [ClientCallableMethodAttribute(OperationType = OperationType.Read,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  IsBeta = true)]
   public bool CheckTenantLicenses(
  [ClientCallableParameter(Name = "licenses")]
  string[] licenses)
   {
  
   }

   /// <summary>
   /// RESTful API to check tenant intune license
   /// </summary>
   /// <example>
   /// GET https://contoso-admin.sharepoint.com/_api/Microsoft.Online.SharePoint.TenantAdministration.Tenant/CheckTenantIntuneLicense
   /// </example>
   /// <returns>True if and only if tenant has Intune license</returns>
   [ClientCallableMethodAttribute(Name = "CheckTenantIntuneLicense",
  OperationType = OperationType.Read,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  IsBeta = true,
  AllowedReadRoles = new SecurityGroup[] { SecurityGroup.GlobalReader },
  RequiredRight = ResourceRight.GlobalReader)]
   public bool CheckTenantIntuneLicense()
   {
 
   }

  

    /// <summary>
   /// RESTful API to get site's administrators' names and emails
   /// </summary>
   /// <param name="siteId">The guid of site.</param>
   /// <example>
   /// GET https://prepspo-admin.spgrid.com/_api/Microsoft.Online.SharePoint.TenantAdministration.Tenant/GetSiteAdministrators
   /// with query param ?siteId=1ae2d477-3e17-4dba-9f30-f1cc8bc594b9   
   /// </example>
   [ClientCallableMethodAttribute(Name = "GetSiteAdministrators",
  OperationType = OperationType.Read,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  IsBeta = true,
  RequiredRight = ResourceRight.GlobalReader)]
   public List<SiteAdministratorsInfo> GetSiteAdministrators(
  Guid siteId)
   {
 
   }

   /// <summary>
   /// RESTful API for getting Compatible Information Barrier Segments.
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/GetTenantAllOrCompatibleIBSegments
   /// Request Body : {"segments":["9049237F-BF11-4G6B-433A-7A44A9BDDE42"]}
   /// If the input guids are null, we return all the IB Segments associated to a tenant.
   /// </summary>
   [ClientCallableMethod(Name = "GetTenantAllOrCompatibleIBSegments",
  OperationType = OperationType.Read,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   public IBSegmentInfo[] GetTenantAllOrCompatibleIBSegments(Guid[] segments)
   {
  
   }

   /// <summary>
   /// RESTful API for getting SiteStream for  Information Barrier Segments.
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/RenderIBSegmentListDataAsStream
   /// Request Body : {"parameters":{"ViewXml":"<View></View>","DatesInUtc":true},segments:{"998D8D85-9D92-40BC-BBBC-4B85F13E0FB5"},overrideParameters:""}
   /// </summary>
   [ClientCallableMethod(Name = "RenderIBSegmentListDataAsStream",
   OperationType = OperationType.Read,
   ClientLibraryTargets = ClientLibraryTargets.RESTful,
   RequiredRight = ResourceRight.GlobalReader)]
   public Stream RenderIBSegmentListDataAsStream(
  SPRenderListDataParameters parameters, Guid[] segments,
  [ClientCallableParameter(RESTfulParameterSource = RESTfulParameterSource.Path)] SPRenderListDataOverrideParameters overrideParameters)
   {
  
   }

   /// <summary>
   /// RESTful API for getting Information Barrier Segments Filter Options.
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/RenderIBSegmentListFilterData
   /// Request Body : {"parameters":{"ViewXml":"<View></View>"}}
   /// </summary>
   [ClientCallableMethod(Name = "RenderIBSegmentListFilterData",
  OperationType = OperationType.Read,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   public Stream RenderIBSegmentListFilterData(
  SPRenderListFilterDataParameters parameters)
   {
  
   }

   

   /// <summary>
   /// Renders Tenant Admin SPList Data after filtering based on the groupId the site belongs to
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/RenderFilteredAdminListDataByGroupId
   /// <param name="groupId">Group Id the sites belong to</param>
   /// <returns>Filtered Tenant Admin list Data as stream</returns>
   /// Request Body : {"groupId": Guid value}
   /// </summary>
   [ClientCallableMethod(Name = "RenderFilteredAdminListDataByGroupId",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   public Stream RenderFilteredAdminListDataByGroupId(Guid groupId)
   {
 
   }

   /// <summary>
   /// Renders Tenant Admin SPList Data
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/RenderAdminListData
   /// <param name="parameters">parameters for list data rendering</param>
   /// <param name="overrideParameters">overrideParameter for list data renderings</param>
   /// <param name="listName">Optional List Name. By Default Aggregated TenantAdmin SPList will be used</param>
   /// <returns>Tenant Admin list Data as stream</returns>
   /// Request Body : {"parameters": {"ViewXml":"<View></View>","DatesInUtc":true}}
   /// </summary>
   [ClientCallableMethod(Name = "RenderAdminListData",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   public Stream RenderAdminListData(SPRenderListDataParameters parameters, SPRenderListDataOverrideParameters overrideParameters, string listName)
   {

   }

   /// <summary>
   /// Renders Tenant Admin SPList Data after filtering based on filter conditions
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/RenderFilteredAdminListData
   /// <param name="parameters">parameters for list data rendering</param>
   /// <param name="listName">Optional List Name. By Default Aggregated TenantAdmin SPList will be used</param>
   /// <returns>Filtered Tenant Admin list Data as stream</returns>
   /// Request Body : {"parameters": {"ViewXml":"<View></View>"}}
   /// </summary>
   [ClientCallableMethod(Name = "RenderFilteredAdminListData",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   public Stream RenderFilteredAdminListData(SPRenderListFilterDataParameters parameters, string listName)
   {
 
   }

   /// <summary>
   /// Gets SPList total item Count
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/GetSPListItemCount
   /// <param name="listName">Optional List Name. By Default Aggregated TenantAdmin SPList will be used</param>
   /// <returns>List item count</returns>
   /// </summary>
   [ClientCallableMethod(Name = "GetSPListItemCount",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   public int GetSPListItemCount(string listName)
   {
    
   }

   /// <summary>
   /// Gets the SpList Root Folder Properties
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/GetSPListRootFolderProperties
   /// <param name="listName">Optional List Name. By Default Aggregated TenantAdmin SPList will be used</param>
   /// <returns>List Root Fodler Properties</returns>
   /// </summary>
   [ClientCallableMethod(Name = "GetSPListRootFolderProperties",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   internal SPPropertyValues GetSPListRootFolderProperties(string listName)
   {
  
   }

   /// <summary>
   /// Gets all the views from Tenant Admin Sites List
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/GetAdminListViews
   /// <returns>All the avaiable Views from the List</returns>
   /// </summary>
   [ClientCallableMethod(Name = "GetAdminListViews",
  OperationType = OperationType.Read,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   public SPViewCollection GetAdminListViews()
   {

   }

   /// <summary>
   /// Gets a view by DisplayName from SPList
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/GetViewByDisplayName
   /// <param name="viewName">View Name</param>
   /// <param name="listName">Optional List Name. By Default Aggregated TenantAdmin SPList will be used</param>
   /// <returns>Returns SPView for given View Name</returns>
   /// Request Body : {"viewName": "ExportView"}}
   /// </summary>
   [ClientCallableMethod(Name = "GetViewByDisplayName",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   public SPView GetViewByDisplayName(string viewName, string listName)
   {


   /// <summary>
   /// Sets Default View in SPList
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/SetDefaultView
   /// <param name="viewId">View Id</param>
   /// <param name="listName">Optional List Name. By Default Aggregated TenantAdmin SPList will be used</param>
   /// Request Body : {"viewId" : "6450c68f-e2f6-461e-ac68-dc1f9f9400eb"}
   /// </summary>
   [ClientCallableMethod(Name = "SetDefaultView",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   public void SetDefaultView(string viewId, string listName)
   {
   }

   /// <summary>
   /// Removes item from SPList
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/RemoveSPListItem
   /// <param name="listItemId">List Item Id</param>
   /// <param name="listName">Optional List Name. By Default Aggregated TenantAdmin SPList will be used</param>
   /// Request Body : {"listItemId" : 1}
   /// </summary>
   [ClientCallableMethod(Name = "RemoveSPListItem",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   public void RemoveSPListItem(int listItemId, string listName)
   {
  
   }

   /// <summary>
   /// Add a new view in SPList
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/AddTenantAdminListView
   /// <param name="parameters">Creation Information for the New View</param>
   /// <returns>Returns SPView of the Newly Added View</returns>
   /// Request Body : {"parameters": {"Title": "NewView"}}
   /// </summary>
   [ClientCallableMethod(Name = "AddTenantAdminListView",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   internal SPView AddTenantAdminListView(SPViewCreationInformation parameters)
   {
  this.rbacManager.AssertAccess(Resources.SharePointSites, Permissions.Update);
  return SPOTenantAdminSPListUtilities<SPListAsAggregatedStore>.AddTenantAdminListView(siteSubscription, parameters);
   }

   /// <summary>
   /// Deletes a view in SPList
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/RemoveTenantAdminListView
   /// <param name="viewId">View Id</param>
   /// Request Body : {"viewId": "6450c68f-e2f6-461e-ac68-dc1f9f9400eb"}
   /// </summary>
   [ClientCallableMethod(Name = "RemoveTenantAdminListView",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   internal void RemoveTenantAdminListView(string viewId)
   {

   }

   /// <summary>
   /// Saves a view in SPList
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/UpdateTenantAdminListView
   /// <param name="viewId">View Id</param>
   /// <param name="viewXml">View XML</param>
   /// Request Body : {"viewId" : "6450c68f-e2f6-461e-ac68-dc1f9f9400eb", "viewXml":"<View></View>"}
   /// </summary>
   [ClientCallableMethod(Name = "UpdateTenantAdminListView",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   public void UpdateTenantAdminListView(string viewId, string viewXml)
   {
  
   }

   /// <summary>
   /// Updates SPField Values in Tenant Admin Lists
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/UpdateTenantAdminListItem
   /// <param name="listItemId">List Item Id</param>
   /// <param name="columnValues">List of TenantAdminList Column Values</param>
   /// <param name="listName">Optional List Name. By Default Aggregated TenantAdmin SPList will be used</param>
   /// Request Body : {"listItemId" : 1, "columnValues": [{columnName: "State", columnValue: "1"}]}
   /// </summary>
   [ClientCallableMethod(Name = "UpdateTenantAdminListItem",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   internal void UpdateTenantAdminListItem(int listItemId, List<TenantAdminListItemColumnValue> columnValues, string listName)
   {
 
   }

   /// <summary>
   /// Renders Recent Admin Actions SPList data as Stream
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/RenderRecentAdminActions
   /// <param name="parameters">parameters for list data rendering</param>
   /// <param name="overrideParameters">overrideParameter for list data renderings</param>
   /// <returns>Recent Admin Actions SPList Data as stream</returns>
   /// Request Body : {"parameters": {"ViewXml":"<View></View>","DatesInUtc":true}}
   /// </summary>
   [ClientCallableMethod(Name = "RenderRecentAdminActions",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   internal Stream RenderRecentAdminActions(SPRenderListDataParameters parameters, SPRenderListDataOverrideParameters overrideParameters)
   {


   /// <summary>
   /// Adds Recent Admin Action in Tenant RecentActions Store
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/AddRecentAdminAction
   /// <param name="payload">RecentAdminAction value object</param>
   /// <returns>Recent Admin Actions SPListItem</returns>
   /// Request Body : {"payload": {"adminActionSource": "SharePointAdminCenter", "adminActionStatus": "Success", "key": "123"}}
   /// </summary>
   [ClientCallableMethod(Name = "AddRecentAdminAction",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful)]
   internal SPListItem AddRecentAdminAction(TenantAdminRecentActionPayload payload)
   
   }

   /// <summary>
   /// Get list of Policy Automation executions from SPList
   /// </summary>
   /// <remarks>
   /// Returns stream of execution history item list filtered based on ViewXML passed in "parameters" object in payload.
   /// Single Policy Execution History can also be fetched by passing Policy Id in WHERE clause of ViewXML.
   /// <example>
   ///POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/RenderPolicyExecutionsHistory
   ///Request Body : {"parameters":{"ViewXml":"<View></View>","DatesInUtc":true}
   ///Response Body: {
   ///  "Row": [
   ///    {
   ///  "ExecutionId": "{DC3F043E-FF25-4D29-B857-CC241190E7D6}",
   ///  "PolicyId": "{1F4062E3-8D68-4CFE-8646-97978E7BD473}",
   ///  "PolicyVersion": "1",
   ///  "RetryCount": "0",
   ///  "Status": "Scheduled",
   ///  "WorkItemId": "{0E59F3CA-59AB-4C0D-80F3-257E314657C2}",
   ///  "WorkItemType": "Parent"
   ///    }
   ///  ]
   ///}
   /// </example>
   /// </remarks>
   [ClientCallableMethod(Name = "RenderPolicyExecutionsHistory",
  OperationType = OperationType.Read,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   public Stream RenderPolicyExecutionsHistory(SPRenderListDataParameters parameters, SPRenderListDataOverrideParameters overrideParameters)
   {
    }
   }

   /// <summary>
   /// Get list of Policy Automation definitions from SPList
   /// </summary>
   /// <remarks>
   /// <example>
   ///POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/RenderPolicyDefinitionList
   ///Request Body : {"parameters": {"ViewXml":"<View><ViewFields><FieldRef Name=\"PolicyId\"/><FieldRef Name=\"PolicyVersion\"/><FieldRef Name=\"PolicyState\"/><FieldRef Name=\"PolicyType\"/><FieldRef Name=\"PolicyTemplate\"/><FieldRef Name=\"CreatedBy\"/>
   ///<FieldRef Name=\"PolicyCreatedTime\"/><FieldRef Name=\"UpdatedBy\"/><FieldRef Name=\"LastUpdatedTime\"/><FieldRef Name=\"EnabledTime\"/><FieldRef Name=\"DisabledTime\"/><FieldRef Name=\"PolicyDeletedTime\"/><FieldRef Name=\"PolicyFrequencyValue\"/>
   ///<FieldRef Name=\"PolicyFrequencyUnit\"/><FieldRef Name=\"PolicyDefinition\"/></ViewFields><RowLimit Paged=\"TRUE\">30</RowLimit></View>","DatesInUtc":true}}
   /// </example>
   /// <param name="parameters">parameters for list data rendering</param>
   /// <param name="overrideParameters">overrideParameter for list data renderings</param>
   /// <returns>Policy definition SPList Data as stream</returns>
   /// </remarks>
   [ClientCallableMethod(Name = "RenderPolicyDefinitionList",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   internal Stream RenderPolicyDefinitionList(SPRenderListDataParameters parameters, SPRenderListDataOverrideParameters overrideParameters)
   {
  
   /// <summary>
   /// Creates Policy Automation definition record in SPList and create a work item
   /// using Policy Automation Work item scheduler.
   /// </summary>
   /// <remarks>
   /// <example>
   ///POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/CreatePolicyDefinition
   ///Request Body : {
   ///    "policyInputParameters": {
   ///    "policyId": "4b986c69-1d8b-4c59-bf08-6310a687b35e",
   ///    "policyCustomName": "inactivePolicy",
   ///    "policyType": "OOTB",
   ///    "policyTemplate": "Inactive",
   ///    "policyFrequencyValue": "1",
   ///    "policyFrequencyUnit": "WEEKLY"}
   /// }
   /// </example>
   /// <param name="tenantAdminPolicyDefinition">TenantAdmin Policy Definition</param>
   /// <returns>Policy Definition SPListItem</returns>
   /// </remarks>
   [ClientCallableMethod(Name = "CreatePolicyDefinition",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful)]
   internal SPListItem CreatePolicyDefinition(CreatePolicyRequest policyInputParameters)
   {
  
   /// <summary>
   /// Update Policy Automation definition instance in SPList.
   /// In case of no change in schedule, only update definition SPList with a new version.
   /// In case of schedule change, mark existing execution history as abandoned, and
   /// create a new work item along with new execution history.
   /// We can enable & disable any policy using this API.
   /// </summary>
   /// <remarks>
   /// <example>
   ///POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/UpdatePolicyDefinition
   ///Request Body : {"policyDefinition": {"policyId": "guid", "policyVersion": "1", "customPolicyName": "inactivePolicy"}, "updateType":"Enable"}
   /// </example>
   /// <param name="policyDefinition">Policy Definition</param>
   /// </remarks>
   [ClientCallableMethod(Name = "UpdatePolicyDefinition",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful)]
   internal void UpdatePolicyDefinition(int itemId, CreatePolicyRequest policyInputParameters)
   {
  
   /// <summary>
   /// Soft delete Policy by marking policy definition status as Deleted in SPList and mark existing
   /// execution history as abandoned
   /// </summary>
   /// <remarks>
   /// <example>
   ///POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/DeletePolicyDefinition
   ///RequestBody: {"policyDefinition": {"policyId": "guid", "policyVersion": "1", "policyState": "Deleted","customPolicyName": "inactivePolicy"}, "updateType":"Deleted"}
   /// </example>
   /// <param name="policyDefinition">PolicyDefinition</param>
   /// </remarks>
   [ClientCallableMethod(Name = "DeletePolicyDefinition",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful)]
   internal void DeletePolicyDefinition(int itemId)
   {


   /// <summary>
   /// Sends a sample mail to site owner for given site URL.
   /// </summary>
   /// <remarks>
   /// Note: To be used only for testing PolicyAutomationEmailNotificationUtility class.
   /// Should be removed after integration testing is successful.
   ///POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/SendEmail
   /// </remarks>
   [ClientCallableMethod(Name = "SendEmail",
  OperationType = OperationType.Read,
  ClientLibraryTargets = ClientLibraryTargets.RESTful)]
   public bool SendEmail(string siteUrl)
   {
 
   }

   /// <summary>
   /// Adds an item in Tenant Admin List with given Column Values
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/AddTenantAdminListItem
   /// <param name="columnValues">List of TenantAdminList Column Values to be added in the ListItem</param>
   /// <param name="listName">TenantAdmin SPList on which the list item will be added</param>
   /// Request Body :
   /// {
   ///"columnValues":
   ///    [{
   ///    columnName: "PUID_KEY",
   ///    columnValue: "admin@contoso.com:SPONewAdminCenterVisited"
   ///    }]
   ///"listName": "DO_NOT_DELETE_SPLIST_TENANTADMIN_USERSTORAGE"
   /// }
   /// </summary>
   /// <remarks>
   /// This API is intended to update only SPLists other than below Sites Lists in Tenant Admin Site
   /// 1. <see cref="AllSitesAggregatedStore"/>
   /// 2. <see cref="SPListAsAggregatedStore"/>
   /// Calls to Update to Sites Lists is not supported
   /// </remarks>
   [ClientCallableMethod(Name = "AddTenantAdminListItem",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   internal SPListItem AddTenantAdminListItem(List<TenantAdminListItemColumnValue> columnValues, string listName)
   {
  
   }

   /// <summary>
   /// Gets sites based on States from Tenant Admin Sites List
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/GetSitesByState
   /// <param name="states">State Values</param>
   /// <returns>List Items Collection</returns>
   /// Request Body : {"states" : [1,2,3]}
   /// </summary>
   [ClientCallableMethod(Name = "GetSitesByState",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   public SPListItemCollection GetSitesByState(List<int> states)
   {
 
   }

   /// <summary>
   /// Gets List Item based on filters from Tenant Admin Sites List
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/GetFilteredSPListItems
   /// <param name="columnName">Column Name</param>
   /// <param name="columnValue">Column Value</param>
   /// <param name="listName">Optional List Name. By Default Aggregated TenantAdmin SPList will be used</param>
   /// <returns>List Items Collection</returns>
   /// Request Body : { "columnName": "siteUrl", "columnValue"  "https://contoso-admin.sharepoint.com"}
   /// </summary>
   [ClientCallableMethod(Name = "GetFilteredSPListItems",
  OperationType = OperationType.Default,
  ClientLibraryTargets = ClientLibraryTargets.RESTful,
  RequiredRight = ResourceRight.GlobalReader)]
   public SPListItemCollection GetFilteredSPListItems(string columnName, string columnValue, string listName)
   {

   }

   /// <summary>
   /// Given a list of IBSegment GUIDS and IBMode(Optional), sets them to the site irrespective of the previous segments (and group if it is a group site) and also sets the ibMode.
   /// Only ODB, non-teams-connected group site, non-group site can be updated.
   /// POST https://contoso-admin.sharepoint.com/_api/SPO.Tenant/SetIBSegmentsOnSite
   /// Request Body : {"siteId":"54f6c9b4-abdb-4b23-a71d-239c0d2208f7", "segments":["9049237F-BF11-4G6B-433A-7A44A9BDDE42"] , "ibMode" : "Explicit"}
   /// Returns the IB Mode for the site in case of successful updation of site.
   /// </summary>
   /// <param name="siteId"> siteId of the site on which segments will be applied.</param>
   /// <param name="segments"> Comma-separated array of final IB Segment GUIDS which will be applied on the site.</param>
   /// <param name="ibMode"> ibMode is an optional value.</param>
   [ClientCallableMethod(Name = "SetIBSegmentsOnSite",
    OperationType = OperationType.Default,
    ClientLibraryTargets = ClientLibraryTargets.RESTful)]
   public string SetIBSegmentsOnSite(Guid siteId, Guid[] segments, string ibMode = null)
   {
 

   /// <summary>
   /// Registers the site with the specified URL as a HubSite.
   /// </summary>
   /// <param name="siteUrl">The URL of the site to make into a HubSite.</param>
   /// <returns>The properties of the new HubSite.</returns>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.All)]
   public HubSiteProperties RegisterHubSite(string siteUrl)
  

   /// <summary>
   /// Registers the site with the specified URL as a HubSite.
   /// </summary>
   /// <param name="siteUrl">The URL of the site to make into a HubSite.</param>
   /// <param name="creationInformation">Information used to create this HubSite.
   /// If not specified, some default properties will be set instead.</param>
   /// <returns>The properties of the new HubSite.</returns>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.All)]
   public HubSiteProperties RegisterHubSiteWithCreationInformation(string siteUrl, SPHubSiteCreationInformation creationInformation)



   /// <summary>
   /// Makes the specified site no longer a HubSite and removes it from the list of HubSites.
   /// The site is not deleted by this operation; it is merely removed from the list of available HubSites.
   /// </summary>
   /// <param name="siteUrl">The URL of the site which should no longer be a HubSite.</param>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.All)]
   public void UnregisterHubSite(string siteUrl)
   

   /// <summary>
   /// Connects a site to a HubSite using hub site id, support multi-geo.
   /// </summary>
   /// <param name="siteUrl">URL of the site to connect to the HubSite.</param>
   /// <param name="hubSiteId">Guid of the HubSite ID.</param>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.All)]
   public void ConnectSiteToHubSiteById(string siteUrl, Guid hubSiteId)
   
   /// <summary>
   /// Grant HubSite rights to users giving HubSite ID, support multi-geo.
   /// </summary>
   /// <param name="hubSiteId">ID of the HubSite.</param>
   /// <param name="principals">principals of users to grant rights.</param>
   /// <param name="grantedRights">The HubSite rights to grant.</param>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.All)]
   public HubSiteProperties GrantHubSiteRightsById(Guid hubSiteId, string[] principals, SPOHubSiteUserRights grantedRights)
  

  

   /// <summary>
   /// Revoke HubSite rights from users giving HubSite ID, support multi-geo.
   /// </summary>
   /// <param name="hubSiteId">ID of the HubSite.</param>
   /// <param name="principals">principals of users to revoke rights.</param>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.All)]
   public HubSiteProperties RevokeHubSiteRightsById(Guid hubSiteId, string[] principals)
   

   /// <summary>
   /// Reserved for internal use only.
   /// </summary>
   /// <returns>SPH site URL</returns>
   /// <example>
   /// Get https://contoso-admin.sharepoint.com/_api/SPOInternalUseOnly.Tenant/GetSPHSiteUrl
   ///
   /// Bypass tenant store cache:
   /// Get https://contoso-admin.sharepoint.com/_api/SPOInternalUseOnly.Tenant/GetSPHSiteUrl?bypasscache=true
   /// </example>
   // Gets the Company Portal URL
   [ClientCallableMethod(
  OperationType = OperationType.Read,
  ClientLibraryTargets = ClientLibraryTargets.All,
  RequiredRight = ResourceRight.GlobalReader)]
   public string GetSPHSiteUrl()
 

   /// <summary>
   /// Get the home site Ids, url and site title.
   /// Reserved for internal use only.
   /// </summary>
   /// <returns>Home site(company portal) Ids, site title and URL</returns>
   /// <example>
   /// Calling the API without quesrystring:
   ///   Return only siteId, WebId and audiences.
   ///   Get https://contoso-admin.sharepoint.com/_api/SPOInternalUseOnly.Tenant/GetHomeSitesDetails
   ///
   /// Calling the API with query strings:
   ///   ?bypasscache=true    bypass tenant store cache
   ///   ?expandDetails=true  call the expensive API with cross geo call to fill siteUrl and site title
   ///   Get https://contoso-admin.sharepoint.com/_api/SPOInternalUseOnly.Tenant/GetHomeSitesDetails?bypasscache=true&expandDetails=true
   /// </example>
   [ClientCallableMethod(
  OperationType = OperationType.Read,
  ClientLibraryTargets = ClientLibraryTargets.All,
  RequiredRight = ResourceRight.GlobalReader)]
   public List<HomeSitesDetails> GetHomeSitesDetails()
  
   /// <summary>
   /// Add a new home site in tenant admin setting.
   /// </summary>
   /// <param name="homeSiteUrl">The home site URL</param>
   /// <param name="order">The rank order of this home site. The order starts at 1, defaults to end of order if not provided.</param>
   /// <param name="audiences">The targeting audiences</param>
   /// <returns>Details about ID, title, URL from the adding home site</returns>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.All)]
   internal HomeSitesDetails AddHomeSite(string homeSiteUrl, int? order, Guid[] audiences)


   /// <summary>
   /// Update the home site with specific URL for its audiences.
   /// </summary>
   /// <param name="homeSiteUrl">The home site URL</param>
   /// <param name="order">
   /// The rank order of this home site. The order starts at 1
   /// Order = null or Order = -1 will not change the position(order) of the home site.
   /// </param>
   /// <param name="audiences">The targeting audiences</param>
   /// <returns>Details about ID, title, URL from the updating home site</returns>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.All)]
   public HomeSitesDetails UpdateHomeSite(string homeSiteUrl, int? order, Guid[] audiences)
    
   /// <summary>
   /// Reorder the rank of all home sites in tenant admin setting.
   /// </summary>
   /// <param name="homeSitesSiteIds">All home sites siteId with new order</param>
   /// <returns>Details about siteId and webId from all home sites in a new order</returns>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.All)]
   public HomeSitesDetails[] ReorderHomeSites(Guid[] homeSitesSiteIds)
 
   /// <summary>
   /// Reserved for internal use only.
   /// </summary>
   /// <param name="sphSiteUrl">URL of the SPH site</param>
   /// <returns>Status message indicating that the site has been set</returns>
   // Sets the Company Portal tenant setting to the specified site
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.All)]
   public string SetSPHSite(string sphSiteUrl)

   /// <summary>
   /// Remove a home site in tenant admin setting.
   /// </summary>
   /// <param name="homeSiteUrl">The home site URL</param>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.All)]
   public void RemoveHomeSite(string homeSiteUrl)
   

   /// <summary>
   /// Reserved for internal use only.
   /// </summary>
   /// <returns>Status message on successful removal</returns>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.All)]
   public string RemoveSPHSite()
  

   /// <summary>
   /// This method validates the powershell newly added parameters for multiple home sites.
   /// If parameters are used when flight is turned off, it throws an SPExperimentalFeatureException
   /// </summary>
   /// <param name="hasParameters">boolean representing if cmdlets are using new parameters</param>
   /// <exception cref="SPExperimentalFeatureException"></exception>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.All, IsBeta = true)]
   internal void ValidateMultipleHomeSitesParameterExists(bool hasParameters)
  

   /// <summary>
   /// Get site subscription id
   /// </summary>
   [ClientCallableMethod(ClientLibraryTargets = ClientLibraryTargets.RESTful, OperationType = OperationType.Read)]
   public Guid GetSiteSubscriptionId()


*/
}
export interface ITenant extends _Tenant { }
export const Tenant = spInvokableFactory<ITenant>(_Tenant);
