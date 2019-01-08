import { extend, getGUID, sanitizeGuid, stringIsNullOrEmpty } from "@pnp/common";
import { ClientSvcQueryable, IClientSvcQueryable, MethodParams, ObjectPathQueue, method, objConstructor, objectPath, objectProperties, opQuery, property } from "@pnp/sp-clientsvc";
import { ITermGroup, ITermGroupData, TermGroup, ITermGroups, TermGroups } from "./termgroup";
import { ITerm, ITerms, Term, Terms } from "./terms";
import { ITermSet, ITermSets, TermSet, TermSets } from "./termsets";
import { ChangeInformation, ChangedItem, ILabelMatchInfo } from "./types";

/**
 * Defines the visible members of the term store 
 */
export interface ITermStores extends IClientSvcQueryable {
    get(): Promise<(ITermStoreData & ITermStore)[]>;
    getByName(name: string): ITermStore;
    getById(id: string): ITermStore;
}

/**
 * Represents the set of available term stores and the collection methods
 */
export class TermStores extends ClientSvcQueryable implements ITermStores {

    constructor(parent: ClientSvcQueryable | string = "") {
        super(parent);

        this._objectPaths.add(property("TermStores",
            // actions
            objectPath()));
    }

    /**
     * Gets the term stores
     */
    public get(): Promise<(ITermStoreData & ITermStore)[]> {
        return this.sendGetCollection<ITermStoreData, ITermStore>((d: ITermStoreData): ITermStore => {

            if (!stringIsNullOrEmpty(d.Name)) {
                return this.getByName(d.Name);
            } else if (!stringIsNullOrEmpty(d.Id)) {
                return this.getById(d.Id);
            }
            throw Error("Could not find Name or Id in TermStores.get(). You must include at least one of these in your select fields.");
        });
    }

    /**
     * Returns the TermStore specified by its index name
     *
     * @param name The index name of the TermStore to be returned
     */
    public getByName(name: string): ITermStore {
        return this.getChild(TermStore, "GetByName", MethodParams.build().string(name));
    }

    /**
     * Returns the TermStore specified by its GUID index
     *
     * @param id The GUID index of the TermStore to be returned
     */
    public getById(id: string): ITermStore {
        return this.getChild(TermStore, "GetById", MethodParams.build().string(sanitizeGuid(id)));
    }
}

/**
 * Defines the term store object
 */
export interface ITermStore extends IClientSvcQueryable {
    readonly hashTagsTermSet: ITermSet;
    readonly keywordsTermSet: ITermSet;
    readonly orphanedTermsTermSet: ITermSet;
    readonly systemGroup: ITermGroup;
    readonly groups: ITermGroups;
    addGroup(name: string, id?: string): Promise<ITermGroup & ITermGroupData>;
    addLanguage(lcid: number): Promise<void>;
    commitAll(): Promise<void>;
    deleteLanguage(lcid: number): Promise<void>;
    get(): Promise<(ITermStoreData & ITermStore)>;
    getChanges(info: ChangeInformation): Promise<ChangedItem[]>;
    getSiteCollectionGroup(createIfMissing?: boolean): ITermGroup;
    getTermById(id: string): ITerm;
    getTermInTermSet(termId: string, termSetId: string): ITerm;
    getTermGroupById(id: string): ITermGroup;
    getTerms(info: ILabelMatchInfo): ITerms;
    getTermsById(...ids: string[]): any;
    getTermSetById(id: string): ITermSet;
    getTermSetsByName(name: string, lcid: number): ITermSets;
    rollbackAll(): Promise<void>;
    update(properties: TermStoreUpdateProps): Promise<ITermStoreData & ITermStore>;
    updateCache(): Promise<void>;
    updateUsedTermsOnSite(): Promise<void>;
}

/**
 * Defines the term store object
 */
export interface ITermStoreData {
    DefaultLanguage?: number;
    Id?: string;
    IsOnline?: boolean;
    Languages?: string[];
    Name?: string;
    WorkingLanguage?: number;
}

export type TermStoreUpdateProps = {
    DefaultLanguage?: number,
    WorkingLanguage?: number,
};

