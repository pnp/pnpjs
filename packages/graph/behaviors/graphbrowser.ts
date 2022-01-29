import { combine, isUrlAbsolute, TimelinePipe } from "@pnp/core";
import { BrowserFetchWithRetry, DefaultParse, Queryable } from "@pnp/queryable";
import { DefaultHeaders, DefaultInit } from "./defaults.js";

export interface IGraphBrowserProps {
    baseUrl?: string;
}

export function GraphBrowser(props?: IGraphBrowserProps): TimelinePipe<Queryable> {

    if (props?.baseUrl && !isUrlAbsolute(props.baseUrl)) {
        throw Error("GraphBrowser props.baseUrl must be absolute when supplied.");
    }

    return (instance: Queryable) => {

        instance.using(
            DefaultHeaders(),
            DefaultInit(),
            BrowserFetchWithRetry(),
            DefaultParse());

        if (props?.baseUrl) {

            // we want to fix up the url first
            instance.on.pre.prepend(async (url, init, result) => {

                if (!isUrlAbsolute(url)) {
                    url = combine(props.baseUrl, url);
                }

                return [url, init, result];
            });
        }

        return instance;
    };
}
