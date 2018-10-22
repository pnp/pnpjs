import { graph } from "./rest";
import { Group, GroupType, GroupAddResult } from "./groups";
import { GraphQueryableInstance, defaultPath } from "./graphqueryable";
import { GraphEndpoints, TeamProperties } from "./types";
import { ODataParser, ODataDefaultParser } from "@pnp/odata";
import { FetchOptions, jsS } from "@pnp/common";

export class Teams {

    /**
     * Creates a new team and associated Group with the given information
     */
    public create(name: string, description = "", teamProperties: TeamProperties = {}): Promise<TeamCreateResult> {

        const groupProps = description && description.length > 0 ? { description: description } : {};

        return graph.groups.add(name, name, GroupType.Office365, groupProps).then((gar: GroupAddResult) => {
            return gar.group.createTeam(teamProperties).then(data => {
                return {
                    data: data,
                    group: gar.group,
                    team: new Team(gar.group),
                };
            });
        });
    }
}

/**
 * Represents a Microsoft Team
 */
@defaultPath("team")
export class Team extends GraphQueryableInstance<TeamProperties> {
    /**
     * Updates this team instance's properties
     * 
     * @param properties The set of properties to update
     */
    // TODO:: update properties to be typed once type is available in graph-types
    public update(properties: TeamProperties): Promise<TeamUpdateResult> {

        return this.clone(Team, "").setEndpoint(GraphEndpoints.Beta).patchCore({
            body: jsS(properties),
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
        return this.clone(Team, "").setEndpoint(GraphEndpoints.Beta).getCore(parser, options);
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
