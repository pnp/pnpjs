import { addProp, body } from "@pnp/odata";
import { GraphRest } from "../rest";
import { _Group, Group } from "../groups/types";
import { ITeamCreateResult, ITeamProperties, ITeam, Team, ITeams, Teams } from "./types";
import { graphPut } from "../operations";

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
} from "./types";

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
        return Teams(this);
    },
});
