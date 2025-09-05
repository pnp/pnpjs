import { _GraphInstance, _GraphCollection, graphInvokableFactory, GraphInstance, graphPost, graphGet, GraphQueryable, graphPatch, graphDelete } from "../graphqueryable.js";
import { body, HeaderParse } from "@pnp/queryable";
import { updateable, IUpdateable, getById, IGetById, deleteable, IDeleteable } from "../decorators.js";
import { defaultPath } from "../decorators.js";
import {
    Team as ITeamType,
    TeamsAsyncOperation as ITeamsAsyncOperation,
    TeamsTab as ITeamsTabType,
    TeamsAppInstallation as ITeamsAppInstallation,
    Channel as IChannelType,
    Message as IMessageType,
    DriveItem as IDriveItemType,
    ConversationMember as IConversationMemberType,
    User as IUserType,
    SharedWithChannelTeamInfo as ISharedWithChannelTeamInfoType,
} from "@microsoft/microsoft-graph-types";

/**
 * Represents a Microsoft Team
 */
@defaultPath("team")
@updateable()
export class _Team extends _GraphInstance<ITeamType> {

    public get primaryChannel(): IChannel {
        return Channel(this, "primaryChannel");
    }

    public get channels(): IChannels {
        return Channels(this);
    }

    public get installedApps(): IInstalledApps {
        return InstalledApps(this);
    }

    /**
     * Archives this Team
     *
     * @param shouldSetSpoSiteReadOnlyForMembers Should members have Read-only in associated Team Site
     */
    public archive(shouldSetSpoSiteReadOnlyForMembers = false): Promise<void> {
        return graphPost(Team(this, "archive"), body({ shouldSetSpoSiteReadOnlyForMembers }));
    }

    /**
    * Unarchives this Team
    */
    public unarchive(): Promise<void> {
        return graphPost(Team(this, "unarchive"));
    }

    /**
     * Clones this Team
     * @param name The name of the new Group
     * @param description Optional description of the group
     * @param partsToClone Parts to clone ex: apps,tabs,settings,channels,members
     * @param visibility Set visibility to public or private
     */
    public async cloneTeam(
        name: string,
        description = "",
        partsToClone = "apps,tabs,settings,channels,members",
        visibility: "public" | "private" = "private"): Promise<ITeamCreateResultAsync> {

        const postBody = {
            description: description ? description : "",
            displayName: name,
            mailNickname: name,
            partsToClone,
            visibility,
        };

        // TODO:: make sure this works
        const creator = Teams(this, "clone").using((instance: ITeams) => {

            instance.on.parse(async (url, response, result) => {

                result = response.headers.has("location") ? response.headers : response;

                return [url, response, result];
            });

            return instance;
        });

        const data: Headers = await graphPost(creator, body(postBody));
        const result: ITeamCreateResultAsync = { teamId: "", operationId: "" };
        if (data.has("location")) {
            const location = data.get("location");
            const locationArray = location.split("/");
            if (locationArray.length === 3) {
                result.teamId = locationArray[1].substring(locationArray[1].indexOf("'") + 1, locationArray[1].lastIndexOf("'"));
                result.operationId = locationArray[2].substring(locationArray[2].indexOf("'") + 1, locationArray[2].lastIndexOf("'"));
            }
        }

        return result;
    }

    public getOperationById(id: string): Promise<ITeamsAsyncOperation> {
        return GraphInstance(this, `operations/${id}`)();
    }

    public async incomingChannels(): Promise<IChannelType[]> {
        return graphGet(GraphQueryable(this, "incomingChannels"));
    }

    public async removeIncomingChannel(channelId: string): Promise<void> {
        return graphDelete(GraphQueryable(this, `incomingChannels/${channelId}/$ref`));
    }
}
export interface ITeam extends _Team, IUpdateable<ITeamType> { }
export const Team = graphInvokableFactory<ITeam>(_Team);

/**
 * Teams
 */
