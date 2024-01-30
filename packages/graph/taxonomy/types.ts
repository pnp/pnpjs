import { IAddable, IDeleteable, IGetById, IUpdateable, addable, defaultPath, deleteable, getById, updateable } from "../../graph/decorators.js";
import { _GraphInstance, graphInvokableFactory, _GraphCollection } from "../graphqueryable.js";
import { TermStore as ITermStoreType } from "@microsoft/microsoft-graph-types";
import { createBatch } from "@pnp/graph/batching";

/**
 * Describes a collection of Form objects
 *
 */
@defaultPath("termstore")
@updateable()
export class _TermStore extends _GraphInstance<ITermStoreType.Store> {

    /**
     * Gets the term groups associated with this tenant
     */
    public get groups(): ITermGroups {
        return TermGroups(this);
    }

    /**
     * Gets the term sets associated with this tenant
     */
    public get sets(): ITermSets {
        return TermSets(this);
    }
}

export interface ITermStore extends _TermStore, IUpdateable<Partial<Pick<ITermStoreType.Store, "defaultLanguageTag" | "languageTags">>> { }
export const TermStore = graphInvokableFactory<ITermStore>(_TermStore);

@deleteable()
export class _TermGroup extends _GraphInstance<ITermStoreType.Group> {

    /**
     * Gets the term sets associated with this tenant
     */
    public get sets(): ITermSets {
        return TermSets(this, "sets");
    }
}
export interface ITermGroup extends _TermGroup, IDeleteable { }
export const TermGroup = graphInvokableFactory<ITermGroup>(_TermGroup);


@defaultPath("groups")
@getById(TermGroup)
@addable()
export class _TermGroups extends _GraphCollection<ITermStoreType.Group[]> { }
export interface ITermGroups extends _TermGroups, IAddable<ITermStoreType.Group>, IGetById<ITermGroup> { }
export const TermGroups = graphInvokableFactory<ITermGroups>(_TermGroups);

@deleteable()
@updateable()
export class _TermSet extends _GraphInstance<ITermStoreType.Set> {

    /**
     * Gets all the terms in this set
     */
    public get terms(): ITerms {
        return Terms(this);
    }

    public get parentGroup(): ITermGroup {
        return TermGroup(this, "parentGroup");
    }

    public get children(): IChildren {
        return Children(this);
    }

    public get relations(): IRelations {
        return Relations(this);
    }

    public getTermById(id: string): ITerm {
        return Term(this, `terms/${id}`);
    }

    /**
     * Gets all the direct children of the current termset as a tree, however is not ordered based on the SP sorting info
     *
     * @returns Array of children for this item
     */
    public async getAllChildrenAsTree(): Promise<IOrderedTermInfo[]> {

        const visitor = async (source: { children(): Promise<ITermStoreType.Term[]> }, parent: IOrderedTermInfo[]) => {

            const children = await source.children();

            for (let i = 0; i < children.length; i++) {

                const child = children[i];

                const orderedTerm: Partial<IOrderedTermInfo> = {
                    children: <IOrderedTermInfo[]>[],
                    defaultLabel: child.labels.find(l => l.isDefault).name,
                    ...child,
                };

                parent.push(<any>orderedTerm);

                await visitor(this.getTermById(child.id), <any>orderedTerm.children);
            }
        };

        const tree: IOrderedTermInfo[] = [];

        await visitor(this, tree);

        return tree;
    }
}
export interface ITermSet extends _TermSet, IUpdateable<ITermStoreType.Set>, IDeleteable { }
export const TermSet = graphInvokableFactory<ITermSet>(_TermSet);

@defaultPath("sets")
@getById(TermSet)
@addable()
export class _TermSets extends _GraphCollection<ITermStoreType.Set[]> { }
export interface ITermSets extends _TermSets, IAddable<Partial<ITermStoreType.Set>>, IGetById<ITermSet> { }
export const TermSets = graphInvokableFactory<ITermSets>(_TermSets);

@defaultPath("children")
@addable()
export class _Children extends _GraphCollection<ITermStoreType.Term[]> { }
export interface IChildren extends _Children, IAddable<Pick<ITermStoreType.Term, "labels">> { }
export const Children = graphInvokableFactory<IChildren>(_Children);

@updateable()
@deleteable()
export class _Term extends _GraphInstance<ITermStoreType.Term> {

    public get children(): IChildren {
        return Children(this);
    }

    public get relations(): IRelations {
        return Relations(this);
    }

    public get set(): ITermSet {
        return TermSet(this, "set");
    }
}
export interface ITerm extends _Term, IUpdateable<Partial<Pick<ITermStoreType.Term, "labels" | "descriptions" | "properties">>>, IDeleteable { }
export const Term = graphInvokableFactory<ITerm>(_Term);

@defaultPath("terms")
@getById(Term)
export class _Terms extends _GraphCollection<ITermStoreType.Term[]> { }
export interface ITerms extends _Terms, IGetById<ITerm> { }
export const Terms = graphInvokableFactory<ITerms>(_Terms);

@defaultPath("relations")
@addable()
export class _Relations extends _GraphCollection<ITermStoreType.Relation[]> { }
export interface IRelations extends _Relations, IAddable<Omit<ITermStoreType.Relation, "id">> { }
export const Relations = graphInvokableFactory<IRelations>(_Relations);

export interface IOrderedTermInfo extends ITermStoreType.Term {
    children: ITermStoreType.Term[];
    defaultLabel: string;
}
