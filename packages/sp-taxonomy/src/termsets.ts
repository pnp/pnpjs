import { extend, getGUID, sanitizeGuid, stringIsNullOrEmpty } from "@pnp/common";
import { ClientSvcQueryable, IClientSvcQueryable, MethodParams, setProperty } from "@pnp/sp-clientsvc";
import { ITermGroup, TermGroup } from "./termgroup";
import { ITerm, ITermData, ITerms, Term, Terms } from "./terms";

export interface ITermSets extends IClientSvcQueryable {
    getById(id: string): ITermSet;
    getByName(name: string): ITermSet;
    get(): Promise<(ITermSetData & ITermSet)[]>;
}

export interface ITermSetData {
    Contact?: string;
    CreatedDate?: string;
    CustomProperties?: any;
    CustomSortOrder?: any | null;
    Description?: string;
    Id?: string;
    IsAvailableForTagging?: boolean;
    IsOpenForTermCreation?: boolean;
    LastModifiedDate?: string;
    Name?: string;
    Names?: { [key: number]: string };
    Owner?: string;
    Stakeholders?: string[];
}

export class TermSets extends ClientSvcQueryable implements ITermSets {

    /**
     * Gets the termsets in this collection
     */
    public get(): Promise<(ITermSetData & ITermSet)[]> {
        return this.sendGetCollection<ITermSetData, ITermSet>((d: ITermSetData) => {
            if (!stringIsNullOrEmpty(d.Name)) {
                return this.getByName(d.Name);
            } else if (!stringIsNullOrEmpty(d.Id)) {
                return this.getById(d.Id);
            }
            throw Error("Could not find Value in Labels.get(). You must include at least one of these in your select fields.");
        });
    }

    /**
     * Gets a TermSet from this collection by id
     * 
     * @param id TermSet id
     */
    public getById(id: string): ITermSet {

        const params = MethodParams.build()
            .string(sanitizeGuid(id));

        return this.getChild(TermSet, "GetById", params);
    }

    /**
     * Gets a TermSet from this collection by name
     * 
     * @param name TermSet name
     */
    public getByName(name: string): ITermSet {

        const params = MethodParams.build()
            .string(name);

        return this.getChild(TermSet, "GetByName", params);
    }
}

export interface ITermSet extends IClientSvcQueryable {
    readonly terms: ITerms;
    readonly group: ITermGroup;
    copy(): Promise<ITermSetData>;
    get(): Promise<(ITermSetData & ITermSet)>;
    getTermById(id: string): ITerm;
    addTerm(name: string, lcid: number, isAvailableForTagging?: boolean, id?: string): Promise<ITerm & ITermData>;
    update(properties: TermSetUpdateProps): Promise<ITermSetData & ITermSet>;
}

export type TermSetUpdateProps = {
    Contact?: string,
    Description?: string,
    IsOpenForTermCreation?: boolean,
};

export class TermSet extends ClientSvcQueryable implements ITermSet {

    /**
     * Gets the group containing this Term set
     */
    public get group(): ITermGroup {
        return this.getChildProperty(TermGroup, "Group");
    }

    /**
     * Access all the terms in this termset
     */
    public get terms(): ITerms {
        return this.getChild(Terms, "GetAllTerms", null);
    }

    /**
     * Adds a stakeholder to the TermSet
     * 
     * @param stakeholderName The login name of the user to be added as a stakeholder
     */
    public addStakeholder(stakeholderName: string): Promise<void> {
        const params = MethodParams.build()
            .string(stakeholderName);

        return this.invokeNonQuery("DeleteStakeholder", params);
    }

    /**
     * Deletes a stakeholder to the TermSet
     * 
     * @param stakeholderName The login name of the user to be added as a stakeholder
     */
    public deleteStakeholder(stakeholderName: string): Promise<void> {
        const params = MethodParams.build()
            .string(stakeholderName);

        return this.invokeNonQuery("AddStakeholder", params);
    }

    /**
     * Gets the data for this TermSet
     */
    public get(): Promise<ITermSetData & ITermSet> {
        return this.sendGet<ITermSetData, ITermSet>(TermSet);
    }

    /**
     * Get a term by id
     * 
     * @param id Term id
     */
    public getTermById(id: string): ITerm {

        const params = MethodParams.build()
            .string(sanitizeGuid(id));

        return this.getChild(Term, "GetTerm", params);
    }

    /**
     * Adds a term to this term set
     * 
     * @param name Name for the term
     * @param lcid Language code
     * @param isAvailableForTagging set tagging availability (default: true)
     * @param id GUID id for the term (optional)
     */
    public addTerm(name: string, lcid: number, isAvailableForTagging = true, id = getGUID()): Promise<ITerm & ITermData> {

        const params = MethodParams.build()
            .string(name)
            .number(lcid)
            .string(sanitizeGuid(id));

        this._useCaching = false;
        return this.invokeMethod<ITermData>("CreateTerm", params,
            setProperty("IsAvailableForTagging", "Boolean", `${isAvailableForTagging}`))
            .then(r => extend(this.getTermById(r.Id), r));
    }

    /**
     * Copies this term set immediately
     */
    public copy(): Promise<ITermSetData> {
        return this.invokeMethod("Copy", null);
    }

    /**
     * Updates the specified properties of this term set, not all properties can be updated
     * 
     * @param properties Plain object representing the properties and new values to update
     */
    public update(properties: TermSetUpdateProps): Promise<ITermSetData & ITermSet> {
        return this.invokeUpdate<ITermSetData, ITermSet>(properties, TermSet);
    }
}
