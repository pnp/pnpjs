import { SearchRequest as ISearchRequestType, SearchResponse as ISearchResponseType } from "@microsoft/microsoft-graph-types";
import { body } from "@pnp/queryable";
import { defaultPath } from "../decorators.js";
import { GraphInit, graphInvokableFactory, _GraphQueryableInstance } from "../graphqueryable.js";
import { graphPost } from "../operations.js";

/**
 * Search
 */
@defaultPath("search")
export class _Search extends _GraphQueryableInstance<ISearchRequestType[]> {

    public executeQuery(request: { requests: ISearchRequestType[] }): Promise<ISearchResponseType[]> {
        return graphPost(<any>Search(this, "query"), body(request));
    }
}
export interface ISearch {
    executeQuery(request: { requests: ISearchRequestType[] }): Promise<ISearchResponseType[]>;
}
export const Search: (base: GraphInit, path?: string) => ISearch = graphInvokableFactory<any>(_Search);
