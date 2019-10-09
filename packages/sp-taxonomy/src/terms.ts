import { extend, sanitizeGuid, stringIsNullOrEmpty, getGUID } from "@pnp/common";
import {
    ClientSvcQueryable,
    IClientSvcQueryable,
    MethodParams,
    setProperty,
} from "@pnp/sp-clientsvc";
import { ILabelData, ILabel, ILabels, Labels } from "./labels";
import { ITermSet, TermSet, ITermSets, TermSets } from "./termsets";

export interface ITerms extends IClientSvcQueryable {
    get(): Promise<(ITermData & ITerm)[]>;
    getById(id: string): ITerm;
    getByName(name: string): ITerm;
}

export interface ITermData {
    CustomProperties?: any;
    CustomSortOrder?: any | null;
    Description?: string;
    Id?: string;
    IsAvailableForTagging?: boolean;
    IsDeprecated?: boolean;
    IsKeyword?: boolean;
    IsPinned?: boolean;
    IsPinnedRoot?: boolean;
    IsReused?: boolean;
    IsRoot?: boolean;
    IsSourceTerm?: boolean;
    LastModifiedDate?: string;
    LocalCustomProperties?: any;
    MergedTermIds?: any[];
    Name?: string;
    Owner?: string;
    PathOfTerm?: string;
    TermsCount?: number;
}

export interface ITerm extends IClientSvcQueryable {
    readonly labels: ILabels;
    readonly parent: ITerm;
    readonly pinSourceTermSet: ITermSet;
    readonly reusedTerms: ITerms;
    readonly sourceTerm: ITerm;
    readonly terms: ITerms;
    readonly termSet: ITermSet;
    readonly termSets: ITermSets;
    createLabel(name: string, lcid: number, isDefault?: boolean): Promise<ILabelData & ILabel>;
    deprecate(doDeprecate: boolean): Promise<void>;
    get(): Promise<(ITermData & ITerm)>;
    addTerm(name: string, lcid: number, isAvailableForTagging?: boolean, id?: string): Promise<ITerm & ITermData>;
    getDescription(lcid: number): Promise<string>;
    setDescription(description: string, lcid: number): Promise<void>;
    setLocalCustomProperty(name: string, value: string): Promise<void>;
    update(properties: { Name: string }): Promise<ITermData & ITerm>;
}

export class Terms extends ClientSvcQueryable implements ITerms {

    /**
     * Gets the terms in this collection
     */
    public get(): Promise<(ITermData & ITerm)[]> {
        return this.sendGetCollection<ITermData, ITerm>((d: ITermData) => {

            if (!stringIsNullOrEmpty(d.Name)) {
                return this.getByName(d.Name);
            } else if (!stringIsNullOrEmpty(d.Id)) {
                return this.getById(d.Id);
            }
            throw Error("Could not find Name or Id in Terms.get(). You must include at least one of these in your select fields.");
        });
    }

    /**
     * Gets a term by id
     * 
     * @param id The id of the term
     */
    public getById(id: string): ITerm {
        const params = MethodParams.build()
            .string(sanitizeGuid(id));

        return this.getChild(Term, "GetById", params);
    }

    /**
     * Gets a term by name
     * 
     * @param name Term name
     */
    public getByName(name: string): ITerm {

        const params = MethodParams.build()
            .string(name);

        return this.getChild(Term, "GetByName", params);
    }
}

/**
 * Represents the operations available on a given term
 */
export class Term extends ClientSvcQueryable implements ITerm {

    public addTerm(name: string, lcid: number, isAvailableForTagging = true, id = getGUID()): Promise<ITerm & ITermData> {

        const params = MethodParams.build()
            .string(name)
            .number(lcid)
            .string(sanitizeGuid(id));

        this._useCaching = false;
        return this.invokeMethod<ITermData>("CreateTerm", params,
            setProperty("IsAvailableForTagging", "Boolean", `${isAvailableForTagging}`))
            .then(r => extend(this.termSet.getTermById(r.Id), r));
    }

    public get terms(): ITerms {
        return this.getChildProperty(Terms, "Terms");
    }

    public get labels(): ILabels {
        return new Labels(this);
    }

    public get parent(): ITerm {
        return this.getChildProperty(Term, "Parent");
    }

    public get pinSourceTermSet(): ITermSet {
        return this.getChildProperty(TermSet, "PinSourceTermSet");
    }

    public get reusedTerms(): ITerms {
        return this.getChildProperty(Terms, "ReusedTerms");
    }

    public get sourceTerm(): ITerm {
        return this.getChildProperty(Term, "SourceTerm");
    }

    public get termSet(): ITermSet {
        return this.getChildProperty(TermSet, "TermSet");
    }

    public get termSets(): ITermSets {
        return this.getChildProperty(TermSets, "TermSets");
    }

    /**
     * Creates a new label for this Term
     * 
     * @param name label value
     * @param lcid language code
     * @param isDefault Is the default label
     */
    public createLabel(name: string, lcid: number, isDefault = false): Promise<ILabelData & ILabel> {

        const params = MethodParams.build()
            .string(name)
            .number(lcid)
            .boolean(isDefault);

        this._useCaching = false;
        return this.invokeMethod<ILabelData>("CreateLabel", params)
            .then(r => extend(this.labels.getByValue(name), r));
    }

    /**
     * Sets the deprecation flag on a term
     * 
     * @param doDeprecate New value for the deprecation flag
     */
    public deprecate(doDeprecate: boolean): Promise<void> {

        const params = MethodParams.build().boolean(doDeprecate);
        return this.invokeNonQuery("Deprecate", params);
    }

    /**
     * Loads the term data
     */
    public get(): Promise<(ITermData & ITerm)> {
        return this.sendGet<ITermData, ITerm>(Term);
    }

    /**
     * Gets the appropriate description for a term
     * 
     * @param lcid Language code
     */
    public getDescription(lcid: number): Promise<string> {

        const params = MethodParams.build().number(lcid);
        return this.invokeMethodAction<string>("GetDescription", params);
    }

    /**
     * Sets the description
     * 
     * @param description Term description
     * @param lcid Language code
     */
    public setDescription(description: string, lcid: number): Promise<void> {

        const params = MethodParams.build().string(description).number(lcid);
        return this.invokeNonQuery("SetDescription", params);
    }

    /**
     * Sets a custom property on this term
     * 
     * @param name Property name
     * @param value Property value
     */
    public setLocalCustomProperty(name: string, value: string): Promise<void> {

        const params = MethodParams.build().string(name).string(value);
        return this.invokeNonQuery("SetLocalCustomProperty", params);
    }

    /**
     * Updates the specified properties of this term, not all properties can be updated
     * 
     * @param properties Plain object representing the properties and new values to update
     */
    public update(properties: { Name: string }): Promise<ITermData & ITerm> {
        return this.invokeUpdate<ITermData, ITerm>(properties, Term);
    }

    /**
     * Deletes a this term
     * 
     */
    public delete(): Promise<void> {
        return this.invokeNonQuery("DeleteObject");
    }
}
