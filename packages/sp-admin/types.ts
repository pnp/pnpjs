
import { IResourcePath } from "@pnp/sp";

export interface IOffice365TenantInfo {
    /**
     * Gets a value to specify what external sharing capabilities are available.  Modifying this property
     * does not impact any settings stored on individual site collections.  This property has no impact on Partner
     * users (users added via a support partner).
     */
    SharingCapability: SharingCapabilities;
    /**
     * Gets a value to specify what external sharing capabilities are available in ODB.  Modifying this property
     * will impact settings stored on individual site collections.
     */
    ODBSharingCapability: SharingCapabilities;
    /**
     * Gets a value to specify if user accepting invitation must use the same email address invitation was sent to.
     */
    RequireAcceptingAccountMatchInvitedAccount: boolean;
    /**
     * Gets a bool value that if user checks generate mobile friendly Urls setting
     */
    MobileFriendlyUrlEnabled: boolean;
    /**
     * Gets a value to handle the tenant who can share settings
     */
    WhoCanShareAllowList: string;
    /**
     * Gets a value to handle guest sharing group's allow list
     */
    AllowSelectSGsInODBList: string[];
    /**
     * Gets a value to handle email attestation.
     */
    EmailAttestationEnabled: boolean;
    /**
     * Gets a value to handle guest sharing group's allow list
     */
    GuestSharingGroupAllowList: string;
    /**
     * Gets a value to handle guest user sharing to users not in guest user site collection
     */
    AllowGuestUserShareToUsersNotInSiteCollection: boolean;
    /**
     * Gets a Boolean value that specifies whether tenant users see the "Start a fresh site" menu option
     */
    DisplayStartASiteOption: boolean;
    /**
     * Gets a string which specifies the URL of the form to load in the Start a Site dialog
     */
    StartASiteFormUrl: string;
    /**
     * Gets a Boolean value that specifies whether external services are enabled for the tenancy
     */
    ExternalServicesEnabled: boolean;
    /**
     * Gets a Boolean value that specifies whether all users' My Sites are public by default
     */
    MySitesPublicEnabled: boolean;
    /**
     * Gets a Boolean value that specifies whether Everyone is visible in people picker dialogs
     */
    ShowEveryoneClaim: boolean;
    /**
     * Gets a Boolean value that specifies whether AllUsers is visible in people picker dialogs
     */
    ShowAllUsersClaim: boolean;
    /**
     * Gets a Boolean value that specifies whether EveryoneExceptExternalUsers is visible in people picker dialogs
     */
    ShowEveryoneExceptExternalUsersClaim: boolean;
    /**
     * Gets a Boolean value that specifies whether EveryoneExceptExternalUsers is allowed in people picker dialogs for private group site
     */
    AllowEveryoneExceptExternalUsersClaimInPrivateSite: boolean;
    /**
     * Gets a Boolean value that specifies whether Search and Resolve Operations in people picker dialogs do an exact match against UPN/Email
     * Default behavior is doing startswith match against common properties
     */
    SearchResolveExactEmailOrUPN: boolean;
    /**
     * Gets a Boolean value that specifies whether the ML Capture settings should be shown
     */
    MachineLearningCaptureEnabled: boolean;
    /**
     * Gets a SiteInfoForSitePicker instance that represents a site that tenant has opted-in as default Content Center site
     */
    DefaultContentCenterSite: ISiteInfoForSitePicker;
    /**
     * Gets a Boolean value that specifies whether the AIBuilder features should be shown
     */
    AIBuilderEnabled: boolean;
    /**
     * Gets the default PowerApps environment in which SharePoint Syntex form processing feature will create model
     */
    AIBuilderDefaultPowerAppsEnvironment: string;
    /**
     * Gets a collection value that specifies the sites for AIBuilderEnabled features
     */
    AIBuilderSiteList: string[];
    /**
     * Gets name of the file which contains the list of AIBuilder enabled sites
     */
    AIBuilderSiteListFileName: string;
    /**
     * Gets a collection value that specifies the sites for AIBuilderEnabled features
     */
    AIBuilderSiteInfoList: ISiteInfoForSitePicker[];
    /**
     * Gets Syntex consumption billing settings
     */
    SyntexBillingSubscriptionSettings: ISyntexBillingContext;
    /**
     * Gets a status value that specifies the image tagging option
     */
    ImageTaggingOption: ImageTaggingChoice;
    /**
     * Gets a status value that specifies whether admin is done with the configuration setup
     */
    HasAdminCompletedCUConfiguration: boolean;
    /**
     * Gets a Boolean value that specifies whether ADAL is disabled or not
     */
    OfficeClientADALDisabled: boolean;
    /**
     * Gets a Boolean value that specifies whether legacy auth protocols are enabled. These include MsoFba and IDCRL.
     */
    LegacyAuthProtocolsEnabled: boolean;
    /**
     * Gets a Boolean value that specifies whether ACS app only token are blocked.
     */
    DisableCustomAppAuthentication: boolean;
    /**
     * Gets the link to organization help page in case of access denied due to conditional access policy
     */
    ConditionalAccessPolicyErrorHelpLink: string;
    /**
     * Gets a Boolean value that specifies whether the following policy is enabled
     */
    BlockDownloadOfViewableFilesOnUnmanagedDevices: boolean;
    /**
     * Gets a Boolean value that specifies whether the following policy is enabled
     */
    BlockDownloadOfAllFilesOnUnmanagedDevices: boolean;
    /**
     * Gets a Boolean value that specifies whether the following access setting is enabled
     */
    BlockAccessOnUnmanagedDevices: boolean;
    /**
     * Gets a Boolean value that specifies whether the following access setting is enabled
     */
    AllowLimitedAccessOnUnmanagedDevices: boolean;
    /**
     * Gets a Boolean value that specifies whether the following policy is enabled
     */
    BlockDownloadOfViewableFilesForGuests: boolean;
    /**
     * Gets a Boolean value that specifies whether the following policy is enabled
     */
    BlockDownloadOfAllFilesForGuests: boolean;
    /**
     * Gets whether ODB sites should have the Shared with Everyone folder automatically provisioned or not
     */
    ProvisionSharedWithEveryoneFolder: boolean;
    /**
     * Gets the domain to which to accelerate the sign-in experience to. i.e. by skipping the OrgID/EvoSTS sign-in page for end-user
     */
    SignInAccelerationDomain: string;
    /**
     * Gets a value to force auto-acceleration sign-in on the tenant regardless of its external sharing status
     */
    EnableGuestSignInAcceleration: boolean;
    /**
     * Gets a Boolean value that specifies whether ExplorerView feature uses persistent cookies
     */
    UsePersistentCookiesForExplorerView: boolean;
    /**
     * Gets a value to specify if external users can reshare regardless of Members Can Share state
     */
    PreventExternalUsersFromResharing: boolean;
    /**
     * A list of site templates that tenant has opted-in/opted-out to sync Content types
     */
    ContentTypeSyncSiteTemplatesList: string[];
    /**
     * Gets a value to specify if BCC functionality is enabled for external invitations
     */
    BccExternalSharingInvitations: boolean;
    /**
     * Gets list of recipients to be BCC'ed on all external sharing invitations
     */
    BccExternalSharingInvitationsList: string;
    /**
     * Gets a value to specify if User Voice for customer feedback is enabled
     */
    UserVoiceForFeedbackEnabled: boolean;
    /**
     * Gets a value to specify if External Image Search is enabled on the File Picker
     */
    FilePickerExternalImageSearchEnabled: boolean;
    /**
     * Gets a all Organization Assets libraries
     */
    GetOrgAssets: ISPOrgAssets;
    /**
     * Gets whether Email Attestation is enabled
     */
    EmailAttestationRequired: boolean;
    /**
     * Gets the number of days between reattestation
     */
    EmailAttestationReAuthDays: number;
    /**
     * Gets whether external user expiration is enabled
     */
    ExternalUserExpirationRequired: boolean;
    /**
     * Gets the number of days before external user expiration if not individually extended
     */
    ExternalUserExpireInDays: number;
    /**
     * Gets whether or not the synced tenant properties will be updated on the next request
     */
    SyncPrivacyProfileProperties: boolean;
    /**
     * Gets whether or not the AAD B2B management policy will be synced on the next request
     */
    SyncAadB2BManagementPolicy: boolean;
    /**
     * Gets the Stream Launch Config stat
     */
    StreamLaunchConfig: number;
    /**
     * Gets the Stream Launch Config Last Updated value
     */
    StreamLaunchConfigLastUpdated: Date;
    /**
     * Gets the Stream Launch Config update count
     */
    StreamLaunchConfigUpdateCount: number;
    /**
     * Gets the Auth Context Resilient Mode
     */
    AuthContextResilienceMode: SPResilienceModeType;
    /**
     * Gets a value to specify the number of days that anonymous links expire
     */
    RequireAnonymousLinksExpireInDays: number;
    /**
     * Gets a value to specify a space separated list of allowed domain names
     */
    SharingAllowedDomainList: string;
    /**
     * Gets a value to specify a space separated list of blocked domain names
     */
    SharingBlockedDomainList: string;
    /**
     * Gets a value to specify the restriction mode
     */
    SharingDomainRestrictionMode: SharingDomainRestrictionModes;
    /**
     * Gets a value that allows members to search all existing guest users in the directory
     */
    ShowPeoplePickerSuggestionsForGuestUsers: boolean;
    /**
     * Gets default sharing link type
     */
    DefaultSharingLinkType: SharingLinkType;
    /**
     * Gets file anonymous link type
     */
    FileAnonymousLinkType: AnonymousLinkType;
    /**
     * Gets folder anonymous link type
     */
    FolderAnonymousLinkType: AnonymousLinkType;
    /**
     * Gets ODBMCS
     */
    ODBMembersCanShare: string;
    /**
     * Gets ODBAccessRequests
     */
    ODBAccessRequests: SharingState;
    /**
     * Gets a value to specify if site owner will get email notification if the user shared an item with external user
     */
    NotifyOwnersWhenItemsReshared: boolean;
    /**
     * Gets a value to specify if site owner will get email notification if the external user accepts the invitation
     */
    NotifyOwnersWhenInvitationsAccepted: boolean;
    /**
     * Gets a value to specify if site owner will get notification if the user created/updated an anonymous link in ODB
     */
    OwnerAnonymousNotification: boolean;
    /**
     * Gets a value to enable or disable push notifications in OneDrive
     */
    NotificationsInOneDriveForBusinessEnabled: boolean;
    /**
     * Gets a value to enable or disable push notifications in SharePoint
     */
    NotificationsInSharePointEnabled: boolean;
    /**
     * Whether comments on site pages are disabled or not
     */
    CommentsOnSitePagesDisabled: boolean;
    /**
     * Whether comments on files are disabled or not
     */
    CommentsOnFilesDisabled: boolean;
    /**
     * Whether comments on list items are disabled or not
     */
    CommentsOnListItemsDisabled: boolean;
    /**
     * Whether viewers commenting on media items is disabled or not
     */
    ViewersCanCommentOnMediaDisabled: boolean;
    /**
     * Whether social bar on site pages is enabled or not
     */
    SocialBarOnSitePagesDisabled: boolean;
    /**
     * Gets default link permission
     */
    DefaultLinkPermission: SharingLinkType;
    BlockDownloadLinksFileType: BlockDownloadLinksFileTypes;
    /**
     * Gets a value to specify whether anyone links should track link users
     */
    AnyoneLinkTrackUsers: boolean;
    /**
     * Gets collaboration type for fluid on OneDrive partition
     */
    OneDriveLoopSharingCapability: SharingCapabilities;
    /**
     * Gets default share link scope for fluid on OneDrive partition
     */
    OneDriveLoopDefaultSharingLinkScope: SharingScope;
    /**
     * Gets default share link role for fluid on OneDrive partition
     */
    OneDriveLoopDefaultSharingLinkRole: number;
    /**
     * Gets request files link enabled on OneDrive partition
     */
    OneDriveRequestFilesLinkEnabled: boolean;
    /**
     * Gets request files link expiration days on OneDrive partition
     */
    OneDriveRequestFilesLinkExpirationInDays: number;
    /**
     * Gets collaboration type for fluid on core partition
     */
    CoreLoopSharingCapability: SharingCapabilities;
    /**
     * Gets default share link scope for fluid on core partition
     */
    CoreLoopDefaultSharingLinkScope: SharingScope;
    /**
     * Gets default share link role for fluid on core partition
     */
    CoreLoopDefaultSharingLinkRole: number;
    /**
     * Gets collaboration type on core partition
     */
    CoreSharingCapability: SharingCapabilities;
    /**
     * Gets request files link enabled on core partition
     */
    CoreRequestFilesLinkEnabled: boolean;
    /**
     * Gets request files link expiration days on core partition
     */
    CoreRequestFilesLinkExpirationInDays: number;
    /**
     * Gets a value to indicate whether to allow anonymous meeting participants to access whiteboards
     */
    AllowAnonymousMeetingParticipantsToAccessWhiteboards: SharingState;
    /**
     * Gets address bar link permission
     */
    AddressbarLinkPermission: number;
    /**
     * Gets a value to specify whether Auto news digest is enabled
     */
    EnableAutoNewsDigest: boolean;
    /**
     * Gets customized external sharing service Url
     */
    CustomizedExternalSharingServiceUrl: string;
    /**
     * Gets a value to specify whether AAD B2B integration is enabled
     */
    EnableAzureADB2BIntegration: boolean;
    /**
     * Gets a value to specify whether Add To OneDrive is disabled
     */
    DisableAddToOneDrive: boolean;
    /**
     * Gets a value to specify whether to include at a glance in the sharing emails
     */
    IncludeAtAGlanceInShareEmails: boolean;
    /**
     * Get status of feature sync client restriction allowed
     */
    IsUnmanagedSyncClientRestrictionFlightEnabled: boolean;
    /**
     * Get sync client restrictions
     */
    IsUnmanagedSyncClientForTenantRestricted: boolean;
    /**
     * Get sync client trusted domain guids
     */
    AllowedDomainListForSyncClient: string[];
    /**
     * Get whether Mac clients should be blocked from sync
     */
    BlockMacSync: boolean;
    /**
     * Get sync client excluded file extensions
     */
    ExcludedFileExtensionsForSyncClient: string[];
    /**
     * Gets whether to hide the sync button on OneDrive for Business sites
     */
    HideSyncButtonOnODB: boolean;
    /**
     * Gets whether the sync button should use the Next-Generation Sync Client on OneDrive for Business sites
     */
    ShowNGSCDialogForSyncOnODB: boolean;
    /**
     * Gets whether Nucleus should be disabled for List Sync
     */
    DisableListSync: boolean;
    /**
     * Gets a value to enable or disable comment text contents in email
     */
    AllowCommentsTextOnEmailEnabled: boolean;
    /**
     * Gets whether Onedrive creation for guest users is enabled in the tenancy
     */
    OneDriveForGuestsEnabled: boolean;
    /**
     * IPAddressEnforcement for tenancy
     */
    IPAddressEnforcement: boolean;
    /**
     * Gets the IPAddress range that is allowed to access the tenancy, CIDR range that looks like 10.12.30/4. Also note: IPAddressEnforcement needs to be true
     */
    IPAddressAllowList: string;
    /**
     * Gets the WAC Token lifetime if tenant opted for IPAddressEnforcement
     */
    IPAddressWACTokenLifetime: number;
    /**
     * Gets whether Hashed Proof Token IP binding is enabled
     */
    ReduceTempTokenLifetimeEnabled: boolean;
    /**
     * Determines the grace period for Hashed Proof Tokens from an IP address that doesn't match the
     * IP address in the token, when the IP policy is not enabled and IP Binding is enabled
     */
    ReduceTempTokenLifetimeValue: number;
    /**
     * Gets whether EWS FindPeople with ABPs is enabled in PeoplePicker
     */
    UseFindPeopleInPeoplePicker: boolean;
    /**
     * Gets conditional access policy type
     */
    ConditionalAccessPolicy: SPOConditionalAccessPolicyType;
    /**
     * Gets the advanced setting of SPO conditional access policy
     */
    AllowDownloadingNonWebViewableFiles: boolean;
    /**
     * Gets limited access file type
     */
    LimitedAccessFileType: SPOLimitedAccessFileType;
    /**
     * Gets the advanced setting of SPO conditional access policy, A boolean value that specifies whether to allow editing in WAC
     */
    AllowEditing: boolean;
    /**
     * Gets the setting of whether app-enforced restrictions apply to TOAA users
     */
    ApplyAppEnforcedRestrictionsToAdHocRecipients: boolean;
    /**
     * Gets whether to show promoted file handlers
     */
    EnablePromotedFileHandlers: boolean;
    /**
     * Gets whether 2013 workflows are configured and enabled for the tenant
     */
    Workflows2013State: Workflows2013State;
    /**
     * Gets whether 2010 workflows are enabled for the tenant
     */
    Workflow2010Disabled: boolean;
    /**
     * Gets whether new 2010 workflows can be created for the tenant
     */
    StopNew2010Workflows: boolean;
    /**
     * Gets whether new 2013 workflows can be created for the tenant
     */
    StopNew2013Workflows: boolean;
    /**
     * Gets whether back to classic link is disabled in Modern UX
     */
    DisableBackToClassic: boolean;
    /**
     * Gets IBImplicitGroupBased value
     */
    IBImplicitGroupBased: boolean;
    /**
     * Gets InformationBarriersSuspension value
     */
    InformationBarriersSuspension: boolean;
    /**
     * Gets DefaultODBMode value
     */
    DefaultODBMode: string;
    /**
     * Gets a value to specify BlockUserInfoVisibilityInOneDrive
     */
    BlockUserInfoVisibilityInOneDrive: TenantBrowseUserInfoPolicyValue;
    /**
     * Gets a value to specify BlockUserInfoVisibilityInSharePoint
     */
    BlockUserInfoVisibilityInSharePoint: TenantBrowseUserInfoPolicyValue;
    /**
     * Gets AllowOverrideForBlockUserInfoVisibility value
     */
    AllowOverrideForBlockUserInfoVisibility: boolean;
    /**
     * Indicates whether personal list creation is disabled or not on the tenant
     */
    DisablePersonalListCreation: boolean;
    /**
     * Collection of modern list template ids which are disabled on the tenant
     */
    DisabledModernListTemplateIds: string[];
    /**
     * Indicates whether activating spaces is disabled or not on the tenant
     */
    DisableSpacesActivation: boolean;
    /**
     * Gets a value to specify whether the sync button on team sites and other ODBs is hidden.
     * (Basically this hides the sync button on all document libraries except the ODB that the user owns.)
     */
    HideSyncButtonOnDocLib: boolean;
    /**
     * Indicates whether Outlook PST version trimming is disabled or not on the tenant
     */
    DisableOutlookPSTVersionTrimming: boolean;
    /**
     * Gets MediaTranscription value
     */
    MediaTranscription: MediaTranscriptionPolicyType;
    /**
     * Gets the value of the setting which enables users to view files in Explorer
     */
    ViewInFileExplorerEnabled: boolean;
    /**
     * Gets whether Open In Desktop should be enabled
     */
    ShowOpenInDesktopOptionForSyncedFiles: boolean;
    /**
     * Gets a value to handle showing group suggestions for IB in PeoplePicker
     */
    ShowPeoplePickerGroupSuggestionsForIB: boolean;
}

