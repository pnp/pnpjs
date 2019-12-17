import { GraphQueryable } from "./graphqueryable";
import {
    setup as _setup,
    GraphConfiguration,
} from "./config/graphlibconfig";

import { Groups } from "./groups";
import { Teams } from "./teams";
import { Users, User } from "./users";
import { Planner, IPlannerMethods } from "./planner";
import { GraphBatch } from "./batch";
import { DirectoryObjects } from "./directoryobjects";
import { Invitations, IInvitationsMethods } from "./invitations";
import { Subscriptions } from "./subscriptions";
import { ISecurityMethods, Security } from "./security";
import { ISitesMethods, Sites } from "./sites";

export class GraphRest extends GraphQueryable {

    constructor(baseUrl: string | GraphQueryable, path?: string) {
        super(baseUrl, path);
    }

    public get directoryObjects(): DirectoryObjects {
        return new DirectoryObjects(this);
    }

    public get groups(): Groups {
        return new Groups(this);
    }

    public get teams(): Teams {
        return new Teams(this);
    }

    public get me(): User {
        return new User(this, "me");
    }

    public get planner(): IPlannerMethods {
        return new Planner(this);
    }

    public get users(): Users {
        return new Users(this);
    }

    public get invitations(): IInvitationsMethods {
        return new Invitations(this);
    }

    public get subscriptions(): Subscriptions {
        return new Subscriptions(this);
    }

    public createBatch(): GraphBatch {
        return new GraphBatch();
    }

    public setup(config: GraphConfiguration) {
        _setup(config);
    }

    public get security(): ISecurityMethods {
        return new Security(this);
    }

    public get sites(): ISitesMethods {
        return new Sites(this);
    }

}

export let graph = new GraphRest("v1.0");
