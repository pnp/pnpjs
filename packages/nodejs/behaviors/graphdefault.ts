import { Configuration } from "@azure/msal-node";
import { combine, isUrlAbsolute, TimelinePipe } from "@pnp/core";
import { DefaultParse, Queryable } from "@pnp/queryable";
import { DefaultHeaders, DefaultInit } from "@pnp/graph";
import { NodeFetchWithRetry } from "./fetch.js";
import { MSAL } from "./msal.js";

export interface IGraphDefaultProps {
    baseUrl?: string;
    msal?: {
        config: Configuration;
        scopes?: string[];
    };
}

/**
 * Behavior for adding the default observers to the Graph queryable object
 * @param props - Specify the IGraphDefaultProps for configuring the object
 *        props.msal: (deprecated, use separate MSAL behavior)
 */
export function GraphDefault(props?: IGraphDefaultProps): TimelinePipe<Queryable> {

    if (props?.baseUrl && !isUrlAbsolute(props?.baseUrl)) {
        throw Error("GraphDefault props.baseUrl must be absolute when supplied.");
    }

    const { baseUrl, msal } = {
        baseUrl: "https://graph.microsoft.com/",
        ...props,
    };

    return (instance: Queryable) => {
        const behaviors: TimelinePipe<any>[] = [DefaultHeaders(), DefaultInit(), NodeFetchWithRetry(), DefaultParse()];
        if(props?.msal){
            behaviors.push(MSAL(msal.config, msal?.scopes || [combine(baseUrl, ".default")]));
        }
        instance.using(...behaviors);

        instance.on.pre(async (url, init, result) => {

            if (!isUrlAbsolute(url)) {
                url = combine(baseUrl, url);
            }

            return [url, init, result];
        });

        return instance;
    };
}
