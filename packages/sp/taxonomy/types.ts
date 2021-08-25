import { isArray } from "@pnp/core";
import { defaultPath } from "../decorators.js";
import { _SPInstance, spInvokableFactory, _SPCollection } from "../sharepointqueryable.js";
import { tag } from "../telemetry.js";

/**
 * Describes a collection of Form objects
 *
 */
@defaultPath("_api/v2.1/termstore")
export class _TermStore extends _SPInstance<ITermStoreInfo> {

    /**
     * Gets the term groups associated with this tenant
     */
    public get groups(): ITermGroups {
        return tag.configure(TermGroups(this), "txts.groups");
    }

    /**
     * Gets the term groups associated with this tenant
     */
    public get sets(): ITermSets {
        return tag.configure(TermSets(this), "txts.sets");
    }
}
export interface ITermStore extends _TermStore { }
export const TermStore = spInvokableFactory<ITermStore>(_TermStore);


@defaultPath("groups")
export class _TermGroups extends _SPCollection<ITermGroupInfo[]> {

    /**
     * Gets a term group by id
     *
     * @param id Id of the term group to access
     */
    public getById(id: string): ITermGroup {
        return tag.configure(TermGroup(this, id), "txtgs.getById");
    }
}
export interface ITermGroups extends _TermGroups { }
export const TermGroups = spInvokableFactory<ITermGroups>(_TermGroups);

export class _TermGroup extends _SPInstance<ITermGroupInfo> {

    /**
     * Gets the term sets associated with this tenant
     */
    public get sets(): ITermSets {
        return tag.configure(TermSets(this, "sets"), "txtg.sets");
    }
}
export interface ITermGroup extends _TermGroup { }
export const TermGroup = spInvokableFactory<ITermGroup>(_TermGroup);


@defaultPath("sets")
export class _TermSets extends _SPCollection<ITermSetInfo[]> {

    /**
     * Gets a term group by id
     *
     * @param id Id of the term group to access
     */
    public getById(id: string): ITermSet {
        return tag.configure(TermSet(this, id), "txts.getById");
    }
}
export interface ITermSets extends _TermSets { }
export const TermSets = spInvokableFactory<ITermSets>(_TermSets);

export class _TermSet extends _SPInstance<ITermSetInfo> {

    /**
     * Gets all the terms in this set
     */
    public get terms(): ITerms {
        return Terms(this);
    }

    public get parentGroup(): ITermGroup {
        return tag.configure(TermGroup(this, "parentGroup"), "txts.parentGroup");
    }

    public get children(): IChildren {
        return tag.configure(Children(this), "txts.children");
    }

    public get relations(): IRelations {
        return tag.configure(Relations(this), "txts.relations");
    }

    public getTermById(id: string): ITerm {
        return tag.configure(Term(this, `terms/${id}`), "txts.getTermById");
    }

    /**
     * Gets all the terms in this termset in an ordered tree using the appropriate sort ordering
     * ** This is an expensive operation and you should strongly consider caching the results **
     */
    public async getAllChildrenAsOrderedTree(): Promise<IOrderedTermInfo[]> {

        const setInfo = await this.select("*", "customSortOrder")();
        const tree: IOrderedTermInfo[] = [];

        const ensureOrder = (terms: IOrderedTermInfo[], sorts: ITermSortOrderInfo[], setSorts?: string[]): IOrderedTermInfo[] => {

            // handle no custom sort information present
            if (!isArray(sorts) && !isArray(setSorts)) {
                return terms;
            }

            let ordering: string[] = null;
            if (sorts === null && setSorts.length > 0) {
                ordering = [...setSorts];
            } else {
                const index = sorts.findIndex(v => v.setId === setInfo.id);
                if (index >= 0) {
                    ordering = [...sorts[index].order];
                }
            }

            if (ordering !== null) {
                const orderedChildren = [];
                ordering.forEach(o => {
                    const found = terms.find(ch => o === ch.id);
                    if (found) {
                        orderedChildren.push(found);
                    }
                });
                // we have a case where if a set is ordered and a term is added to that set
                // AND the ordering information hasn't been updated the new term will not have
                // any associated ordering information. See #1547 which reported this. So here we
                // append any terms remaining in "terms" not in "orderedChildren" to the end of "orderedChildren"
                orderedChildren.push(...terms.filter(info => ordering.indexOf(info.id) < 0));

                return orderedChildren;
            }
            return terms;
        };

        const visitor = async (source: { children: IChildren }, parent: IOrderedTermInfo[]) => {

            const children = await source.children.select("*", "customSortOrder")();

            for (let i = 0; i < children.length; i++) {

                const child = children[i];

                const orderedTerm = {
                    children: <IOrderedTermInfo[]>[],
                    defaultLabel: child.labels.find(l => l.isDefault).name,
                    ...child,
                };

                if (child.childrenCount > 0) {
                    await visitor(this.getTermById(children[i].id), orderedTerm.children);
                    orderedTerm.children = ensureOrder(orderedTerm.children, child.customSortOrder);
                }

                parent.push(orderedTerm);
            }
        };

        await visitor(this, tree);

        return ensureOrder(tree, null, setInfo.customSortOrder);
    }
}
export interface ITermSet extends _TermSet { }
export const TermSet = spInvokableFactory<ITermSet>(_TermSet);

