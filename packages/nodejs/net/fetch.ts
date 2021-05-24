import { configureProxyOptions } from "./proxy.js";
import { QueryableSendObserver, Queryable2 } from "@pnp/queryable";
import { default as nodeFetch } from "node-fetch";

export function fetch(url: string, options: any): Promise<any> {

    options = configureProxyOptions(options);

    return nodeFetch(url, options);
}

export function NodeSend(): (instance: Queryable2) => Queryable2 {
    return (instance: Queryable2) => {
        instance.on.send(NodeSend2());
        return instance;
    };
}

export function NodeSend2(): QueryableSendObserver {
    return (url: string, init: RequestInit) => fetch(url, init);
}