export class TermStore extends ClientSvcQueryable implements ITermStore {

    constructor(parent: ClientSvcQueryable | string = "", _objectPaths: ObjectPathQueue | null = null) {
        super(parent, _objectPaths);
    }

    public get hashTagsTermSet(): ITermSet {
        return this.getChildProperty(TermSet, "HashTagsTermSet");
    }

    public get keywordsTermSet(): ITermSet {
        return this.getChildProperty(TermSet, "KeywordsTermSet");
    }

    public get orphanedTermsTermSet(): ITermSet {
        return this.getChildProperty(TermSet, "OrphanedTermsTermSet");
    }

    public get systemGroup(): ITermGroup {
        return this.getChildProperty(TermGroup, "SystemGroup");
    }

    public get groups(): ITermGroups {
        return this.getChildProperty(TermGroups, "Groups");
    }

    /**
     * Gets the term store data
     */
    public get(): Promise<(ITermStoreData & ITermStore)> {
        return this.sendGet<ITermStoreData, ITermStore>(TermStore);
    }

    /**
     * Gets term sets
     * 
     * @param name 
     * @param lcid 
     */
    public getTermSetsByName(name: string, lcid: number): ITermSets {

        const params = MethodParams.build()
            .string(name)
            .number(lcid);

        return this.getChild(TermSets, "GetTermSetsByName", params);
    }

    /**
     * Provides access to an ITermSet by id
     * 
     * @param id 
     */
    public getTermSetById(id: string): ITermSet {

        const params = MethodParams.build().string(sanitizeGuid(id));
        return this.getChild(TermSet, "GetTermSet", params);
    }

    /**
     * Provides access to an ITermSet by id
     * 
     * @param id 
     */
    public getTermById(id: string): ITerm {

        const params = MethodParams.build().string(sanitizeGuid(id));
        return this.getChild(Term, "GetTerm", params);
    }

    /**
     * Provides access to an ITermSet by id
     * 
     * @param id 
     */
    public getTermsById(...ids: string[]): ITerms {

        const params = MethodParams.build().strArray(ids.map(id => sanitizeGuid(id)));
        return this.getChild(Terms, "GetTermsById", params);
    }

    /**
     * Gets a term from a term set based on the supplied ids
     * 
     * @param termId Term Id
     * @param termSetId Termset Id
     */
    public getTermInTermSet(termId: string, termSetId: string): ITerm {

        const params = MethodParams.build().string(sanitizeGuid(termId)).string(sanitizeGuid(termSetId));
        return this.getChild(Term, "GetTermInTermSet", params);
    }

    /**
     * This method provides access to a ITermGroup by id
     * 
     * @param id The group id
     */
    public getTermGroupById(id: string): ITermGroup {

        const params = MethodParams.build()
            .string(sanitizeGuid(id));

        return this.getChild(TermGroup, "GetGroup", params);
    }

    /**
     * Gets the terms by the supplied information (see: https://msdn.microsoft.com/en-us/library/hh626704%28v=office.12%29.aspx)
     * 
     * @param info 
     */
    public getTerms(info: ILabelMatchInfo): ITerms {

        const objectPaths = this._objectPaths.copy();

        // this will be the parent of the GetTerms call, but we need to create the input param first
        const parentIndex = objectPaths.lastIndex;

        // this is our input object
        const input = objConstructor("{61a1d689-2744-4ea3-a88b-c95bee9803aa}",
            // actions
            objectPath(),
            ...objectProperties(info),
        );

        // add the input object path
        const inputIndex = objectPaths.add(input);

        // this sets up the GetTerms call
        const params = MethodParams.build().objectPath(inputIndex);

        // call the method
        const methodIndex = objectPaths.add(method("GetTerms", params,
            // actions
            objectPath()));

        // setup the parent relationship even though they are seperated in the collection
        objectPaths.addChildRelationship(parentIndex, methodIndex);

        return new Terms(this, objectPaths);
    }