@defaultPath("teams")
@getById(Team)
export class _Teams extends _GraphCollection<ITeamType[]> {
    public async create(team: ITeamType): Promise<ITeamCreateResultAsync> {

        const creator = Teams(this, null).using(HeaderParse());
        const data: Headers = await graphPost(creator, body(team));
        const result: ITeamCreateResultAsync = { teamId: "", operationId: "" };
        if (data.has("location")) {
            const location = data.get("location");
            const locationArray = location.split("/");
            if (locationArray.length === 3) {
                result.teamId = locationArray[1].substring(locationArray[1].indexOf("'") + 1, locationArray[1].lastIndexOf("'"));
                result.operationId = locationArray[2].substring(locationArray[2].indexOf("'") + 1, locationArray[2].lastIndexOf("'"));
            }
        }

        return result;
    }
}
export interface ITeams extends _Teams, IGetById<ITeam> { }
export const Teams = graphInvokableFactory<ITeams>(_Teams);

/**
 * Channel Member
 */
export class _ChannelMember extends _GraphInstance<IChannelMember> {
    /**
     * Update channel member role
     * @returns ConversationMember
     */
    public async updateChannelMember(member: IChannelMemberUpdate): Promise<IConversationMemberType> {
        member["@odata.type"] = "#microsoft.graph.aadUserConversationMember";
        return graphPatch(GraphQueryable(this), body(member));
    }
}
export interface IChannelMember extends _Channel, IDeleteable { }
export const ChannelMember = graphInvokableFactory<IChannelMember>(_ChannelMember);

/**
 * Channel Members
 */
@defaultPath("members")
@getById(ChannelMember)
export class _ChannelMembers extends _GraphCollection<IConversationMemberType[]> {
    public get channelMembers(): IChannelMember {
        return ChannelMember(this);
    }

    /**
     * Add member to a private or shared channel
     * @returns ConversationMember
     */
    public async add(member: IChannelMemberAdd): Promise<IConversationMemberType> {
        member["@odata.type"] = "#microsoft.graph.aadUserConversationMember";
        return graphPost(GraphQueryable(this), body(member));
    }
}
export interface IChannelMembers extends _ChannelMembers, IGetById<IChannelMember> { }
export const ChannelMembers = graphInvokableFactory<IChannelMembers>(_ChannelMembers);

/**
 * Channel
 */
export class _Channel extends _GraphInstance<IChannel> {
    public get tabs(): ITabs {
        return Tabs(this);
    }

    public get messages(): IMessages {
        return Messages(this);
    }

    public async filesFolder(): Promise<IDriveItemType> {
        return graphGet(GraphQueryable(this, "filesFolder"));
    }

    public get channelMembers(): IChannelMembers {
        return ChannelMembers(this);
    }

    /**
     * Get a list of members in a channel, including direct and indirect members of standard, private, and shared channels.
     * @returns ConversationMember array
     */
    public async allMembers(): Promise<IConversationMemberType[]> {
        return graphGet(GraphQueryable(this, "allMembers"));
    }

    // /**
    //  * Get a conversationMember from a channel.
    //  * @returns ConversationMember
    //  */
    // public async getMemberById(membershipId: string): Promise<IConversationMemberType> {
    //     return graphGet(GraphQueryable(this, `members/${membershipId}`));
    // }

    /**
     * Archive a channel
     * @param shouldSetSpoSiteReadOnlyForMembers, default false
     */
    public async archive(shouldSetSpoSiteReadOnlyForMembers = false): Promise<void> {
        const postBody = {
            shouldSetSpoSiteReadOnlyForMembers,
        };
        return graphPost(GraphQueryable(this, "archive"), body(postBody));
    }

    /**
     * Unarchive a channel
     */
    public async unarchive(): Promise<void> {
        return graphPost(GraphQueryable(this, "unarchive"));
    }

    /**
     * Complete channel migration
     */
    public async completeMigration(): Promise<void> {
        return graphPost(GraphQueryable(this, "completeMigration"));
    }

    /**
     * Provision an email address for a channel.
     */
    public async provisionEmail(): Promise<void> {
        return graphPost(GraphQueryable(this, "provisionEmail"));
    }

