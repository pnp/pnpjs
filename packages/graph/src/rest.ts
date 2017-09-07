import { V1 } from "./v1";
import {
    setup as _setup,
    GraphConfiguration,
} from "./config/graphlibconfig";

export class GraphRest {

    public get v1(): V1 {
        return new V1("");
    }

    public setup(config: GraphConfiguration) {
        _setup(config);
    }
}

export let graph = new GraphRest();
