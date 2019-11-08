import { graph } from "./rest";
import { Group, GroupType, GroupAddResult } from "./groups";
import { GraphQueryableInstance, defaultPath, GraphQueryableCollection } from "./graphqueryable";
import { TeamProperties, TabsConfiguration } from "./types";
import { ODataParser, ODataDefaultParser } from "@pnp/odata";
import { FetchOptions, jsS, extend, TypedHash } from "@pnp/common";

@defaultPath("teams")
export class Teams extends GraphQueryableCollection {

    /**
     * Creates a new team and associated Group with the given information
     * @param name The name of the new Group
     * @param mailNickname The email alias for the group
     * @param description Optional description of the group
     * @param ownerId Add an owner with a user id from the graph
     */
    public create(name: string, mailNickname: string, description = "", ownerId: string, teamProperties: TeamProperties = {}): Promise<TeamCreateResult> {

        const groupProps = {
            "description": description && description.length > 0 ? description : "",
            "owners@odata.bind": [
                `https://graph.microsoft.com/v1.0/users/${ownerId}`,
            ],
        };

        return graph.groups.add(name, mailNickname, GroupType.Office365, groupProps).then((gar: GroupAddResult) => {
            return gar.group.createTeam(teamProperties).then(data => {
                return {
                    data: data,
                    group: gar.group,
                    team: new Team(gar.group),
                };
            });
        });
    }

    public getById(id: string): Team {
        return new Team(this, id);
    }

}

/**
 * Represents a Microsoft Team
 */
@defaultPath("team")
export class Team extends GraphQueryableInstance<TeamProperties> {

    public get channels(): Channels {
        return new Channels(this);
    }

    public get installedApps(): Apps {
        return new Apps(this);
    }

    /**
     * Updates this team instance's properties
     * 
     * @param properties The set of properties to update
     */
    // TODO:: update properties to be typed once type is available in graph-types
    public update(properties: TeamProperties): Promise<TeamUpdateResult> {

        return this.clone(Team, "").patchCore({
            body: jsS(properties),
        }).then(data => {
            return {
                data: data,
                team: this,
            };
        });
    }

    /**
     * Archives this Team
     * 
     * @param shouldSetSpoSiteReadOnlyForMembers Should members have Read-only in associated Team Site
     */
    // TODO:: update properties to be typed once type is available in graph-types
    public archive(shouldSetSpoSiteReadOnlyForMembers?: boolean): Promise<TeamUpdateResult> {

        let postBody;

        if (shouldSetSpoSiteReadOnlyForMembers != null) {
            postBody = extend(postBody, {
                shouldSetSpoSiteReadOnlyForMembers: shouldSetSpoSiteReadOnlyForMembers,
            });
        }
        return this.clone(Team, "archive").postCore({
            body: jsS(postBody),
        }).then(data => {
            return {
                data: data,
                team: this,
            };
        });
    }

    /**
    * Unarchives this Team
    * 
    */
    // TODO:: update properties to be typed once type is available in graph-types
    public unarchive(): Promise<TeamUpdateResult> {

        return this.clone(Team, "unarchive").postCore({
        }).then(data => {
            return {
                data: data,
                team: this,
            };
        });
    }

    /**
     * Clones this Team
     * @param name The name of the new Group
     * @param mailNickname The email alias for the group
     * @param description Optional description of the group
     * @param partsToClone Parts to clone ex: apps,tabs,settings,channels,members
     * @param visibility Set visibility to public or private 
     */
    // TODO:: update properties to be typed once type is available in graph-types
    public cloneTeam(name: string, mailNickname: string, description = "", partsToClone: string, visibility: string): Promise<TeamUpdateResult> {

        const postBody = {
            description: description ? description : "",
            displayName: name,
            mailNickname: mailNickname,
            partsToClone: partsToClone,
            visibility: visibility,
        };

        return this.clone(Team, "clone").postCore({
            body: jsS(postBody),
        }).then(data => {
            return {
                data: data,
                team: this,
            };
        });
    }

    /**
     * Executes the currently built request
     *
     * @param parser Allows you to specify a parser to handle the result
     * @param getOptions The options used for this request
     */
    public get<T = TeamProperties>(parser: ODataParser<T> = new ODataDefaultParser(), options: FetchOptions = {}): Promise<T> {
        return this.clone(Team, "").getCore(parser, options);
    }
}

@defaultPath("channels")
export class Channels extends GraphQueryableCollection {

    /**
     * Creates a new Channel in the Team
     * @param name The display name of the new channel
     * @param description Optional description of the channel
     * 
     */
    public create(name: string, description = ""): Promise<ChannelCreateResult> {

        const postBody = {
            description: description && description.length > 0 ? description : "",
            displayName: name,
        };

        return this.postCore({
            body: jsS(postBody),
        }).then(r => {
            return {
                channel: this.getById(r.id),
                data: r,
            };
        });
    }

    public getById(id: string): Channel {
        return new Channel(this, id);
    }

}

export class Channel extends GraphQueryableInstance {
    public get tabs(): Tabs {
        return new Tabs(this);
    }
}

@defaultPath("installedApps")
export class Apps extends GraphQueryableCollection {

    /**
     * Creates a new App in the Team
     * @param appUrl The url to an app ex: https://graph.microsoft.com/beta/appCatalogs/teamsApps/12345678-9abc-def0-123456789a
     * 
     */
    public add(appUrl: string): Promise<any> {

        const postBody = {
            "teamsApp@odata.bind": appUrl,
        };

        return this.postCore({
            body: jsS(postBody),
        }).then(r => {
            return {
                data: r,
            };
        });
    }

    /**
     * Deletes this app
     */
    public remove(): Promise<void> {
        return this.deleteCore();
    }
}

@defaultPath("tabs")
export class Tabs extends GraphQueryableCollection {

    /**
     * Adds a tab to the cahnnel
     * @param name The name of the new Tab
     * @param appUrl The url to an app ex: https://graph.microsoft.com/beta/appCatalogs/teamsApps/12345678-9abc-def0-123456789a
     * @param tabsConfiguration visit https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/api/teamstab_add for reference
     */
    public add(name: string, appUrl: string, properties: TabsConfiguration): Promise<TabCreateResult> {

        const postBody = extend({
            name: name,
            "teamsApp@odata.bind": appUrl,
        }, properties);

        return this.postCore({
            body: jsS(postBody),
        }).then(r => {
            return {
                data: r,
                tab: this.getById(r.id),
            };
        });

    }

    public getById(id: string): Tab {
        return new Tab(this, id);
    }

}

/**
 * Represents a Microsoft Team
 */
@defaultPath("tab")
export class Tab extends GraphQueryableInstance<TeamProperties> {

    /**
     * Updates this tab
     * 
     * @param properties The set of properties to update
     */
    // TODO:: update properties to be typed once type is available in graph-types
    public update(properties: TypedHash<string | number | boolean | string[]>): Promise<TabUpdateResult> {

        return this.clone(Tab, "").patchCore({
            body: jsS(properties),
        }).then(data => {
            return {
                data: data,
                tab: this,
            };
        });
    }

    /**
     * Deletes this tab
     */
    public remove(): Promise<void> {
        return this.deleteCore();
    }
}

export interface TeamUpdateResult {
    data: any;
    team: Team;
}

export interface TeamCreateResult {
    data: any;
    group: Group;
    team: Team;
}

export interface ChannelCreateResult {
    data: any;
    channel: Channel;
}

export interface TabCreateResult {
    data: any;
    tab: Tab;
}

export interface TabUpdateResult {
    data: any;
    tab: Tab;
}
