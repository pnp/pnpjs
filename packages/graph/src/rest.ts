import { GraphQueryable } from "./graphqueryable";
import {
    setup as _setup,
    GraphConfiguration,
} from "./config/graphlibconfig";

import { Groups } from "./groups";
import { Me } from "./me";

export class GraphRest extends GraphQueryable {

    constructor(baseUrl: string | GraphQueryable, path?: string) {
        super(baseUrl, path);
    }

    public get groups(): Groups {
        return new Groups(this);
    }

    public get me(): Me {
        return new Me(this);
    }

    public setup(config: GraphConfiguration) {
        _setup(config);
    }
}

export let graph = new GraphRest("v1.0");