export enum SharingCapabilities {
    /**
     * External user sharing (share by email) and guest link sharing are both disabled for all site collections
     * in the tenancy.  No new external user invitations or sharing links can be created, and any content previously
     * shared becomes inaccessible to external users.
     */
    Disabled = 0,
    /**
     * External user sharing is enabled for the tenancy, but guest link sharing is disabled.  Each individual
     * site collection's sharing properties govern whether the site collection has sharing disabled or allows
     * external user sharing, but a site collection cannot enable guest link sharing.
     */
    ExternalUserSharingOnly,
    /**
     * External user sharing and guest link sharing are enabled for the tenancy.  Each individual site
     * collection's sharing properties govern whether the site collection has sharing disabled, allows external user
     * sharing only, or allows both external user sharing and guest link sharing.
     */
    ExternalUserAndGuestSharing,
    /**
     * External user sharing and guest link sharing are both disabled for the tenancy, but AllowGuestUserSignIn is enabled.
     * Each individual site collection's sharing properties govern whether the site collection has sharing disabled or allows
     * existing external user signing in, but a site collection cannot enable guest link sharing and cannot share with new external users.
     */
    ExistingExternalUserSharingOnly
}

export interface ISiteInfoForSitePicker {
    SiteId: string;
    Url: string;
    SiteName: string;
    Error: string;
}

