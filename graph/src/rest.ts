import { GraphQueryable } from "./graphqueryable";
import {
    setup as _setup,
    GraphConfiguration,
} from "./config/graphlibconfig";

import { Groups } from "./groups";
import { Me } from "./me";
import { Teams } from "./teams";
import { Users } from "./users";
import { Planner, IPlannerMethods } from "./planner";
import { GraphBatch } from "./batch";

export class GraphRest extends GraphQueryable {

    constructor(baseUrl: string | GraphQueryable, path?: string) {
        super(baseUrl, path);
    }

    public get groups(): Groups {
        return new Groups(this);
    }

    public get teams(): Teams {
        return new Teams();
    }

    public get me(): Me {
        return new Me(this);
    }

    public get planner(): IPlannerMethods {
        return new Planner(this);
    }

    public get users(): Users {
        return new Users(this);
    }

    public createBatch(): GraphBatch {
        return new GraphBatch();
    }

    public setup(config: GraphConfiguration) {
        _setup(config);
    }
}

export let graph = new GraphRest("v1.0");
