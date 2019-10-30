import { _GraphQueryable } from "./graphqueryable";
import {
    setup as _setup,
    GraphConfiguration,
} from "./graphlibconfig";
import { GraphBatch } from "./batch";

export class GraphRest extends _GraphQueryable {

    public createBatch(): GraphBatch {
        return new GraphBatch();
    }

    public setup(config: GraphConfiguration) {
        _setup(config);
    }
}

export let graph = new GraphRest("v1.0");
