import { _GraphQueryableInstance, _GraphQueryableCollection, graphInvokableFactory, GraphQueryableInstance } from "../graphqueryable.js";
import { body, HeaderParse } from "@pnp/queryable";
import { updateable, IUpdateable, getById, IGetById, deleteable, IDeleteable } from "../decorators.js";
import { graphPost } from "../operations.js";
import { defaultPath } from "../decorators.js";
import {
    Team as ITeamType,
    TeamsAsyncOperation as ITeamsAsyncOperation,
    TeamsTab as ITeamsTabType,
    TeamsAppInstallation as ITeamsAppInstallation,
    ChatMessage as IChatMessage,
} from "@microsoft/microsoft-graph-types";

/**
 * Represents a Microsoft Team
 */
@defaultPath("team")
@updateable()
export class _Team extends _GraphQueryableInstance<ITeamType> {

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
        return GraphQueryableInstance(this, `operations/${id}`)();
    }
}
export interface ITeam extends _Team, IUpdateable<ITeamType> { }
export const Team = graphInvokableFactory<ITeam>(_Team);

/**
 * Teams
 */
@defaultPath("teams")
@getById(Team)
export class _Teams extends _GraphQueryableCollection<ITeamType[]> {
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
 * Channel
 */
export class _Channel extends _GraphQueryableInstance<IChannel> {
    public get tabs(): ITabs {
        return Tabs(this);
    }

    public get messages(): IMessages {
        return Messages(this);
    }
}
export interface IChannel extends _Channel { }
export const Channel = graphInvokableFactory<IChannel>(_Channel);

/**
 * Channels
 */
@defaultPath("channels")
@getById(Channel)
export class _Channels extends _GraphQueryableCollection<IChannel[]> {

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
}
export interface IChannels extends _Channels, IGetById<IChannel> { }
export const Channels = graphInvokableFactory<IChannels>(_Channels);

/**
 * Channel
 */
export class _Message extends _GraphQueryableInstance<IChatMessage> { }
export interface IMessage extends _Message { }
export const Message = graphInvokableFactory<IMessage>(_Message);

/**
 * Channels
 */
@defaultPath("messages")
@getById(Message)
export class _Messages extends _GraphQueryableCollection<IChatMessage[]> {

    /**
     * Creates a new Channel in the Team
     * @param displayName The display name of the new channel
     * @param description Optional description of the channel
     *
     */
    public async add(displayName: string, description = ""): Promise<IMessageCreateResult> {

        const postBody = {
            description,
            displayName,
        };

        const data = await graphPost(this, body(postBody));

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
export class _Tab extends _GraphQueryableInstance { }
export interface ITab extends _Tab, IUpdateable, IDeleteable { }
export const Tab = graphInvokableFactory<ITab>(_Tab);

/**
 * Tabs
 */
@defaultPath("tabs")
@getById(Tab)
export class _Tabs extends _GraphQueryableCollection {

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
export class _InstalledApp extends _GraphQueryableInstance<ITeamsAppInstallation> {
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
export class _InstalledApps extends _GraphQueryableCollection<ITeamsAppInstallation[]> {

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
