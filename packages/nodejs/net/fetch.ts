import { configureProxyOptions } from "./proxy.js";
import { QueryableSendObserver } from "@pnp/queryable";
import { default as nodeFetch } from "node-fetch";

export function fetch(url: string, options: any): Promise<any> {

    options = configureProxyOptions(options);

    return nodeFetch(url, options);
}

export function NodeSend(): QueryableSendObserver {
    return (url: string, init: RequestInit) => fetch(url, init);
}
