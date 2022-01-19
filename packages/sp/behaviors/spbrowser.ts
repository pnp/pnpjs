import { combine, isUrlAbsolute, TimelinePipe } from "@pnp/core";
import { BrowserFetchWithRetry, DefaultParse, Queryable } from "@pnp/queryable";
import { DefaultHeaders, DefaultInit } from "./defaults.js";
import { RequestDigest } from "./request-digest.js";

export interface ISPBrowserProps {
    baseUrl?: string;
}

export function SPBrowser(props?: ISPBrowserProps): TimelinePipe<Queryable> {

    if (props?.baseUrl && !isUrlAbsolute(props.baseUrl)) {
        throw Error("SPBrowser props.baseUrl must be absolute when supplied.");
    }

    return (instance: Queryable) => {

        instance.using(
            DefaultHeaders(),
            DefaultInit(),
            BrowserFetchWithRetry(),
            DefaultParse(),
            RequestDigest());

        if (isUrlAbsolute(props?.baseUrl)) {

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