    /**
     * Gets the site collection group associated with the current site
     * 
     * @param createIfMissing If true the group will be created, otherwise null (default: false)
     */
    public getSiteCollectionGroup(createIfMissing = false): ITermGroup {

        const objectPaths = this._objectPaths.copy();
        const methodParent = objectPaths.lastIndex;
        const siteIndex = objectPaths.siteIndex;

        const params = MethodParams.build().objectPath(siteIndex).boolean(createIfMissing);

        const methodIndex = objectPaths.add(method("GetSiteCollectionGroup", params,
            // actions
            objectPath(),
        ));

        // the parent of this method call is this instance, not the current/site
        objectPaths.addChildRelationship(methodParent, methodIndex);

        return new TermGroup(this, objectPaths);
    }

    /**
     * Adds a working language to the TermStore
     * 
     * @param lcid The locale identifier of the working language to add
     */
    public addLanguage(lcid: number): Promise<void> {

        const params = MethodParams.build().number(lcid);
        return this.invokeNonQuery("AddLanguage", params);
    }

    /**
     * Creates a new Group in this TermStore
     * 
     * @param name The name of the new Group being created
     * @param id The ID (Guid) that the new group should have
     */
    public addGroup(name: string, id = getGUID()): Promise<ITermGroup & ITermGroupData> {

        const params = MethodParams.build()
            .string(name)
            .string(sanitizeGuid(id));

        this._useCaching = false;
        return this.invokeMethod<ITermGroupData>("CreateGroup", params)
            .then(r => extend(this.getTermGroupById(r.Id), r));
    }

    /**
     * Commits all updates to the database that have occurred since the last commit or rollback
     */
    public commitAll(): Promise<void> {
        return this.invokeNonQuery("CommitAll");
    }

    /**
     * Delete a working language from the TermStore
     * 
     * @param lcid locale ID for the language to be deleted
     */
    public deleteLanguage(lcid: number): Promise<void> {

        const params = MethodParams.build().number(lcid);
        return this.invokeNonQuery("DeleteLanguage", params);
    }

    /**
     * Discards all updates that have occurred since the last commit or rollback
     */
    public rollbackAll(): Promise<void> {
        return this.invokeNonQuery("RollbackAll");
    }

    /**
     * Updates the cache
     */
    public updateCache(): Promise<void> {
        return this.invokeNonQuery("UpdateCache");
    }

    /**
     * Updates the specified properties of this term set, not all properties can be updated
     * 
     * @param properties Plain object representing the properties and new values to update
     */
    public update(properties: TermStoreUpdateProps): Promise<ITermStoreData & ITermStore> {
        return this.invokeUpdate<ITermStoreData, ITermStore>(properties, TermStore);
    }

    /**
     * This method makes sure that this instance is aware of all child terms that are used in the current site collection
     */
    public updateUsedTermsOnSite(): Promise<void> {

        const objectPaths = this._objectPaths.copy();
        const methodParent = objectPaths.lastIndex;
        const siteIndex = objectPaths.siteIndex;

        const params = MethodParams.build().objectPath(siteIndex);

        const methodIndex = objectPaths.add(method("UpdateUsedTermsOnSite", params));

        // the parent of this method call is this instance, not the current context/site
        objectPaths.addChildRelationship(methodParent, methodIndex);

        return this.send<void>(objectPaths);
    }

    /**
     * Gets a list of changes
     * 
     * @param info Lookup information
     */
    public getChanges(info: ChangeInformation): Promise<ChangedItem[]> {

        const objectPaths = this._objectPaths.copy();
        const methodParent = objectPaths.lastIndex;

        const inputIndex = objectPaths.add(objConstructor("{1f849fb0-4fcb-4a54-9b01-9152b9e482d3}",
            // actions
            objectPath(),
            ...objectProperties(info),
        ));

        const params = MethodParams.build().objectPath(inputIndex);

        const methodIndex = objectPaths.add(method("GetChanges", params,
            // actions
            objectPath(),
            opQuery([], this.getSelects()),
        ));

        objectPaths.addChildRelationship(methodParent, methodIndex);

        return this.send<ChangedItem[]>(objectPaths);
    }
}
