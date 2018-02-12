import {
    setup as _setup,
    TeamsConfiguration,
} from "./config/teamslibconfig";

import {
    graph,
    GroupType,
    GroupAddResult,
} from "@pnp/graph";

import {
    Team,
} from "./team";

export class TeamsRest {

    /**
     * Creates a new team with the given information
     */
    public create(name: string, description?: string): Promise<Team> {


        return graph.groups.add(name, name, GroupType.Office365).then((gar: GroupAddResult) => {

            return gar.group.createTeam().then(t => {

                return new Team("");
            });
        });
    }

    public setup(config: TeamsConfiguration) {
        _setup(config);
    }
}

export const teams = new TeamsRest();