export enum ImageTaggingChoice {
    Disabled = 1,
    Basic = 2,
    Enhanced = 3,
}

export interface ISPOrgAssets {
    WebId: string;
    SiteId: string;
    Url: IResourcePath;
    Domain: IResourcePath;
}

export enum AzureSubscriptionState {
    Unknown = 0,
    Active = 1,
    Deleted = 2,
    Disabled = 3,
    Expired = 4,
    PastDue = 5,
    Warned = 6,
}

export interface ISyntexBillingContext {
    AzureResourceId: string;
    AzureSubscriptionState: AzureSubscriptionState;
    Location: string;
    Updated: Date;
}

export enum SPResilienceModeType {
    DefaultAAD = 0,
    Enabled = 1,
    Disabled = 2,
}

export enum SharingDomainRestrictionModes {
    None = 0,
    AllowList = 1,
    BlockList = 2,
}
export enum SharingLinkType {
    View,
    Edit,
    Review,
    Embed,
    BlocksDownload,
    CreateOnly,
    AddressBar,
    AdminDefault,
    Unknown,
}

export enum AnonymousLinkType {
    None,
    View,
    Edit
}

export enum SharingState {
    Unspecified,
    On,
    Off
}

export enum BlockDownloadLinksFileTypes {
    WebPreviewableFiles = 1,
    ServerRenderedFilesOnly = 2
}

