import { addProp, body } from "@pnp/odata";
import { GraphRest } from "../rest.js";
import { _Group, Group } from "../groups/types.js";
import { ITeamCreateResult, ITeamProperties, ITeam, Team, ITeams, Teams } from "./types.js";
import { graphPut } from "../operations.js";

import "./users";

export {
    Channel,
    Channels,
    IChannel,
    IChannelCreateResult,
    IChannels,
    ITab,
    ITabCreateResult,
    ITabUpdateResult,
    ITabs,
    ITabsConfiguration,
    ITeam,
    ITeamCreateResult,
    ITeamProperties,
    ITeamUpdateResult,
    ITeams,
    Tab,
    Tabs,
    Team,
    Teams,
} from "./types.js";

declare module "../groups/types" {
    interface _Group {
        readonly team: ITeam;
        createTeam(properties: ITeamProperties): Promise<ITeamCreateResult>;
    }
    interface IGroup {
        readonly team: ITeam;
        createTeam(properties: ITeamProperties): Promise<ITeamCreateResult>;
    }
}

addProp(_Group, "team", Team);

_Group.prototype.createTeam = async function (this: _Group, props: ITeamProperties): Promise<ITeamCreateResult> {

    const data = await graphPut(this.clone(Group, "team"), body(props));

    return {
        data,
        team: this.team,
    };
};

declare module "../rest" {
    interface GraphRest {
        readonly teams: ITeams;
    }
}

Reflect.defineProperty(GraphRest.prototype, "teams", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphRest) {
        return this.childConfigHook(({ options, baseUrl, runtime }) => {
            return Teams(baseUrl).configure(options).setRuntime(runtime);
        });
    },
});
