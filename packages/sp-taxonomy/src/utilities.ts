import { sanitizeGuid, TypedHash, objectDefinedNotNull } from "@pnp/common";
import { IItem, IItemUpdateResult } from "@pnp/sp/src/items/types";
import { ITermData } from "./terms";

export function setItemMetaDataField(item: IItem, fieldName: string, term: ITermData): Promise<IItemUpdateResult> {

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

export function setItemMetaDataMultiField(item: IItem, fieldName: string, ...terms: ITermData[]): Promise<IItemUpdateResult> {

    if (terms.length < 1) {
        return Promise.resolve(null);
    }

    return item.list.fields.getByTitle(`${fieldName}_0`).select("InternalName").get<{ InternalName: string}>().then(i => {

        const postData: TypedHash<string> = {};
        postData[i.InternalName] = terms.map(term => `-1;#${term.Name}|${sanitizeGuid(term.Id)};#`).join("");

        return item.update(postData);
    });
}
