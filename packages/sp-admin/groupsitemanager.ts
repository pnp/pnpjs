import { body, BufferParse } from "@pnp/queryable";
import { _SPInstance, defaultPath, spPost, spInvokableFactory, ISPQueryable, spGet } from "@pnp/sp";
import {
    ChannelInfoCollection,
    EnsureTeamForGroupExResponse,
    GroupCreationContext,
    GroupSiteConversionInfo,
    GroupSiteInfo,
    OrgLabelsContextList,
    PinToTeamParams,
    PinToTeamResponse,
} from "./types.js";

@defaultPath("_api/groupsitemanager")
class _GroupSiteManager extends _SPInstance<Record<string, never>> {
    /**
     * Indicates if the current user / application can create Microsoft 365 groups
     *
     *@returns True if possible, otherwise false
     */
    public CanUserCreateGroup(): Promise<boolean> {
        return spGet(GroupSiteManager(this, "CanUserCreateGroup"));
    }

    /**
     * Clears Teams cache for current user / application
     */
    public ClearCurrentUserTeamsCache(): Promise<void> {
        return spPost(GroupSiteManager(this, "ClearCurrentUserTeamsCache"));
    }

    /**
     * Creates a SharePoint team site for the submitted Microsoft 365 group.
     * More information regarding site creation status here: https://learn.microsoft.com/sharepoint/dev/apis/site-creation-rest#response-2
     *
     *@param groupId Id of the Microsoft 365 group
     *@returns Created SharePoint site information (or current creation status)
     */
    public Create(groupId: string): Promise<GroupSiteInfo> {
        return spPost(GroupSiteManager(this, "Create"), body({
            groupId,
        }));
    }

    /**
     * Creates a Microsoft 365 group with a connected site.
     * This method doesn't work in Azure AD Application context
     *
     *@param displayName The name of the group
     *@param isPublic Whether the new group should be public or private
     *@param ownerPrincipalNames The group owners principal names
     *@param description Detailed information about the group
     *@param creationOptions Additional options ("SPSiteLanguage", "SensitivityLabel", "HubSiteId",...)
     *@returns Created SharePoint site information and group Id (or current creation status)
     */
    // eslint-disable-next-line max-len
    public CreateGroup(displayName: string, alias: string, isPublic: boolean, ownerPrincipalNames: string[], description: string, creationOptions: string[]): Promise<GroupSiteInfo> {
        return spPost(GroupSiteManager(this, "CreateGroup"), body({
            displayName,
            alias,
            isPublic,
            ownerPrincipalNames,
            description,
            creationOptions,
        }));
    }

    // CreateGroupEx: created in sp/sites node through PR #2520

    /**
     * Deletes a group-connected site.
     * This method doesn't work in Azure AD Application context
     *
     *@param siteUrl URL of the group-connected site to delete
     */
    public Delete(siteUrl: string): Promise<void> {
        return spPost(GroupSiteManager(this, "Delete"), body({
            siteUrl,
        }));
    }

    /**
     * Creates a team for the current site (group-connected only).
     * This method doesn't work in Azure AD Application context
     *
     *@returns The group-connected site team URL
     */
    public EnsureTeamForGroup(): Promise<string> {
        return spPost(GroupSiteManager(this, "EnsureTeamForGroup"));
    }

    /**
     * Creates a team for the current site (group-connected only).
     * This method only works with @pnp/sp behaviors.
     * This method doesn't work in Azure AD Application context
     *
     *@returns The group-connected site team ID and URL
     */
    public EnsureTeamForGroupEx(): Promise<EnsureTeamForGroupExResponse> {
        return spPost(GroupSiteManager(this, "EnsureTeamForGroupEx"));
    }

    /**
     * Gets labels configured for the tenant
     *
     *@param pageNumber Page results number to display
     *@returns A list of labels
     */
    public GetAllOrgLabels(pageNumber: number): Promise<OrgLabelsContextList> {
        return spPost(GroupSiteManager(this, "GetAllOrgLabels"), body({
            pageNumber,
        }));
    }

