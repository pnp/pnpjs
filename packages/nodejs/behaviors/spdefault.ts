import { Configuration } from "@azure/msal-node";
import { combine, isUrlAbsolute, TimelinePipe } from "@pnp/core";
import { DefaultParse, Queryable } from "@pnp/queryable";
import { DefaultHeaders, DefaultInit } from "@pnp/sp";
import { NodeFetchWithRetry } from "./fetch.js";
import { MSAL } from "./msal.js";

export interface ISPDefaultProps {
    baseUrl?: string;
    msal?: {
        config: Configuration;
        scopes: string[];
    };
}

/**
 * Behavior for adding the default observers to the SP queryable object
 * @param props - Specify the ISPDefaultProps for configuring the object
 *        props.msal: (deprecated, use separate MSAL behavior)
 */
export function SPDefault(props?: ISPDefaultProps): TimelinePipe<Queryable> {

    if (props?.baseUrl && !isUrlAbsolute(props?.baseUrl)) {
        throw Error("SPDefault props.baseUrl must be absolute when supplied.");
    }

    return (instance: Queryable) => {
        const behaviors: TimelinePipe<any>[] = [DefaultHeaders(), DefaultInit(), NodeFetchWithRetry(), DefaultParse()];
        if(props?.msal){
            behaviors.push(MSAL(props.msal.config, props.msal.scopes));
        }
        instance.using(...behaviors);

        instance.on.pre.prepend(async (url, init, result) => {

            if (!isUrlAbsolute(url)) {
                url = combine(props?.baseUrl, url);
            }

            return [url, init, result];
        });

        return instance;
    };
}
