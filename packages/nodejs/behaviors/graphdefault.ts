import { Configuration } from "@azure/msal-node";
import { combine, isUrlAbsolute, TimelinePipe } from "@pnp/core";
import { DefaultParse, Queryable2 } from "@pnp/queryable";
import { DefaultHeaders, DefaultInit } from "@pnp/graph";
import { NodeFetchWithRetry } from "./fetch.js";
import { MSAL } from "./msal.js";

export interface ISPDefaultProps {
    baseUrl?: string;
    msal: {
        config: Configuration;
        scopes?: string[];
    };
}

export function GraphDefault(props: ISPDefaultProps): TimelinePipe<Queryable2> {

    if (props.baseUrl && !isUrlAbsolute(props.baseUrl)) {
        throw Error("GraphDefault props.baseUrl must be absolute when supplied.");
    }

    return (instance: Queryable2) => {

        instance
            .using(MSAL(props.msal.config, props?.msal?.scopes || ["https://graph.microsoft.com/.default"]))
            .using(NodeFetchWithRetry())
            .using(DefaultParse())
            .using(DefaultHeaders())
            .using(DefaultInit());

        instance.on.pre(async (url, init, result) => {

            if (!isUrlAbsolute(url) && isUrlAbsolute(props.baseUrl)) {
                url = combine(props.baseUrl, url);
            }

            return [url, init, result];
        });

        return instance;
    };
}
