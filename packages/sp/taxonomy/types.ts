import { defaultPath } from "../decorators";
import { _SharePointQueryableCollection, spInvokableFactory, _SharePointQueryableInstance } from "../sharepointqueryable";


// TODO::
// import { tag } from "../telemetry";

/**
 * Describes a collection of Form objects
 *
 */
@defaultPath("_api/v2.1/termstore")
export class _TermStore extends _SharePointQueryableInstance<ITermStoreInfo> {

    /**
     * Gets the term groups associated with this tenant
     */
    public get termGroups(): ITermGroups {
        return TermGroups(this);
    }

    /**
     * Gets the term groups associated with this tenant
     */
    public get groups(): ITermGroups {
        return TermGroups(this, "groups");
    }
}
export interface ITermStore extends _TermStore { }
export const TermStore = spInvokableFactory<ITermStore>(_TermStore);


@defaultPath("termgroups")
export class _TermGroups extends _SharePointQueryableCollection<ITermGroupInfo[]> {

    /**
     * Gets a term group by id
     * 
     * @param id Id of the term group to access
     */
    public getById(id: string): ITermGroup {
        return TermGroup(this, id);
    }
}
export interface ITermGroups extends _TermGroups { }
export const TermGroups = spInvokableFactory<ITermGroups>(_TermGroups);

export class _TermGroup extends _SharePointQueryableInstance<ITermGroupInfo> {

    /**
     * Gets the term sets associated with this tenant
     */
    public get termSets(): ITermSets {
        return TermSets(this);
    }

    /**
     * Gets the term groups associated with this tenant
     */
    public get sets(): ITermSets {
        return TermSets(this, "sets");
    }
}
export interface ITermGroup extends _TermGroup { }
export const TermGroup = spInvokableFactory<ITermGroup>(_TermGroup);


@defaultPath("termsets")
export class _TermSets extends _SharePointQueryableCollection<ITermSetInfo[]> {

    /**
     * Gets a term group by id
     * 
     * @param id Id of the term group to access
     */
    public getById(id: string): ITermSet {
        return TermSet(this, id);
    }
}
export interface ITermSets extends _TermSets { }
export const TermSets = spInvokableFactory<ITermSets>(_TermSets);

export class _TermSet extends _SharePointQueryableInstance<ITermSetInfo> {

    public get terms(): ITerms {
        return Terms(this);
    }

    public get parentGroup(): ITermGroup {
        return TermGroup(this, "parentGroup");
    }

    public get children(): ITerms {
        return Terms(this, "children");
    }

    public get relations(): IRelations {
        return Relations(this);
    }
}
export interface ITermSet extends _TermSet { }
export const TermSet = spInvokableFactory<ITermSet>(_TermSet);


@defaultPath("terms")
export class _Terms extends _SharePointQueryableCollection<ITermInfo[]> {

    /**
     * Gets a term group by id
     * 
     * @param id Id of the term group to access
     */
    public getById(id: string): ITerm {
        return Term(this, id);
    }
 }
export interface ITerms extends _Terms {}
export const Terms = spInvokableFactory<ITerms>(_Terms);

export class _Term extends _SharePointQueryableInstance<ITermInfo> {

    public get parent(): ITerm {
        return Term(this, "parent");
    }

    public get children(): ITerms {
        return Terms(this, "children");
    }

    public get relations(): IRelations {
        return Relations(this);
    }

    public get set(): ITermSet {
        return TermSet(this, "set");
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
        return Relation(this, id);
    }
}
export interface IRelations extends _Relations { }
export const Relations = spInvokableFactory<IRelations>(_Relations);

export class _Relation extends _SharePointQueryableInstance<IRelationInfo> {

    public get fromTerm(): ITerm {
        return Term(this, "fromTerm");
    }

    public get toTerm(): ITerm {
        return Term(this, "toTerm");
    }

    public get set(): ITermSet {
        return TermSet(this, "set");
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
    createdDateTime: string;
    lastModifiedDateTime: string;
    type: string;
    managers?: ITaxonomyUserInfo[];
    contributors?: ITaxonomyUserInfo[];
}

export interface ITermSetInfo {
    id: string;
    localizedNames: { name: string, languageTag: string }[];
    description: string;
    childrenCount: number;
    createdDateTime: string;
    isOpen: boolean;
    groupId: string;
    properties: ITaxonomyProperty[];
    customSortOrder: string;
    isAvailableForTagging: boolean;
    contact: string;
    owner: ITaxonomyUserInfo;
    stakeHolders: ITaxonomyUserInfo[];
}

export interface ITermInfo {
    id: string;
    labels: { name: string, isDefault: boolean, languageTag: string }[];
    isDeprecated: boolean;
    childrenCount: number;
    createdDateTime: string;
    lastModifiedDateTime: string;
    descriptions: { description: string, languageTag: string }[];
    customSortOrder: { setId: string, order: string[] }[];
    properties: ITaxonomyProperty[];
    localProperties: { setId: string, properties: ITaxonomyProperty[] }[];
    isAvailableForTagging: { setId: string, isAvailable: boolean }[];
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
