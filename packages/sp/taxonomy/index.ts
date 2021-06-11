import { SPRest } from "../rest.js";
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
    IGetOrderedTreeProps,
    ITaxonomyLocalProperty,
} from "./types.js";

declare module "../rest" {
    interface SPRest {
        readonly termStore: ITermStore;
    }
}

Reflect.defineProperty(SPRest.prototype, "termStore", {
    configurable: true,
    enumerable: true,
    get: function (this: SPRest) {
        return this.childConfigHook(({ options, baseUrl, runtime }) => {
            return TermStore(baseUrl).configure(options).setRuntime(runtime);
        });
    },
});