export enum SharingScope {
    Anyone = 0,
    Organization = 1,
    SpecificPeople = 2,
}

export enum SPOConditionalAccessPolicyType {
    AllowFullAccess = 0,
    AllowLimitedAccess,
    BlockAccess,
    AuthenticationContext,
}

export enum SPOLimitedAccessFileType {
    OfficeOnlineFilesOnly = 0,
    WebPreviewableFiles,
    OtherFiles,
}

export enum Workflows2013State {
    Disabled,
    Configuring,
    Enabled,
}

export enum TenantBrowseUserInfoPolicyValue {
    ApplyToNoUsers = 0,
    ApplyToGuestAndExternalUsers = 1,
    ApplyToInternalUsers = 2,
    ApplyToAllUsers = 3,
}

export enum MediaTranscriptionPolicyType {
    Enabled = 0,
    Disabled = 1,
}

export enum SPOTenantCdnType {
    Public,
    Private,
}

export enum SPOrgAssetType {
    // The flag for Undefined is 0000.
    Undefined = 0x00,
    // The flag for ImageDocumentLibrary is 0001.
    ImageDocumentLibrary = 0x01,
    // The flag for OfficeTemplateLibrary is 0010.
    OfficeTemplateLibrary = 0x02,
    // The flag for OfficeFontLibrary is 0100.
    OfficeFontLibrary = 0x04,
}

export enum SPOTenantCdnPolicyType {
    IncludeFileExtensions,
    ExcludeRestrictedSiteClassifications,
    ExcludeIfNoScriptDisabled,
    ExcludeRestrictedSiteClassificationsFileExtensions
}

export interface IThemeProperties {
    Name: string;
    Palette: Record<string, string>;
    IsInverted: boolean;
}

export interface IGetExternalUsersResults {
    UserCollectionPosition: number;
    TotalUserCount: number;
    ExternalUserCollection: IExternalUser[];
}

export interface IExternalUser {
    AcceptedAs: string;
    DisplayName: string;
    InvitedAs: string;
    InvitedBy: string | null;
    IsCrossTenant: boolean;
    LoginName: string;
    UniqueId: string;
    UserId: number;
    WhenCreated: string;
}

export enum SortOrder {
    Ascending,
    Descending,
}

export interface IRemoveExternalUsersResults {
    RemoveFailed: string[];
    RemoveSucceeded: string[];
}

export enum ImportProfilePropertiesUserIdTypes {
    Email,
    CloudId,
    PrincipalName,
}

export interface IImportProfilePropertiesJobInfo {
    JobId: string;
    State: ImportProfilePropertiesJobState;
    SourceUri: string;
    ImportProfilePropertiesJobError: any;
    ErrorMessage: string;
    LogFolderUri: string;
}

export enum ImportProfilePropertiesJobState {
    Unknown = 0,
    Submitted = 1,
    Processing = 2,
    Queued = 3,
    Succeeded = 4,
    Error = 5,
}

export interface ISPOUserSessionRevocationResult {
    State: SPOUserSessionRevocationState;
}

export enum SPOUserSessionRevocationState {
    FeatureDisabled = 0,
    UserNotFound = 1,
    Failure = 2,
    NonInstantaneousSuccess = 3,
    InstantaneousSuccess = 4,
}