    /**
     * Remove an email address for a channel.
     */
    public async removeEmail(): Promise<void> {
        return graphPost(GraphQueryable(this, "removeEmail"));
    }

    /**
     * Get the list of teams that has been shared a specified channel.
     * This operation is allowed only for channels with a membershipType value of shared.
     */
    public async sharedWithTeams(): Promise<ISharedWithChannelTeamInfoType[]> {
        return graphGet(GraphQueryable(this, "sharedWithTeams"));
    }

    /**
     * Get a team that has been shared with a specified channel.
     * This operation is allowed only for channels with a membershipType value of shared.
     * @param sharedWithTeamsId: string
     */
    public async sharedWithChannelTeamInfo(sharedWithTeamsId: string): Promise<ISharedWithChannelTeamInfoType> {
        return graphGet(GraphQueryable(this, `sharedWithTeams/${sharedWithTeamsId}`));
    }

    /**
     * Get a team that has been shared with a specified channel.
     * This operation is allowed only for channels with a membershipType value of shared.
     * @param sharedWithTeamsId: string
     */
    public async removeSharedWithChannelTeamInfo(sharedWithTeamsId: string): Promise<void> {
        return graphDelete(GraphQueryable(this, `sharedWithTeams/${sharedWithTeamsId}`));
    }

    /**
     * Get the list of conversationMembers who can access a shared channel.
     * This operation is allowed only for channels with a membershipType value of shared.
     * @param sharedWithTeamsId: string
     */
    public async sharedWithChannelMembers(sharedWithTeamsId: string): Promise<IConversationMemberType> {
        return graphGet(GraphQueryable(this, `sharedWithTeams/${sharedWithTeamsId}/allowedMembers`));
    }

    /**
     * Determine whether a user has access to a shared channel.
     * This operation is allowed only for channels with a membershipType value of shared.
     * @param sharedWithTeamsId: string
     */
    public async doesUserHaveAccess(userAccess: IUserAccessRequest): Promise<IConversationMemberType> {
        const path = `doesUserHaveAccess(userId='${userAccess.userId}',tenantId='${userAccess.tenantId}',userPrincipalName='${userAccess.userPrincipalName}')`;
        return graphGet(GraphQueryable(this, path));
    }
}
export interface IChannel extends _Channel, IUpdateable<IChannelType>, IDeleteable { }
export const Channel = graphInvokableFactory<IChannel>(_Channel);

/**
 * Channels
 */
@defaultPath("channels")
@getById(Channel)
export class _Channels extends _GraphCollection<IChannelType[]> {

    /**
     * Creates a new Channel in the Team
     * @param displayName The display name of the new channel
     * @param description Optional description of the channel
     *
     */
    public async add(displayName: string, description = ""): Promise<IChannelCreateResult> {

        const postBody = {
            description,
            displayName,
        };

        const data = await graphPost(this, body(postBody));

        return {
            channel: (<any>this).getById(data.id),
            data,
        };
    }

    /**
     * Gets all the messages in a channel.
     * @param model optionally specify the licensing and payment model
     *
     */
    public async getAllMessages(model: "A" | "B" | undefined): Promise<IMessageType[]> {
        const qString = `getAllMessages${model ? `?model=${model}` : ""}`;
        return graphGet(GraphQueryable(this, qString));
    }

    /**
     * Gets all the retained messages in a channel.
     * @param model optionally specify the licensing and payment model
     *
     */
    public async getAllRetainedMessages(model: "A" | "B" | undefined): Promise<IMessageType[]> {
        const qString = `getAllRetainedMessages${model ? `?model=${model}` : ""}`;
        return graphGet(GraphQueryable(this, qString));
    }
}
export interface IChannels extends _Channels, IGetById<IChannel> { }
export const Channels = graphInvokableFactory<IChannels>(_Channels);

/**
 * Message
 */
export class _Message extends _GraphInstance<IMessageType> {
    /**
     * Gets all the replies to a message.
     *
     */
    public async replies(): Promise<IMessageType> {
        return graphGet(GraphQueryable(this, "replies"));
    }
}
export interface IMessage extends _Message { }
export const Message = graphInvokableFactory<IMessage>(_Message);

