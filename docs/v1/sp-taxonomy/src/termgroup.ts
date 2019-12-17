import { extend, getGUID, sanitizeGuid, stringIsNullOrEmpty } from "@pnp/common";
import { ClientSvcQueryable, IClientSvcQueryable, MethodParams, ObjectPathQueue } from "@pnp/sp-clientsvc";
import { ITermSet, ITermSetData, ITermSets, TermSets } from "./termsets";
import { ITermStore, TermStore } from "./termstores";

export interface ITermGroups extends IClientSvcQueryable {
    get(): Promise<(ITermGroupData & ITermGroup)[]>;
    getById(id: string): ITermGroup;
    getByName(name: string): ITermGroup;
}

export interface ITermGroupData {
    CreatedDate?: string;
    Description?: string;
    Id?: string;
    IsSiteCollectionGroup?: boolean;
    IsSystemGroup?: boolean;
    LastModifiedDate?: string;
    Name?: string;
}

export interface ITermGroup extends IClientSvcQueryable {

    /**
     * ITermStore containing this TermGroup
     */
    readonly store: ITermStore | null;

    /**
     * Gets the collection of term sets in this group
     */
    readonly termSets: ITermSets;

    /**
     * Adds a contributor to the Group
     * 
     * @param principalName The login name of the user to be added as a contributor
     */
    addContributor(principalName: string): Promise<void>;
    /**
     * Adds a group manager to the Group
     * 
     * @param principalName The login name of the user to be added as a group manager
     */
    addGroupManager(principalName: string): Promise<void>;
    /**
     * Creates a new TermSet in this Group using the provided language and unique identifier
     * 
     * @param name The name of the new TermSet being created
     * @param lcid The language that the new TermSet name is in
     * @param id The unique identifier of the new TermSet being created (optional)
     */
    createTermSet(name: string, lcid: number, id?: string): Promise<ITermSet & ITermSetData>;
    /**
     * Gets this term store's data
     */
    get(): Promise<(ITermGroupData & ITermGroup)>;
    /**
     * Updates the specified properties of this term set, not all properties can be updated
     * 
     * @param properties Plain object representing the properties and new values to update
     */
    update(properties: TermGroupUpdateProps): Promise<ITermGroupData & ITermGroup>;
}

export type TermGroupUpdateProps = {
    Description?: string,
};

/**
 * Term Groups collection in Term Store
 */
export class TermGroups extends ClientSvcQueryable implements ITermGroups {
    /**
     * Gets the groups in this collection
     */
    public get(): Promise<(ITermGroupData & ITermGroup)[]> {
        return this.sendGetCollection<ITermGroupData, ITermGroup>((d: ITermGroupData) => {
            if (!stringIsNullOrEmpty(d.Name)) {
                return this.getByName(d.Name);
            } else if (!stringIsNullOrEmpty(d.Id)) {
                return this.getById(d.Id);
            }
            throw Error("Could not find Name or Id in TermGroups.get(). You must include at least one of these in your select fields.");
        });
    }

    /**
     * Gets a TermGroup from this collection by id
     * 
     * @param id TermGroup id
     */
    public getById(id: string): ITermGroup {

        const params = MethodParams.build()
            .string(sanitizeGuid(id));

        return this.getChild(TermGroup, "GetById", params);
    }

    /**
     * Gets a TermGroup from this collection by name
     * 
     * @param name TErmGroup name
     */
    public getByName(name: string): ITermGroup {

        const params = MethodParams.build()
            .string(name);

        return this.getChild(TermGroup, "GetByName", params);
    }
}

/**
 * Represents a group in the taxonomy heirarchy
 */
export class TermGroup extends ClientSvcQueryable implements ITermGroup {

    /**
     * ITermStore containing this TermGroup
     */
    public readonly store: ITermStore | null;

    constructor(parent: ClientSvcQueryable | string = "", _objectPaths?: ObjectPathQueue) {
        super(parent, _objectPaths);

        // this should mostly be true
        this.store = parent instanceof TermStore ? parent : null;
    }

    /**
     * Gets the collection of term sets in this group
     */
    public get termSets(): ITermSets {
        return this.getChildProperty(TermSets, "TermSets");
    }

    /**
     * Adds a contributor to the Group
     * 
     * @param principalName The login name of the user to be added as a contributor
     */
    public addContributor(principalName: string): Promise<void> {

        const params = MethodParams.build().string(principalName);
        return this.invokeNonQuery("AddContributor", params);
    }

    /**
     * Adds a group manager to the Group
     * 
     * @param principalName The login name of the user to be added as a group manager
     */
    public addGroupManager(principalName: string): Promise<void> {

        const params = MethodParams.build().string(principalName);
        return this.invokeNonQuery("AddGroupManager", params);
    }

    /**
     * Creates a new TermSet in this Group using the provided language and unique identifier
     * 
     * @param name The name of the new TermSet being created
     * @param lcid The language that the new TermSet name is in
     * @param id The unique identifier of the new TermSet being created (optional)
     */
    public createTermSet(name: string, lcid: number, id = getGUID()): Promise<ITermSet & ITermSetData> {

        const params = MethodParams.build()
            .string(name)
            .string(sanitizeGuid(id))
            .number(lcid);

        this._useCaching = false;
        return this.invokeMethod<ITermSetData>("CreateTermSet", params)
            .then(r => extend(this.store.getTermSetById(r.Id), r));
    }

    /**
     * Gets this term store's data
     */
    public get(): Promise<ITermGroupData & ITermGroup> {
        return this.sendGet<ITermGroupData, ITermGroup>(TermGroup);
    }

    /**
     * Updates the specified properties of this term set, not all properties can be updated
     * 
     * @param properties Plain object representing the properties and new values to update
     */
    public update(properties: TermGroupUpdateProps): Promise<ITermGroupData & ITermGroup> {
        return this.invokeUpdate<ITermGroupData, ITermGroup>(properties, TermGroup);
    }
}
