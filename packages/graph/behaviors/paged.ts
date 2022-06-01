import { stringIsNullOrEmpty, TimelinePipe } from "@pnp/core";
import { errorCheck, parseODataJSON } from "@pnp/queryable";
import { GraphQueryableCollection, IGraphQueryable, IGraphQueryableCollection } from "../graphqueryable.js";

export interface IPagedResult {
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
export function AsPaged(col: IGraphQueryableCollection): IGraphQueryableCollection {

    const q = GraphQueryableCollection(col).using(Paged());

    const queryParams = ["$top", "$select", "$expand", "$filter", "$orderby"];

    for (let i = 0; i < queryParams.length; i++) {
        const param = col.query.get(queryParams[i]);
        if (param !== undefined) {
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
export function Paged(): TimelinePipe {

    return (instance: IGraphQueryable) => {

        instance.on.parse.replace(errorCheck);
        instance.on.parse(async (url: URL, response: Response, result: any): Promise<[URL, Response, any]> => {

            const txt = await response.text();
            const json = txt.replace(/\s/ig, "").length > 0 ? JSON.parse(txt) : {};
            const nextLink = json["@odata.nextLink"];

            const hasNext = !stringIsNullOrEmpty(nextLink);

            result = {
                hasNext,
                next: () => (hasNext ? AsPaged(GraphQueryableCollection([instance, nextLink]))() : null),
                value: parseODataJSON(json),
            };

            return [url, response, result];
        });

        return instance;
    };
}
