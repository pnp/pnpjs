import { Configuration } from "@azure/msal-node";
import { combine, isUrlAbsolute, TimelinePipe } from "@pnp/core";
import { DefaultParse, Queryable } from "@pnp/queryable";
import { DefaultHeaders, DefaultInit } from "@pnp/graph";
import { NodeFetchWithRetry } from "./fetch.js";
import { MSAL } from "./msal.js";

export interface IGraphDefaultProps {
    baseUrl?: string;
    msal: {
        config: Configuration;
        scopes?: string[];
    };
}

export function GraphDefault(props: IGraphDefaultProps): TimelinePipe<Queryable> {

    if (props.baseUrl && !isUrlAbsolute(props.baseUrl)) {
        throw Error("GraphDefault props.baseUrl must be absolute when supplied.");
    }

    return (instance: Queryable) => {

        instance
            .using(MSAL(props.msal.config, props?.msal?.scopes || ["https://graph.microsoft.com/.default"]))
            .using(NodeFetchWithRetry())
            .using(DefaultParse())
            .using(DefaultHeaders())
            .using(DefaultInit());

        instance.on.pre(async (url, init, result) => {

            if (!isUrlAbsolute(url)) {

                if (isUrlAbsolute(props.baseUrl)) {
                    url = combine(props.baseUrl, url);
                } else {
                    url = combine("https://graph.microsoft.com/", url);
                }
            }

            return [url, init, result];
        });

        return instance;
    };
}
