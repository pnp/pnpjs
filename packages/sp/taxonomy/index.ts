import { SPRest } from "../rest";
import { ITermStore, TermStore } from "./types";

export {
    ITermStore,
    TermStore,
    ITaxonomyUserInfo,
    ITermGroup,
    ITermGroupInfo,
    ITermGroups,
    ITermSetInfo,
    ITermSets,
    ITermStoreInfo,
    TermGroup,
    TermGroups,
    TermSets,
    ITaxonomyProperty,
    ITermInfo,
    ITermSet,
    TermSet,
    IRelation,
    IRelationInfo,
    IRelations,
    ITerm,
    Relation,
    Relations,
    Term,
    Children,
    IChildren,
} from "./types";

declare module "../rest" {
    interface SPRest {
        readonly termStore: ITermStore;
    }
}

Reflect.defineProperty(SPRest.prototype, "termStore", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return TermStore(this._baseUrl).configure(this._options);
    },
});
