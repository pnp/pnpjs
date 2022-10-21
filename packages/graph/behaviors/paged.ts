import { hOP, objectDefinedNotNull, stringIsNullOrEmpty, TimelinePipe } from "@pnp/core";
import { errorCheck, parseODataJSON } from "@pnp/queryable";
import { GraphQueryableCollection, IGraphQueryable, IGraphQueryableCollection } from "../graphqueryable.js";
import { ConsistencyLevel } from "./consistency-level.js";

export interface IPagedResult {
    count: number;
    value: any[] | null;
    hasNext: boolean;
    next(): Promise<IPagedResult>;
}

/**
 * Configures a collection query to returned paged results
 *
 * @param col Collection forming the basis of the paged collection, this param is NOT modified
 * @returns A duplicate collection which will return paged results
 */
export function AsPaged(col: IGraphQueryableCollection, supportsCount = false): IGraphQueryableCollection {

    const q = GraphQueryableCollection(col).using(Paged(supportsCount), ConsistencyLevel());

    const queryParams = ["$search", "$top", "$select", "$expand", "$filter", "$orderby"];

    if (supportsCount) {

        // we might be constructing our query with a next url that will already contain $count so we need
        // to ensure we don't add it again, likewise if it is already in our query collection we don't add it again
        if (!q.query.has("$count") && !/\$count=true/i.test(q.toUrl())) {
            q.query.set("$count", "true");
        }

        queryParams.push("$count");
    }

    for (let i = 0; i < queryParams.length; i++) {
        const param = col.query.get(queryParams[i]);
        if (objectDefinedNotNull(param)) {
            q.query.set(queryParams[i], param);
        }
    }

    return q;
}

/**
 * Behavior that converts results to pages when used with a collection (exposed through the paged method of GraphCollection)
 *
 * @returns A TimelinePipe used to configure the queryable
 */
export function Paged(supportsCount = false): TimelinePipe {

    return (instance: IGraphQueryable) => {

        instance.on.parse.replace(errorCheck);
        instance.on.parse(async (url: URL, response: Response, result: any): Promise<[URL, Response, any]> => {

            const txt = await response.text();
            const json = txt.replace(/\s/ig, "").length > 0 ? JSON.parse(txt) : {};
            const nextLink = json["@odata.nextLink"];

            const count = supportsCount && hOP(json, "@odata.count") ? parseInt(json["@odata.count"], 10) : 0;

            const hasNext = !stringIsNullOrEmpty(nextLink);

            result = {
                count,
                hasNext,
                next: () => (hasNext ? AsPaged(GraphQueryableCollection([instance, nextLink]), supportsCount)() : null),
                value: parseODataJSON(json),
            };

            return [url, response, result];
        });

        return instance;
    };
}
