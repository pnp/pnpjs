import {
    ClientSvcQueryable,
    IClientSvcQueryable,
    MethodParams,
    ObjectPathQueue,
    property,
} from "@pnp/sp-clientsvc";
import { stringIsNullOrEmpty } from "@pnp/common";

/**
 * Represents a collection of labels
 */
export interface ILabels extends IClientSvcQueryable {
    /**
     * Gets a label from the collection by its value
     * 
     * @param value The value to retrieve
     */
    getByValue(value: string): ILabel;
    /**
     * Loads the data and merges with with the ILabel instances
     */
    get(): Promise<(ILabel & ILabelData)[]>;
}

/**
 * Represents a collection of labels
 */
export class Labels extends ClientSvcQueryable implements ILabels {

    constructor(parent: ClientSvcQueryable | string = "", _objectPaths: ObjectPathQueue | null = null) {
        super(parent, _objectPaths);

        this._objectPaths.add(property("Labels"));
    }

    /**
     * Gets a label from the collection by its value
     * 
     * @param value The value to retrieve
     */
    public getByValue(value: string): ILabel {

        const params = MethodParams.build().string(value);
        return this.getChild(Label, "GetByValue", params);
    }

    /**
     * Loads the data and merges with with the ILabel instances
     */
    public get(): Promise<(ILabel & ILabelData)[]> {
        return this.sendGetCollection<ILabelData, ILabel>((d: ILabelData) => {

            if (!stringIsNullOrEmpty(d.Value)) {
                return this.getByValue(d.Value);
            }
            throw Error("Could not find Value in Labels.get(). You must include at least one of these in your select fields.");
        });
    }
}

/**
 * Represents the data contained in a label
 */
export interface ILabelData {
    /**
     * Is this the default label for this language
     */
    IsDefaultForLanguage?: boolean;
    /**
     * LCID language id
     */
    Language?: number;
    /**
     * Label value
     */
    Value?: string;
}

/**
 * Represents a label instance
 */
export interface ILabel extends IClientSvcQueryable {
    /**
     * Gets the data for this Label
     */
    get(): Promise<ILabelData & ILabel>;
    /**
     * Sets this label as the default
     */
    setAsDefaultForLanguage(): Promise<void>;
    /**
     * Deletes this label
     */
    delete(): Promise<void>;
}

/**
 * Represents a label instance
 */
export class Label extends ClientSvcQueryable implements ILabel {
    /**
     * Gets the data for this Label
     */
    public get(): Promise<ILabelData & ILabel> {
        return this.sendGet<ILabelData, ILabel>(Label);
    }

    /**
     * Sets this label as the default
     */
    public setAsDefaultForLanguage(): Promise<void> {
        return this.invokeNonQuery("SetAsDefaultForLanguage");
    }

    /**
     * Deletes this label
     */
    public delete(): Promise<void> {
        return this.invokeNonQuery("DeleteObject");
    }
}
