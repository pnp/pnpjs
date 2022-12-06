import { SPFI } from "../fi.js";
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
    // IRelation,
    IRelationInfo,
    IRelations,
    ITerm,
    // Relation,
    Relations,
    Term,
    Children,
    IChildren,
    IOrderedTermInfo,
    ITermSortOrderInfo,
    ITerms,
    Terms,
    IGetOrderedTreeProps,
    ITaxonomyLocalProperty,
} from "./types.js";

declare module "../fi" {
    interface SPFI {
        readonly termStore: ITermStore;
    }
}

Reflect.defineProperty(SPFI.prototype, "termStore", {
    configurable: true,
    enumerable: true,
    get: function (this: SPFI) {
        return this.create(TermStore);
    },
});