export interface IGroupCreationParams {
    Description: string;
    Owners: string[];
    CreationOptions: string[];
    Classification: string;
}

export interface ITenantSitePropertiesInfo {
    /**
     * The Url of the site
     */
    Url: string;
    /**
     * The status of the site
     */
    Status: string;
    /**
     * The TimeZone ID
     */
    TimeZoneId: number;
    /**
     * The last time content was modified on the site
     */
    LastContentModifiedDate: string;
    /**
     * A description of the lock issue
     */
    LockIssue: string;
    /**
     * The average usuage of resources by user code
     */
    AverageResourceUsage: number;
    /**
     * The current usuage of resources by user code
     */
    CurrentResourceUsage: number;
    /**
     * The current usage of storage for the site
     */
    StorageUsage: number;
    /**
     * The number of SPWebs in the site
     */
    WebsCount: number;
    /**
     * The compatibility leve of this site
     */
    CompatibilityLevel: number;
    /**
     * The email address of the site owner
     */
    OwnerEmail: string;
    /**
     * The HubSiteId of the HubSite this site is associated with
     */
    HubSiteId: string;
    /**
     * Whether or not this site is a HubSite
     */
    IsHubSite: boolean;
    /**
     * The GroupId of the group this site is associated with
     */
    RelatedGroupId: string;
    /**
     * The GroupId of the site
     */
    GroupId: string;
    /**
     * Site's description
     */
    Description: string;
    /**
     * Gets if the site is connected to a team in Microsoft Teams
     */
    IsTeamsConnected: boolean;
    /**
     * Gets if the site is connected to a team channel in Microsoft Teams
     */
    IsTeamsChannelConnected: boolean;
    /**
     * When the site is connected to a team channel in Microsoft Teams, gets the type of channel the site is connected to
     */
    TeamsChannelType: TeamsChannelTypeValue;
    /**
     * The Storage Quota
     */
    StorageMaximumLevel: number;
    /**
     * The warning level for storage usage
     */
    StorageWarningLevel: number;
    /**
     * The storage quota type for the site
     */
    StorageQuotaType: string;
    /**
     * Title Translations for the site
     */
    TitleTranslations: string[];
    /**
     * The maximum amount of machine resources that can be used by user code
     */
    UserCodeMaximumLevel: number;
    /**
     * The amount of machine resources used by user code which triggers warning
     */
    UserCodeWarningLevel: number;
    /**
     * The site's title
     */
    Title: string;
    /**
     * Flag that indicates a site has Holds
     */
    HasHolds: boolean;
    /**
     * The decoded login name of the site owner
     */
    Owner: string;
    /**
     * The encoded login name of the site owner Example: i:0#.f|membership|admin@thing.domain.net
     */
    OwnerLoginName: string;
    /**
     * The login name of the group owner
     */
    GroupOwnerLoginName: string;
    /**
     * Whether group owner is site admin
     */
    IsGroupOwnerSiteAdmin: boolean;
    /**
     * Whether update secondary admin during setting primary admin
     */
    SetOwnerWithoutUpdatingSecondaryAdmin: boolean;
    /**
     * The site owner name
     */
    OwnerName: string;
    /**
     * The site's web template name
     */
    Template: string;
    /**
     * The Locale ID of the site
     */
    Lcid: number;
    /**
     * Flag that indicates is a site supports self-service upgrade
     */
    AllowSelfServiceUpgrade: boolean;
    /**
     * A string representing the lock state of the site
     */
    LockState: string;
    /**
     * Determines whether the site has AddAndCustomizePages denied
     */
    DenyAddAndCustomizePages: DenyAddAndCustomizePagesStatus;
    /**
     * Determines whether the site is resticted to a specific geo location
     */
    RestrictedToRegion: RestrictedToRegion;
    /**
     * Determines whether PWA is enabled for the site
     */
    PWAEnabled: PWAEnabledStatus;
    /**
     *
     */
    SharingCapability: SharingCapabilities;
    /**
     *
     */
    SiteDefinedSharingCapability: SharingCapabilities;
    /**
     * Indicates whether company wide sharing links are disabled in all the webs of this site
     */
    DisableCompanyWideSharingLinks: CompanyWideSharingLinksPolicy;
    /**
     * Flag that controls allowing members to search guest users in the directory
     */
    ShowPeoplePickerSuggestionsForGuestUsers: boolean;
    /**
     * Indicates what this site's domain restriction mode is
     */
    SharingDomainRestrictionMode: SharingDomainRestrictionModes;
    /**
     * A list of allowed domain names for this site
     */
    SharingAllowedDomainList: string;
    /**
     * A list of blocked domain names for this site
     */
    SharingBlockedDomainList: string;
    /**
     * Flag that controls access from devices that aren't compliant or joined to a domain to have limited access (web-only, without the Download, Print, and Sync commands)
     */
    ConditionalAccessPolicy: SPOConditionalAccessPolicyType;
    /**
     * Indicates whether end users can download non-viewable files (e.g. zip)
     */
    AllowDownloadingNonWebViewableFiles: boolean;
    /**
     * Specifies what files can be viewed when ConditionalAccessPolicy is set to AllowLimitedAccess
     */
    LimitedAccessFileType: SPOLimitedAccessFileType;
    /**
     * Indicates whether WAC files should be open in Edit mode.
     */
    AllowEditing: boolean;
    /**
     * The Guid of an Information Protection label
     */
    SensitivityLabel: string;
    /**
     * The Guid of an Information Protection label (2)
     */
    SensitivityLabel2: string;
    /**
     * Indicates whether app views are disabled in all the webs of this site
     */
    DisableAppViews: AppViewsPolicy;
    /**
     * Indicates whether flows are disabled in all the webs of this site
     */
    DisableFlows: FlowsPolicy;
    /**
     * Gets the authentication context strength for this site for (deprecated, use AuthenticationContextName)
     */
    AuthContextStrength: string;
    /**
     * Gets the authentication context for this site for all the webs
     */
    AuthenticationContextName: string;
    /**
     * Whether comments on site pages are disabled or not
     */
    CommentsOnSitePagesDisabled: boolean;
    /**
     * Whether social bar on site pages is enabled or not
     */
    SocialBarOnSitePagesDisabled: boolean;
    /**
     * The default link type for this site
     */
    DefaultSharingLinkType: SharingLinkType;
    /**
     * The default link permission for this site
     */
    DefaultLinkPermission: SharingPermissionType;
    /**
     *
     */
    BlockDownloadLinksFileType: BlockDownloadLinksFileTypes;
    /**
     *
     */
    OverrideBlockUserInfoVisibility: SiteUserInfoVisibilityPolicyValue;
    /**
     * The default link to existing access for this site
     */
    DefaultLinkToExistingAccess: boolean;
    /**
     * This is to reset default link to existing access for this site. After resetting, the value will be default (false) or respect the higher level value
     */
    DefaultLinkToExistingAccessReset: boolean;
    /**
     *
     */
    AnonymousLinkExpirationInDays: number;
    /**
     *
     */
    OverrideTenantAnonymousLinkExpirationPolicy: boolean;
    /**
     *
     */
    ExternalUserExpirationInDays: number;
    /**
     *
     */
    OverrideTenantExternalUserExpirationPolicy: boolean;
    /**
     *
     */
    SharingLockDownEnabled: boolean;
    /**
     *
     */
    SharingLockDownCanBeCleared: boolean;
    /**
     * The collaboration type for fluid
     */
    LoopSharingCapability: SharingCapabilities;
    /**
     * Boolean whether collaboration type for fluid can superseed that on partition level
     */
    LoopOverrideSharingCapability: boolean;
    /**
     * Default share link scope for fluid
     */
    LoopDefaultSharingLinkScope: boolean;
    /**
     * Default share link role for fluid
     */
    LoopDefaultSharingLinkRole: number;
    /**
     * Gets request files link enabled
     */
    RequestFilesLinkEnabled: boolean;
    /**
     * Gets request files link expiration days
     */
    RequestFilesLinkExpirationInDays: number;
    /**
     * Gets the IB segment GUIDs
     */
    IBSegments: string[];
    /**
     * IBMode
     */
    IBMode: string;
    /**
     * Gets the media transcription policy
     */
    MediaTranscription: MediaTranscriptionPolicyType;
    /**
     * Gets the Block download policy flag
     */
    BlockDownloadPolicy: boolean;
    /**
     * Gets the Block download policy enforced Microsoft365 group GUIDs
     */
    BlockDownloadMicrosoft365GroupIds: string[];
    /**
     * Gets the Microsoft365 group GUIDs that are excluded from Block download policy
     */
    ExcludedBlockDownloadGroupIds: string[];
    /**
     * Gets the Read only access policy flag
     */
    ReadOnlyAccessPolicy: boolean;
    /**
     * Gets the Read only access for unmanaged devices policy flag
     */
    ReadOnlyForUnmanagedDevices: boolean;
}