    /**
     * Gets the joined teams for the current user.
     * This method only works with @pnp/sp behaviors.
     * This method doesn't work in Azure AD Application context
     *
     *@param getLogoData True to return logo data, otherwise false
     *@param forceCacheUpdate True to force cache update, otherwise false
     *@returns A list of teams with detailed information. The returned value is a JSON object which can be parsed
     */
    public GetCurrentUserJoinedTeams(getLogoData: boolean, forceCacheUpdate: boolean): Promise<string> {
        return spPost(GroupSiteManager(this, "GetCurrentUserJoinedTeams"), body({
            getLogoData,
            forceCacheUpdate,
        }));
    }

    /**
     * Gets the teams shared channels which current user is member of.
     * This method doesn't work in Azure AD application context
     *
     *@returns A list of teams shared channels with summary information (object id, acronym, banner color, ...).
      The returned value is a JSON object which can be parsed
     */
    public GetCurrentUserSharedChannelMemberGroups(): Promise<string> {
        return spPost(GroupSiteManager(this, "GetCurrentUserSharedChannelMemberGroups"));
    }

    /**
     * Gets the teams which current user is member of.
     * This method doesn't work in Azure AD Application context
     *
     *@returns A list of teams with summary information (object id, acronym, banner color,...).
      The returned value is a JSON object which can be parsed
     */
    public GetCurrentUserTeamConnectedMemberGroups(): Promise<string> {
        return spPost(GroupSiteManager(this, "GetCurrentUserTeamConnectedMemberGroups"));
    }

    /**
     * Gets information regarding Microsoft 365 group creation configuration
     *
     *@returns Information about current configuration
     */
    public GetGroupCreationContext(): Promise<GroupCreationContext> {
        return spGet(GroupSiteManager(this, "GetGroupCreationContext"));
    }

    /**
     * Gets information regarding site groupification configuration for the current site
     *
     *@returns Information about current configuration
     */
    public GetGroupSiteConversionData(): Promise<GroupSiteConversionInfo> {
        return spGet(GroupSiteManager(this, "GetGroupSiteConversionData"));
    }

    /**
     * Gets group-connected site creation status
     *
     *@param groupId Microsoft 365 group Id
     *@returns SharePoint site information and group Id (or current creation status)
     */
    public GetSiteStatus(groupId: string): Promise<GroupSiteInfo> {
        return spPost(GroupSiteManager(this, "GetSiteStatus"), body({
            groupId,
        }));
    }

    /**
     * Gets detailed information related to a team channel files URL.
     * This method only works with @pnp/sp behaviors.
     * This method doesn't work in Azure AD Application context
     *
     *@param teamId Team's group Id
     *@param channelId Teams's channel Id
     *@returns Stream information about team channel files URL. The returned value is a JSON object which can be parsed
     */
    public GetTeamChannelFilesUrl(teamId: string, channelId: string): Promise<ArrayBuffer> {
        return spPost(GroupSiteManager(this, "GetTeamChannelFilesUrl").using(BufferParse()), body({
            teamId,
            channelId,
        }));
    }

    /**
     * Gets channels for a team.
     * This method only works with @pnp/sp behaviors.
     * This method doesn't work in Azure AD Application context
     *
     *@param teamId Team's group Id
     *@param useStagingEndpoint Use staging endpoint or not
     *@returns Stream information about team's channels. The returned value is a JSON object which can be parsed
     */
    public GetTeamChannels(teamId: string, useStagingEndpoint: boolean): Promise<ArrayBuffer> {
        return spPost(GroupSiteManager(this, "GetTeamChannels").using(BufferParse()), body({
            teamId,
            useStagingEndpoint,
        }));
    }

    /**
     * Gets channels for a team.
     * This method only works with @pnp/sp behaviors.
     * This method doesn't work in Azure AD Application context
     *
     *@param teamId Team's group Id
     *@returns Detailed information about team's channels. The returned value is a JSON object which can be parsed
     */
    public GetTeamChannelsDirect(teamId: string): Promise<string> {
        return spPost(GroupSiteManager(this, "GetTeamChannelsDirect"), body({
            teamId,
        }));
    }

    /**
     * Gets channels for a team.
     * This method only works with @pnp/sp behaviors.
     * This method doesn't work in Azure AD Application context
     *
     *@param teamId Team's group Id
     *@returns Detailed information about team's channels
     */
    public GetTeamChannelsEx(teamId: string): Promise<ChannelInfoCollection> {
        return spPost(GroupSiteManager(this, "GetTeamChannelsEx"), body({
            teamId,
        }));
    }

