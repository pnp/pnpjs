import { defaultPath } from "../decorators";
import { _SharePointQueryableCollection, spInvokableFactory, _SharePointQueryableInstance } from "../sharepointqueryable";
import { tag } from "../telemetry";

/**
 * Describes a collection of Form objects
 *
 */
@defaultPath("_api/v2.1/termstore")
export class _TermStore extends _SharePointQueryableInstance<ITermStoreInfo> {

    /**
     * Gets the term groups associated with this tenant
     */
    public get groups(): ITermGroups {
        return tag.configure(TermGroups(this), "txts.groups");
    }

    /**
     * Gets the term sets associated with this tenant
     */
    public get sets(): ITermSets {
        return tag.configure(TermSets(this), "txts.sets");
    }
}
export interface ITermStore extends _TermStore { }
export const TermStore = spInvokableFactory<ITermStore>(_TermStore);


@defaultPath("groups")
export class _TermGroups extends _SharePointQueryableCollection<ITermGroupInfo[]> {

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

export class _TermGroup extends _SharePointQueryableInstance<ITermGroupInfo> {

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
export class _TermSets extends _SharePointQueryableCollection<ITermSetInfo[]> {

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

export class _TermSet extends _SharePointQueryableInstance<ITermSetInfo> {

    // public get terms(): ITerms {
    //     return Terms(this);
    // }

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
        return tag.configure(this.clone(Term, `terms/${id}`), "txts.getTermById");
    }
}
export interface ITermSet extends _TermSet { }
export const TermSet = spInvokableFactory<ITermSet>(_TermSet);

// @defaultPath("terms")
// export class _Terms extends _SharePointQueryableCollection<ITermInfo[]> {

//     /**
//      * Gets a term group by id
//      *
//      * @param id Id of the term group to access
//      */
//     public getById(id: string): ITerm {
//         return Term(this, id);
//     }
// }
// export interface ITerms extends _Terms { }
// export const Terms = spInvokableFactory<ITerms>(_Terms);

@defaultPath("children")
export class _Children extends _SharePointQueryableCollection<ITermInfo[]> { }
export interface IChildren extends _Children { }
export const Children = spInvokableFactory<IChildren>(_Children);

export class _Term extends _SharePointQueryableInstance<ITermInfo> {

    public get parent(): ITerm {
        return tag.configure(Term(this, "parent"), "txt.parent");
    }

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
export class _Relations extends _SharePointQueryableCollection<IRelationInfo[]> {
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

export class _Relation extends _SharePointQueryableInstance<IRelationInfo> {

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


// save these for when we are creating update types
// Partial<Pick<ITermGroupInfo, "name" | "description">>
// Omit<ITermGroupInfo, "managers" | "contributors" | "createdDateTime" | "lastModifiedDateTime">


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
    managers?: ITaxonomyUserInfo[];
    contributors?: ITaxonomyUserInfo[];
}

export interface ITermSetInfo {
    id: string;
    localizedNames: { name: string, languageTag: string }[];
    description: string;
    createdDateTime: string;
    properties: ITaxonomyProperty[];
}

export interface ITermInfo {
    id: string;
    labels: { name: string, isDefault: boolean, languageTag: string }[];
    createdDateTime: string;
    lastModifiedDateTime: string;
    descriptions: { description: string, languageTag: string }[];
    properties: ITaxonomyProperty[];
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
