import { SearchRequest as ISearchRequestType, SearchResponse as ISearchResponseType } from "@microsoft/microsoft-graph-types";
import { Search } from "./types.js";
import { GraphRest } from "../rest.js";

export {
    ISearch,
    Search,
} from "./types.js";

declare module "../rest" {
    interface GraphRest {
        query(...requests: ISearchRequestType[]): Promise<ISearchResponseType[]>;
    }
}

GraphRest.prototype.query = async function (this: GraphRest, ...requests: ISearchRequestType[]): Promise<ISearchResponseType[]> {

    return this.childConfigHook(({ options, baseUrl, runtime }) => {
        return (<any>Search(baseUrl)).configure(options).setRuntime(runtime).executeQuery({ requests });
    });
};
