import { _GraphQueryable } from "./graphqueryable";
import {
    setup as _setup,
    IGraphConfiguration,
} from "./graphlibconfig";
import { GraphBatch } from "./batch";
import { ISPFXContext } from "@pnp/common";

export class GraphRest extends _GraphQueryable {

    public createBatch(): GraphBatch {
        return new GraphBatch();
    }

    public setup(config: IGraphConfiguration | ISPFXContext) {

        if ((<ISPFXContext>config).pageContext) {
            _setup({
                spfxContext: <ISPFXContext>config,
            });
        } else {
            _setup(<IGraphConfiguration>config);
        }
    }
}

export let graph = new GraphRest("v1.0");
