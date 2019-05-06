import { _GraphQueryableInstance, IGraphQueryableInstance, IGraphQueryableCollection, _GraphQueryableCollection, graphInvokableFactory } from "../graphqueryable";
import { IGetable, body } from "@pnp/odata";
import { extend } from "@pnp/common";
import { updateable, IUpdateable, getById, IGetById, deleteable, IDeleteable } from "../decorators";
import { graphPost } from "../operations";
import { defaultPath } from "../decorators";

/**
 * Represents a Microsoft Team
 */
@defaultPath("team")
@updateable()
export class _Team extends _GraphQueryableInstance<ITeamProperties> implements ITeam {

    public get channels(): IChannels {
        return Channels(this);
    }

    /**
     * Archives this Team
     * 
     * @param shouldSetSpoSiteReadOnlyForMembers Should members have Read-only in associated Team Site
     */
    public archive(shouldSetSpoSiteReadOnlyForMembers = false): Promise<void> {
        return graphPost(this.clone(Team, "archive"), body({ shouldSetSpoSiteReadOnlyForMembers }));
    }

    /**
    * Unarchives this Team
    */
    public unarchive(): Promise<void> {
        return graphPost(this.clone(Team, "unarchive"));
    }

    /**
     * Clones this Team
     * @param name The name of the new Group
     * @param description Optional description of the group
     * @param partsToClone Parts to clone ex: apps,tabs,settings,channels,members
     * @param visibility Set visibility to public or private 
     */
    public cloneTeam(name: string, description = "", partsToClone = "apps,tabs,settings,channels,members", visibility: "public" | "private" = "private"): Promise<void> {

        const postBody = {
            description: description ? description : "",
            displayName: name,
            mailNickname: name,
            partsToClone,
            visibility,
        };

        // TODO:: we need to get the Location header from the response and return an operation
        // instance that folks can query to see if/when this is complete
        // it could just have a single method getResult (or whatever) that returns a promise that
        // resolves when the operation is successful or rejects when it is not
        return graphPost(this.clone(Team, "clone"), body(postBody));
    }
}
export interface ITeam extends IGetable, IUpdateable<ITeamProperties>, IGraphQueryableInstance<ITeamProperties> {
    readonly channels: IChannels;
    archive(shouldSetSpoSiteReadOnlyForMembers?: boolean): Promise<void>;
    unarchive(): Promise<void>;
    cloneTeam(name: string, description?: string, partsToClone?: string, visibility?: string): Promise<void>;
}
export interface _Team extends IGetable, IUpdateable<ITeamProperties> { }
export const Team = graphInvokableFactory<ITeam>(_Team);

/**
 * Teams
 */
@defaultPath("teams")
@getById(Team)
export class _Teams extends _GraphQueryableCollection<ITeamProperties[]> implements ITeams { }
export interface ITeams extends IGetable, IGetById<ITeam>, IGraphQueryableCollection<ITeamProperties[]> {
}
export interface _Teams extends IGetable, IGetById<ITeam> { }
export const Teams = graphInvokableFactory<ITeams>(_Teams);

/**
 * Channel
 */
export class _Channel extends _GraphQueryableInstance implements IChannel {
    public get tabs(): ITabs {
        return Tabs(this);
    }
}
export interface IChannel extends IGetable, IGraphQueryableInstance {
    readonly tabs: ITabs;
}
export interface _Channel extends IGetable { }
export const Channel = graphInvokableFactory<IChannel>(_Channel);

/**
 * Channels
 */
@defaultPath("channels")
@getById(Channel)
export class _Channels extends _GraphQueryableCollection implements IChannels {

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
            channel: this.getById(data.id),
            data,
        };
    }
}
export interface IChannels extends IGetable, IGetById<IChannel>, IGraphQueryableCollection { }
export interface _Channels extends IGetable, IGetById<IChannel> { }
export const Channels = graphInvokableFactory<IChannels>(_Channels);

/**
 * Tab
 */
@defaultPath("tab")
@updateable()
@deleteable()
export class _Tab extends _GraphQueryableInstance implements ITab { }
export interface ITab extends IGetable, IUpdateable, IDeleteable, IGraphQueryableInstance { }
export interface _Tab extends IGetable, IUpdateable, IDeleteable { }
export const Tab = graphInvokableFactory<ITab>(_Tab);

/**
 * Tabs
 */
@defaultPath("tabs")
@getById(Tab)
export class _Tabs extends _GraphQueryableCollection implements ITabs {

    /**
     * Adds a tab to the cahnnel
     * @param name The name of the new Tab
     * @param appUrl The url to an app ex: https://graph.microsoft.com/beta/appCatalogs/teamsApps/12345678-9abc-def0-123456789a
     * @param tabsConfiguration visit https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/api/teamstab_add for reference
     */
    public async add(name: string, appUrl: string, properties: ITabsConfiguration): Promise<ITabCreateResult> {

        const postBody = extend({
            name,
            "teamsApp@odata.bind": appUrl,
        }, properties);

        const data = await graphPost(this, body(postBody));

        return {
            data,
            tab: this.getById(data.id),
        };
    }
}
export interface ITabs extends IGetable, IGetById<ITab>, IGraphQueryableCollection { }
export interface _Tabs extends IGetable, IGetById<ITab> { }
export const Tabs = graphInvokableFactory<ITabs>(_Tabs);

export interface ITeamUpdateResult {
    data: any;
    team: ITeam;
}



export interface IChannelCreateResult {
    data: any;
    channel: IChannel;
}

export interface ITabCreateResult {
    data: any;
    tab: ITab;
}

export interface ITabUpdateResult {
    data: any;
    tab: ITab;
}

/**
 * Defines the properties for a Team
 * 
 * TODO:: remove this once typings are present in graph types package
 */
export interface ITeamProperties {

    memberSettings?: {
        "allowCreateUpdateChannels"?: boolean;
        "allowDeleteChannels"?: boolean;
        "allowAddRemoveApps"?: boolean;
        "allowCreateUpdateRemoveTabs"?: boolean;
        "allowCreateUpdateRemoveConnectors"?: boolean;
    };

    guestSettings?: {
        "allowCreateUpdateChannels"?: boolean;
        "allowDeleteChannels"?: boolean;
    };

    messagingSettings?: {
        "allowUserEditMessages"?: boolean;
        "allowUserDeleteMessages"?: boolean;
        "allowOwnerDeleteMessages"?: boolean;
        "allowTeamMentions"?: boolean;
        "allowChannelMentions"?: boolean;
    };

    funSettings?: {
        "allowGiphy"?: boolean;
        "giphyContentRating"?: "strict" | string,
        "allowStickersAndMemes"?: boolean;
        "allowCustomMemes"?: boolean;
    };
}

export interface ITabsConfiguration {
    configuration: {
        "entityId": string;
        "contentUrl": string;
        "websiteUrl": string;
        "removeUrl": string;
    };
}

export interface ITeamCreateResult {
    data: any;
    team: ITeam;
}
