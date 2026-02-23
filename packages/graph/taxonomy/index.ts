import { GraphFI } from "../fi.js";
import { ITermStore, TermStore } from "./types.js";
import { Endpoint } from "../behaviors/endpoint.js";

import "./sites.js";

export {
    ITermStore,
    TermStore,
    ITermGroup,
    ITermGroups,
    ITermSets,
    TermGroup,
    TermGroups,
    TermSets,
    ITermSet,
    TermSet,
    ITerms,
    Terms,
    ITerm,
    Term,
    Relations,
    IRelations,
    Children,
    IChildren,
} from "./types.js";

declare module "../fi" {
    interface GraphFI {
        readonly termStore: ITermStore;
    }
}

Reflect.defineProperty(GraphFI.prototype, "termStore", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(TermStore, "termStore").using(Endpoint("beta"));
    },
});