@defaultPath("children")
export class _Children extends _SPCollection<ITermInfo[]> { }
export interface IChildren extends _Children { }
export const Children = spInvokableFactory<IChildren>(_Children);

@defaultPath("terms")
export class _Terms extends _SPCollection<ITermInfo[]> {
    /**
     * Gets a term group by id
     *
     * @param id Id of the term group to access
     */
    public getById(id: string): ITerm {
        return Term(this, id);
    }
}
export interface ITerms extends _Terms { }
export const Terms = spInvokableFactory<ITerms>(_Terms);

export class _Term extends _SPInstance<ITermInfo> {

    public get children(): IChildren {
        return tag.configure(Children(this), "txt.children");
    }

    public get relations(): IRelations {
        return tag.configure(Relations(this), "txt.relations");
    }

    public get set(): ITermSet {
        return tag.configure(TermSet(this, "set"), "txt.set");
    }
}
export interface ITerm extends _Term { }
export const Term = spInvokableFactory<ITerm>(_Term);


@defaultPath("relations")
export class _Relations extends _SPCollection<IRelationInfo[]> {
    /**
     * Gets a term group by id
     *
     * @param id Id of the term group to access
     */
    public getById(id: string): IRelation {
        return tag.configure(Relation(this, id), "txrs.getById");
    }
}
export interface IRelations extends _Relations { }
export const Relations = spInvokableFactory<IRelations>(_Relations);

export class _Relation extends _SPInstance<IRelationInfo> {

    public get fromTerm(): ITerm {
        return tag.configure(Term(this, "fromTerm"), "txr.fromTerm");
    }

    public get toTerm(): ITerm {
        return tag.configure(Term(this, "toTerm"), "txr.toTerm");
    }

    public get set(): ITermSet {
        return tag.configure(TermSet(this, "set"), "txr.set");
    }
}
export interface IRelation extends _Relation { }
export const Relation = spInvokableFactory<IRelation>(_Relation);

export interface ITermStoreInfo {
    id: string;
    name: string;
    defaultLanguageTag: string;
    languageTags: string[];
    administrators?: ITaxonomyUserInfo;
}

export interface ITermGroupInfo {
    id: string;
    description: string;
    name: string;
    displayName: string;
    createdDateTime: string;
    lastModifiedDateTime: string;
    type: string;
    scope: "global" | "system" | "siteCollection";
}

export interface ITermSetInfo {
    id: string;
    localizedNames: { name: string; languageTag: string }[];
    description: string;
    createdDateTime: string;
    customSortOrder: string[];
    properties?: ITaxonomyProperty[];
    childrenCount: number;
    groupId: string;
    isOpen: boolean;
    isAvailableForTagging: boolean;
    contact: string;
}

export interface ITermInfo {
    childrenCount: number;
    id: string;
    labels: { name: string; isDefault: boolean; languageTag: string }[];
    createdDateTime: string;
    customSortOrder: ITermSortOrderInfo[];
    lastModifiedDateTime: string;
    descriptions: { description: string; languageTag: string }[];
    properties: ITaxonomyProperty[];
    localProperties: ITaxonomyProperty[];
    isDeprecated: boolean;
    isAvailableForTagging: { setId: string; isAvailable: boolean }[];
    topicRequested: boolean;
    parent?: ITermInfo;
}

export interface ITermSortOrderInfo {
    setId: string;
    order: string[];
}

export interface IOrderedTermInfo extends ITermInfo {
    children: IOrderedTermInfo[];
    defaultLabel: string;
}

export interface IRelationInfo {
    id: string;
    relationType: string;
}

export interface ITaxonomyUserInfo {
    user: {
        displayName: string;
        email: string;
        id: string;
    };
}

export interface ITaxonomyProperty {
    key: string;
    value: string;
}
