import { metadata } from "./metadata";
import { ITypedHash, assign } from "@pnp/common";

export interface ISPKeyValueCollection {
    __metadata: {
        type: "Collection(SP.KeyValue)";
    };
    results: {
        __metadata: {
            type: "SP.KeyValue",
        },
        Key: string;
        Value: string,
        ValueType: "Edm.String"
    }[];
}

/**
 * Creates an object representing a SharePoint Collection(SP.KeyValue)
 * 
 * @param obj The plain object defining the properties
 */
export function objectToSPKeyValueCollection(obj: ITypedHash<string | number | boolean>): ISPKeyValueCollection {

    return <ISPKeyValueCollection>assign(metadata("Collection(SP.KeyValue)"), {
        results: Object.keys(obj).map(key => assign(metadata("SP.KeyValue"), {
            Key: key,
            Value: Reflect.get(obj, key),
            ValueType: "Edm.String",
        })),
    });
}
