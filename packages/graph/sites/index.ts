import { GraphFI } from "../fi.js";
import { Sites, ISites } from "./types.js";

import "./group.js";

export {
    ISites,
    Sites,
    ISite,
    Site,
} from "./types.js";

declare module "../fi" {
    interface GraphFI {
        readonly sites: ISites;
    }
}

Reflect.defineProperty(GraphFI.prototype, "sites", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(Sites);
    },
});