/**
 * Messages
 */
@defaultPath("messages")
@getById(Message)
export class _Messages extends _GraphCollection<IMessageType[]> {

    /**
     * Adds a message
     * @param message ChatMessage object that defines the message
     *
     */
    public async add(message: IMessageType): Promise<IMessageCreateResult> {

        const data = await graphPost(this, body(message));

        return {
            message: (<any>this).getById(data.id),
            data,
        };
    }
}
export interface IMessages extends _Messages, IGetById<IMessage> { }
export const Messages = graphInvokableFactory<IMessages>(_Messages);

/**
 * Tab
 */
@defaultPath("tab")
@updateable()
@deleteable()
export class _Tab extends _GraphInstance<ITeamsTabType> { }
export interface ITab extends _Tab, IUpdateable, IDeleteable { }
export const Tab = graphInvokableFactory<ITab>(_Tab);

/**
 * Tabs
 */
@defaultPath("tabs")
@getById(Tab)
export class _Tabs extends _GraphCollection<ITeamsTabType[]> {

    /**
     * Adds a tab to the channel
     * @param name The name of the new Tab
     * @param appUrl The url to an app ex: https://graph.microsoft.com/beta/appCatalogs/teamsApps/12345678-9abc-def0-123456789a
     * @param tabsConfiguration visit https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/api/teamstab_add for reference
     */
    public async add(name: string, appUrl: string, properties: ITeamsTabType): Promise<ITabCreateResult> {

        const postBody = {
            displayName: name,
            "teamsApp@odata.bind": appUrl,
            ...properties,
        };

        const data = await graphPost(this, body(postBody));

        return {
            data,
            tab: (<any>this).getById(data.id),
        };
    }
}
export interface ITabs extends _Tabs, IGetById<ITab> { }
export const Tabs = graphInvokableFactory<ITabs>(_Tabs);

export interface ITeamUpdateResult {
    data: any;
    team: ITeam;
}

export interface IChannelCreateResult {
    data: any;
    channel: IChannel;
}

export interface IMessageCreateResult {
    data: any;
    message: IMessage;
}

export interface ITabCreateResult {
    data: any;
    tab: ITab;
}

export interface ITabUpdateResult {
    data: any;
    tab: ITab;
}

export interface ITeamCreateResultAsync {
    teamId: string;
    operationId: string;
}

export interface ITeamCreateResult {
    data: any;
    team: ITeam;
}

/**
 * InstalledApp
 */
@deleteable()
export class _InstalledApp extends _GraphInstance<ITeamsAppInstallation> {
    public upgrade(): Promise<void> {
        return graphPost(InstalledApp(this, "upgrade"));
    }
}
export interface IInstalledApp extends _InstalledApp, IDeleteable { }
export const InstalledApp = graphInvokableFactory<IInstalledApp>(_InstalledApp);

/**
 * InstalledApps
 */
@defaultPath("installedApps")
@getById(InstalledApp)
export class _InstalledApps extends _GraphCollection<ITeamsAppInstallation[]> {

    /**
     * Adds an installed app to the collection
     * @param teamsAppId The id of the app to add.
     */
    public async add(teamsAppId: string): Promise<IAppAddResult> {

        const data = await graphPost(this, body({
            "teamsApp@odata.bind": teamsAppId,
        }));

        return {
            data,
            app: (<any>this).getById(data.id),
        };
    }

}
export interface IInstalledApps extends _InstalledApps, IGetById<IInstalledApp> { }
export const InstalledApps = graphInvokableFactory<IInstalledApps>(_InstalledApps);

export interface IAppAddResult {
    data: any;
    app: IInstalledApp;
}

export interface IChannelMemberAdd {
    roles: string[];
    user: IUserType;
}

export interface IChannelMemberUpdate {
    roles: string[];
}

export interface IUserAccessRequest {
    tenantId: string;
    userId: string;
    userPrincipalName: string;
}
