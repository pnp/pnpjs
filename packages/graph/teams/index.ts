import { addProp, body } from "@pnp/queryable";
import { GraphFI } from "../fi.js";
import { _Group, Group } from "../groups/types.js";
import { ITeamCreateResult, ITeam, Team, ITeams, Teams } from "./types.js";
import { Team as ITeamType } from "@microsoft/microsoft-graph-types";
import { graphPut } from "../operations.js";

import "./users.js";

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
    ITeam,
    ITeamCreateResult,
    ITeamCreateResultAsync,
    ITeamUpdateResult,
    ITeams,
    Tab,
    Tabs,
    Team,
    Teams,
} from "./types.js";

// ITeamProperties, ITabsConfiguration,

declare module "../groups/types" {
    interface _Group {
        readonly team: ITeam;
        createTeam(properties: ITeamType): Promise<ITeamCreateResult>;
    }
    interface IGroup {
        readonly team: ITeam;
        createTeam(properties: ITeamType): Promise<ITeamCreateResult>;
    }
}

addProp(_Group, "team", Team);

_Group.prototype.createTeam = async function (this: _Group, props: ITeamType): Promise<ITeamCreateResult> {

    const data = await graphPut(Group(this, "team"), body(props));

    return {
        data,
        team: this.team,
    };
};

declare module "../fi" {
    interface GraphFI {
        readonly teams: ITeams;
    }
}

Reflect.defineProperty(GraphFI.prototype, "teams", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(Teams);
    },
});
