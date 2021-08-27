import { SPRest2 } from "../rest-2.js";
import { ITermStore, TermStore } from "./types.js";

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
    IOrderedTermInfo,
    ITermSortOrderInfo,
    ITerms,
    Terms,
} from "./types.js";

declare module "../rest-2" {
    interface SPRest2 {
        readonly termStore: ITermStore;
    }
}

Reflect.defineProperty(SPRest2.prototype, "termStore", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest2) {
        return this.create(TermStore);
    },
});
