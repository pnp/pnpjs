
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
     *  Gets a Boolean value that specifies whether EveryoneExceptExternalUsers is allowed in people picker dialogs for private group site
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
     *  Gets a value to specify whether Add To OneDrive is disabled
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