export enum SpoSiteLockState {
    Unlock,
    NoAdditions,
    ReadOnly,
    NoAccess,
}

export enum TeamsChannelTypeValue {
    None = 0,
    PrivateChannel = 1,
    SharedChannel = 2,
    StandardChannel = 3,
}

export enum DenyAddAndCustomizePagesStatus {
    Unknown,
    Disabled,
    Enabled,
}

export enum RestrictedToRegion {
    NoRestriction,
    BlockMoveOnly,
    BlockFull,
    Unknown,
}

export enum PWAEnabledStatus {
    Unknown,
    Disabled,
    Enabled
}

export enum CompanyWideSharingLinksPolicy {
    Unknown = 0,
    Disabled = 1,
    NotDisabled = 2,
}

export enum AppViewsPolicy {
    Unknown = 0,
    Disabled = 1,
    NotDisabled = 2,
}

export enum FlowsPolicy {
    Unknown = 0,
    Disabled = 1,
    NotDisabled = 2,
}

export enum SharingPermissionType {
    None,
    View,
    Edit,
}

export enum SiteUserInfoVisibilityPolicyValue {
    OrganizationDefault = 0,
    ApplyToNoUsers = 1,
    ApplyToGuestAndExternalUsers = 2,
    ApplyToInternalUsers = 3,
    ApplyToAllUsers = 4,
}

export interface ITenantInfo {
    /**
    * Storage quota that is available for all sites in the tenant
    */
    StorageQuota: number;
    /**
    * Storage quota that is allocated for all sites in the tenant
    */
    StorageQuotaAllocated: number;
    /**
    * The resource quota for the tenant
    */
    ResourceQuota: number;
    /**
    * The resource quota allocated to all sites in the tenant
    */
    ResourceQuotaAllocated: number;
    /**
    * Determines which compatibility range is available for new
    * site collections.
    */
    CompatibilityRange: string;
    /**
    * When a site in the tenancy is locked it is redirected to this Url.
    */
    NoAccessRedirectUrl: string;
    /**
    * The tenant's root site url
    */
    RootSiteUrl: string;
    /**
    * Get status of feature sync client restriction allowed
    */
    IsUnmanagedSyncClientRestrictionFlightEnabled: boolean;
    /**
    * Get/Set sync client restrictions
    */
    IsUnmanagedSyncClientForTenantRestricted: boolean;
    /**
    * Get/Set sync client trusted domain guids
    */
    AllowedDomainListForSyncClient: string[];
    /**
    * Get/Set whether Mac clients should be blocked from sync
    */
    BlockMacSync: boolean;
    /**
    * Get/Set whether to hide the sync button on OneDrive for Business sites
    */
    HideSyncButtonOnODB: boolean;
    /**
    * Get/Set whether the sync button should use the Next-Generation Sync Client on OneDrive for Business sites
    */
    ShowNGSCDialogForSyncOnODB: boolean;
    /**
    * Get/Set whether Nucleus Sync should be disabled for Lists
    */
    DisableListSync: boolean;
    /**
    * Get/Set whether Groove clients should be blocked
    */
    OptOutOfGrooveBlock: boolean;
    /**
    * Get/Set whether Groove clients should be soft blocked
    */
    OptOutOfGrooveSoftBlock: boolean;
    /**
    * Get/Set excluded file extensions for sync client
    */
    ExcludedFileExtensionsForSyncClient: string[];
    /**
    * Gets or sets a value to specify whether Public CDN feature is enabled or disabled for the tenant.
    */
    PublicCdnEnabled: boolean;
    /**
    * Gets or sets a value to specify what file types can be exposed through Public CDN.
    */
    PublicCdnAllowedFileTypes: string;
    /**
    * Gets a list of the Public CDN origins.
    */
    PublicCdnOrigins: string[];
    /**
    * Get/Set whether Open In Desktop should be enabled
    */
    ShowOpenInDesktopOptionForSyncedFiles: boolean;
    /**
     *
     */
    IsMnAFlightEnabled: boolean;
    /**
     *
     */
    PermissiveBrowserFileHandlingOverride: boolean;
    /**
     *
     */
    DisallowInfectedFileDownload: boolean;
    /**
    * Disable sync client report problem dialog
    */
    DisableReportProblemDialog: boolean;
    /**
     *
     */
    SpecialCharactersStateInFileFolderNames: SpecialCharactersState;
    /**
    * Whether comments on site pages are disabled or not.
    */
    CommentsOnSitePagesDisabled: boolean;
    /**
    * Whether comments on files are disabled or not.
    */
    CommentsOnFilesDisabled: boolean;
    /**
    * Whether comments on list items are disabled or not.
    */
    CommentsOnListItemsDisabled: boolean;
    /**
    * Whether viewers commenting on media items is disabled or not.
    */
    ViewersCanCommentOnMediaDisabled: boolean;
    /**
    * Whether social bar on site pages is enabled or not.
    */
    SocialBarOnSitePagesDisabled: boolean;
    /**
    * Gets or sets the MarkNewFilesSensitiveByDefault property
    */
    MarkNewFilesSensitiveByDefault: SensitiveByDefaultState;
    /**
    * Gets or sets the BlockSendLabelMismatchEmail property
    */
    BlockSendLabelMismatchEmail: boolean;
    /**
    * Gets or sets the LabelMismatchEmailHelpLink property
    */
    LabelMismatchEmailHelpLink: string;
    /**
     *
     */
    EnabledFlightAllowAADB2BSkipCheckingOTP: boolean;
    /**
    * Determines whether Hashed Proof Token IP Binding is enabled.
    */
    ReduceTempTokenLifetimeEnabled: boolean;
    /**
    * Determines the grace period for Hashed Proof Tokens from an IP address that doesn't match the
    * IP address in the token, when the IP policy is not enabled and IP Binding is enabled.
    */
    ReduceTempTokenLifetimeValue: number;