    /**
     * Gets channels for a team based on site URL.
     * Works only with root site (neither private or shared channel sites).
     * This method only works with @pnp/sp behaviors.
     * This method doesn't work in Azure AD Application context
     *
     *@param siteUrl group-connected site URL
     *@returns Detailed information about team's channels
     */
    public GetTeamChannelsWithSiteUrl(siteUrl: string): Promise<ChannelInfoCollection> {
        return spPost(GroupSiteManager(this, "GetTeamChannelsWithSiteUrl"), body({
            siteUrl,
        }));
    }

    /**
     * Gets shared channels membership for a user
     *
     *@param userName User principal name to get shared channels membership
     *@returns Information about user's shared channels. The returned value is a JSON object which can be parsed
     */
    public GetUserSharedChannelMemberGroups(userName: string): Promise<string> {
        return spPost(GroupSiteManager(this, "GetUserSharedChannelMemberGroups"), body({
            userName,
        }));
    }

    /**
     * Gets teams membership for a user
     *
     *@param userName User principal name to get teams membership
     *@returns Information about requested user's teams. The returned value is a JSON object which can be parsed
     */
    public GetUserTeamConnectedMemberGroups(userName: string): Promise<string> {
        return spPost(GroupSiteManager(this, "GetUserTeamConnectedMemberGroups"), body({
            userName,
        }));
    }

    /**
     * Gets a valid SharePoint site URL from an alias
     *
     *@param alias Alias for SharePoint site URL (also used when creating a Microsoft 365 group)
     *@param managedPath SharePoint managed path ("/sites" or "/teams", optional)
     *@param isTeamSite True if target is a group-connected site, otherwise false (optional)
     *@returns A valid SharePoint site URL
     */
    public GetValidSiteUrlFromAlias(alias: string, managedPath?: string, isTeamSite?: boolean): Promise<string> {
        return spPost(GroupSiteManager(this, "GetValidSiteUrlFromAlias"), body({
            alias,
            managedPath,
            isTeamSite,
        }));
    }

    /**
     * Indicates if the "Teamify" prompt is displayed or not on a group-connected site.
     * If no parameter is specified, the command will run in the current site context
     *
     *@param siteUrl Group-Connected site
     *@returns true if "Teamify" prompt is hidden, otherwise false
     */
    public IsTeamifyPromptHidden(siteUrl?: string): Promise<boolean> {
        return spPost(GroupSiteManager(this, "IsTeamifyPromptHidden"), body({
            siteUrl,
        }));
    }

    /**
     * Gets the group-connected site default OneNote Notebook location
     *
     *@param groupId Id of the Microsoft 365 group
     *@returns URL of the group's default OneNote Notebook
     */
    public Notebook(groupId: string): Promise<string> {
        return spPost(GroupSiteManager(this, "Notebook"), body({
            groupId,
        }));
    }

    /**
     * Pins one or more new SharePoint tabs to a team's default channel.
     * This method only works with @pnp/sp behaviors.
     * This method doesn't work in Azure AD Application context
     *
     *@param requestParams Parameters including the tabs data and the team's group Id
     *@returns Successful and failed results for the submitted tabs to add
     */
    public PinToTeam(requestParams: PinToTeamParams): Promise<PinToTeamResponse> {
        return spPost(GroupSiteManager(this, "PinToTeam"), body({
            requestParams,
        }));
    }

    /**
     * Supports calling POST methods not added explicitly to this class
     *
     * @param method method name, used in url path (ex: "CreateGroup")
     * @param args optional, any arguments to include in the body
     * @returns The result of the method invocation T
     */
    public call<T = any>(method: string, args?: any): Promise<T> {
        const query = GroupSiteManager(this, method);
        if (typeof args !== "undefined") {
            return spPost(query, body(args));
        } else {
            return spPost(query);
        }
    }
}

export interface IGroupSiteManager extends _GroupSiteManager { }
export const GroupSiteManager = spInvokableFactory<ISPQueryable<any>>(_GroupSiteManager);
