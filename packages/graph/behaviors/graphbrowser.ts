import { TimelinePipe } from "@pnp/core";
import { BrowserFetchWithRetry, DefaultParse, Queryable } from "@pnp/queryable";
import { DefaultHeaders, DefaultInit } from "./defaults.js";
import { DEFAULT_GRAPH_URL } from "../index.js";

export interface IGraphBrowserProps {
    baseUrl?: string;
}

export function GraphBrowser(props?: IGraphBrowserProps): TimelinePipe<Queryable> {

    const { baseUrl } = {
        baseUrl: DEFAULT_GRAPH_URL,
        ...props,
    };

    return (instance: Queryable) => {

        instance.using(
            DefaultHeaders(),
            DefaultInit(baseUrl),
            BrowserFetchWithRetry(),
            DefaultParse());

        return instance;
    };
}