    /**
     * rest of props from selecting *
     */
    AIBuilderDefaultPowerAppsEnvironment: string;
    AIBuilderEnabled: boolean;
    AIBuilderSiteListFileName: string;
    AllowAnonymousMeetingParticipantsToAccessWhiteboards: number;
    AllowCommentsTextOnEmailEnabled: boolean;
    AllowDownloadingNonWebViewableFiles: boolean;
    AllowEditing: boolean;
    AllowEveryoneExceptExternalUsersClaimInPrivateSite: boolean;
    AllowGuestUserShareToUsersNotInSiteCollection: boolean;
    AllowLimitedAccessOnUnmanagedDevices: boolean;
    AllowOverrideForBlockUserInfoVisibility: boolean;
    AllowSelectSGsInODBListInTenant: boolean | null;
    AnyoneLinkTrackUsers: boolean;
    ApplyAppEnforcedRestrictionsToAdHocRecipients: boolean;
    AuthContextResilienceMode: number;
    BccExternalSharingInvitations: boolean;
    BccExternalSharingInvitationsList: string[];
    BlockAccessOnUnmanagedDevices: boolean;
    BlockDownloadLinksFileType: number;
    BlockDownloadOfAllFilesForGuests: boolean;
    BlockDownloadOfAllFilesOnUnmanagedDevices: boolean;
    BlockDownloadOfViewableFilesForGuests: boolean;
    BlockDownloadOfViewableFilesOnUnmanagedDevices: boolean;
    BlockUserInfoVisibility: string;
    BlockUserInfoVisibilityInOneDrive: number;
    BlockUserInfoVisibilityInSharePoint: number;
    ConditionalAccessPolicy: number;
    ConditionalAccessPolicyErrorHelpLink: string;
    ContentTypeSyncSiteTemplatesList: string[];
    CoreLoopDefaultSharingLinkRole: number;
    CoreLoopDefaultSharingLinkScope: number;
    CoreLoopSharingCapability: number;
    CoreRequestFilesLinkEnabled: boolean;
    CoreRequestFilesLinkExpirationInDays: number;
    CoreSharingCapability: number;
    CustomizedExternalSharingServiceUrl: string;
    DefaultContentCenterSite: string;
    DefaultLinkPermission: number;
    DefaultODBMode: string;
    DefaultSharingLinkType: number;
    DisableAddToOneDrive: boolean;
    DisableBackToClassic: boolean;
    DisableCustomAppAuthentication: boolean;
    DisabledModernListTemplateIds: string[];
    DisabledWebPartIds: string[];
    DisableOutlookPSTVersionTrimming: boolean;
    DisablePersonalListCreation: boolean;
    DisableSpacesActivation: boolean;
    DisplayNamesOfFileViewers: boolean;
    DisplayNamesOfFileViewersInSpo: boolean;
    DisplayStartASiteOption: boolean;
    EmailAttestationEnabled: boolean;
    EmailAttestationReAuthDays: number;
    EmailAttestationRequired: boolean;
    EnableAIPIntegration: boolean;
    EnableAutoNewsDigest: boolean;
    EnableAzureADB2BIntegration: boolean;
    EnableGuestSignInAcceleration: boolean;
    EnableMinimumVersionRequirement: boolean;
    EnableMipSiteLabel: boolean;
    EnablePromotedFileHandlers: boolean;
    ExternalServicesEnabled: boolean;
    ExternalUserExpirationRequired: boolean;
    ExternalUserExpireInDays: number;
    FileAnonymousLinkType: number;
    FilePickerExternalImageSearchEnabled: boolean;
    FolderAnonymousLinkType: number;
    GuestSharingGroupAllowListInTenant: string;
    GuestSharingGroupAllowListInTenantByPrincipalIdentity: any;
    HasAdminCompletedCUConfiguration: boolean;
    HasIntelligentContentServicesCapability: boolean;
    HasTopicExperiencesCapability: boolean;
    HideSyncButtonOnDocLib: boolean;
    IBImplicitGroupBased: boolean;
    ImageTaggingOption: number;
    IncludeAtAGlanceInShareEmails: boolean;
    InformationBarriersSuspension: boolean;
    IPAddressAllowList: string;
    IPAddressEnforcement: boolean;
    IPAddressWACTokenLifetime: number;
    IsAppBarTemporarilyDisabled: boolean;
    IsCollabMeetingNotesFluidEnabled: boolean;
    IsFluidEnabled: boolean;
    IsHubSitesMultiGeoFlightEnabled: boolean;
    IsLoopEnabled: boolean;
    IsMultiGeo: boolean;
    IsMultipleHomeSitesFlightEnabled: boolean;
    IsWBFluidEnabled: boolean;
    LegacyAuthProtocolsEnabled: boolean;
    LimitedAccessFileType: number;
    MachineLearningCaptureEnabled: boolean;
    MediaTranscription: number;
    MobileFriendlyUrlEnabledInTenant: boolean;
    NotificationsInOneDriveForBusinessEnabled: boolean;
    NotificationsInSharePointEnabled: boolean;
    NotifyOwnersWhenInvitationsAccepted: boolean;
    NotifyOwnersWhenItemsReshared: boolean;
    ODBAccessRequests: number;
    ODBMembersCanShare: number;
    ODBSharingCapability: number;
    OfficeClientADALDisabled: boolean;
    OneDriveForGuestsEnabled: boolean;
    OneDriveLoopDefaultSharingLinkRole: number;
    OneDriveLoopDefaultSharingLinkScope: number;
    OneDriveLoopSharingCapability: number;
    OneDriveRequestFilesLinkEnabled: boolean;
    OneDriveRequestFilesLinkExpirationInDays: number;
    OneDriveStorageQuota: string;
    OrgNewsSiteUrl: string;
    OrphanedPersonalSitesRetentionPeriod: number;
    OwnerAnonymousNotification: boolean;
    PreventExternalUsersFromResharing: boolean;
    ProvisionSharedWithEveryoneFolder: boolean;
    RequireAcceptingAccountMatchInvitedAccount: boolean;
    RequireAnonymousLinksExpireInDays: number;
    RestrictedOneDriveLicense: boolean;
    SearchResolveExactEmailOrUPN: boolean;
    SharingAllowedDomainList: string[];
    SharingBlockedDomainList: string[];
    SharingCapability: number;
    SharingDomainRestrictionMode: number;
    ShowAllUsersClaim: boolean;
    ShowEveryoneClaim: boolean;
    ShowEveryoneExceptExternalUsersClaim: boolean;
    ShowPeoplePickerGroupSuggestionsForIB: boolean;
    ShowPeoplePickerSuggestionsForGuestUsers: boolean;
    SignInAccelerationDomain: string;
    StartASiteFormUrl: string;
    StopNew2010Workflows: boolean;
    StopNew2013Workflows: boolean;
    StreamLaunchConfig: number;
    StreamLaunchConfigLastUpdated: string;
    StreamLaunchConfigUpdateCount: number;
    SyncAadB2BManagementPolicy: boolean;
    SyncPrivacyProfileProperties: boolean;
    UseFindPeopleInPeoplePicker: boolean;
    UsePersistentCookiesForExplorerView: boolean;
    UserVoiceForFeedbackEnabled: boolean;
    ViewInFileExplorerEnabled: boolean;
    WhoCanShareAllowListInTenant: string;
    WhoCanShareAllowListInTenantByPrincipalIdentity: any;
    Workflow2010Disabled: boolean;
    Workflows2013State: number;
}

