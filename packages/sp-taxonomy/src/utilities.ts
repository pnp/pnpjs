import { sanitizeGuid, TypedHash, objectDefinedNotNull } from "@pnp/common";
import { Item, ItemUpdateResult } from "@pnp/sp";
import { ITermData } from "./terms";

export function setItemMetaDataField(item: Item, fieldName: string, term: ITermData): Promise<ItemUpdateResult> {

    if (!objectDefinedNotNull(term)) {
        return Promise.resolve(null);
    }

    const postData: TypedHash<any> = {};
    postData[fieldName] = {
        "Label": term.Name,
        "TermGuid": sanitizeGuid(term.Id),
        "WssId": "-1",
        "__metadata": { "type": "SP.Taxonomy.TaxonomyFieldValue" },
    };

    return item.update(postData);
}

export function setItemMetaDataMultiField(item: Item, fieldName: string, ...terms: ITermData[]): Promise<ItemUpdateResult> {

    if (terms.length < 1) {
        return Promise.resolve(null);
    }

    return item.list.fields.getByTitle(`${fieldName}_0`).select("InternalName").get<{ InternalName: string}>().then(i => {

        const postData: TypedHash<string> = {};
        postData[i.InternalName] = terms.map(term => `-1;#${term.Name}|${sanitizeGuid(term.Id)};#`).join("");

        return item.update(postData);
    });
}
