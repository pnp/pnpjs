import { hOP, objectDefinedNotNull, stringIsNullOrEmpty, TimelinePipe } from "@pnp/core";
import { errorCheck, parseODataJSON } from "@pnp/queryable";
import { GraphQueryableCollection, IGraphQueryable, IGraphQueryableCollection } from "../graphqueryable.js";
import { ConsistencyLevel } from "./consistency-level.js";

export interface IPagedResult {
    count: number;
    value: any[] | null;
    hasNext: boolean;
    nextLink: string;
}

export async function Count(col: IGraphQueryableCollection): Promise<number> {

    const q = GraphQueryableCollection(col).using(Paged(), ConsistencyLevel());
    q.query.set("$count", "true");
    q.top(1);

    const y: IPagedResult = await q();
    return y.count;
}

/**
 * Configures a collection query to returned paged results
 *
 * @param col Collection forming the basis of the paged collection, this param is NOT modified
 * @returns A duplicate collection which will return paged results
 */
export function AsAsyncIterable(col: IGraphQueryableCollection): AsyncIterable {

    const q = GraphQueryableCollection(col).using(Paged(), ConsistencyLevel());

    const queryParams = ["$search", "$top", "$select", "$expand", "$filter", "$orderby"];

    for (let i = 0; i < queryParams.length; i++) {
        const param = col.query.get(queryParams[i]);
        if (objectDefinedNotNull(param)) {
            q.query.set(queryParams[i], param);
        }
    }

    return {

        [Symbol.asyncIterator]() {
            return {

                _next: q,

                async next() {

                    if (this._next === null) {
                        return { done: true };
                    }

                    const result: IPagedResult = await this._next();

                    if (result.hasNext) {
                        this._next = GraphQueryableCollection([this._next, result.nextLink]);
                        return { done: false, value: result.value };
                    } else {
                        this._next = null;
                        return { done: false, value: result.value };
                    }
                },
            };
        },
    };
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

            const count = hOP(json, "@odata.count") ? parseInt(json["@odata.count"], 10) : -1;

            const hasNext = !stringIsNullOrEmpty(nextLink);

            result = {
                count,
                hasNext,
                nextLink: hasNext ? nextLink : null,
                value: parseODataJSON(json),
            };

            return [url, response, result];
        });

        return instance;
    };
}