export enum SpecialCharactersState {
    NoPreference,
    Allowed,
    Disallowed,
}

export enum SensitiveByDefaultState {
    AllowExternalSharing,
    BlockExternalSharing,
}

export interface ISitePropertiesEnumerableFilter {
    Filter: string;
    StartIndex: string;
    IncludeDetail: boolean;
    Template: string;
    IncludePersonalSite: PersonalSiteFilter;
    GroupIdDefined: number;
}

export enum PersonalSiteFilter {
    UseServerDefault = 0, // default value for enum variables
    Include = 1,
    Exclude = 2,
}

/**
 * Basically useless from REST
 */
export interface ISPOOperation {
    HasTimedout: boolean;
    PollingInterval: number;
    IsComplete: boolean;
}

export interface ISiteCreationProps {
    Url: string;
    Owner: string;
    Title?: string;
    Template?: string;
    Lcid?: number;
    CompatibilityLevel?: number;
    StorageMaximumLevel?: number;
    StorageWarningLevel?: number;
    UserCodeMaximumLevel?: number;
    UserCodeWarningLevel?: number;
    TimeZoneId?: number;
}

export interface ISPOWebTemplatesInfo {
    Items: {
        CompatibilityLevel: number;
        Description: string;
        DisplayCategory: string | null;
        Id: number;
        Lcid: string;
        Name: string;
        Title: string;
    }[];
}

export interface IUpdateGroupSiteProperties {
    storageMaximumLevel: number;
    storageWarningLevel: number;
}

export interface ISPOSiteCreationSource {
    DisplayName: string;
    Id: string;
    Name: string;
}

export interface IPortalHealthStatus {
    Status: ResultStatus;
    Details: {
        PortalHealthErrorCode: any;
        Status: ResultStatus;
        ErrorReason: string;
        HelpLink: string;
    }[];
}

export enum ResultStatus {
    Success = 0,
    Warning = 1,
    Error = 2,
}

export interface IPowerAppsEnvironment {
    DisplayName: string;
    Name: string;
    IsDefault: boolean;
    AllocatedAICredits: number;
    PurchasedAICredits: number;
}

export interface ISiteUserGroupsData {
    siteId: string;
    owners: IUserInfo[];
    members: IUserInfo[];
    visitors: IUserInfo[];
}

export interface IUserInfo {
    Email: string;
    DisplayName?: string;
    UserPrincipalName: string;
}

export interface ISiteAdministratorsFieldsData {
    siteId: string;
    siteAdministrators: string[];
}

export interface ISiteAdminsInfo {
    email: string;
    name: string;
    userPrincipalName: string;
    loginName: string;
}

export interface ISPHubSiteCreationInfo {
    Title: string;
    SiteId: string;
    TenantInstanceId: string;
    SiteUrl: string;
    LogoUrl: string;
    Description: string;
    Targets: string;
    SiteDesignId: string;
    RequiresJoinApproval: boolean;
    HideNameInNavigation: boolean;
    ParentHubSiteId: string;
    EnablePermissionsSync: boolean;
    EnforcedECTs: string;
    PermissionsSyncTag: number;
    EnforcedECTsVersion: number;
}

export enum SPOHubSiteUserRights {
    None = 0,
    Join = 1,
}

export interface IHomeSitesDetails {
    SiteId: string;
    WebId: string;
    Audiences: string[];
    Url: string;
    Title: string;
    MatchingAudiences: string[];
}
