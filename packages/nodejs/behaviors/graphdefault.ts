import { Configuration } from "@azure/msal-node";
import { combine, TimelinePipe } from "@pnp/core";
import { DefaultParse, Queryable } from "@pnp/queryable";
import { DEFAULT_GRAPH_URL, DefaultHeaders, DefaultInit } from "@pnp/graph";
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

    const { baseUrl, msal } = {
        baseUrl: DEFAULT_GRAPH_URL,
        ...props,
    };

    return (instance: Queryable) => {

        const behaviors: TimelinePipe<any>[] = [DefaultHeaders(), DefaultInit(baseUrl), NodeFetchWithRetry(), DefaultParse()];

        if (props?.msal) {
            const u = new URL(baseUrl);
            behaviors.push(MSAL(msal.config, msal?.scopes || [combine(`${u.protocol}//${u.host}`, ".default")]));
        }

        instance.using(...behaviors);

        return instance;
    };
}
