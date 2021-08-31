import { TimelinePipe } from "@pnp/core";
import { Queryable } from "@pnp/queryable";
import { HttpsProxyAgent } from "https-proxy-agent";

export function Proxy(proxyInit: string): TimelinePipe<Queryable>;
// eslint-disable-next-line no-redeclare
export function Proxy(proxyInit: any): TimelinePipe<Queryable>;
// eslint-disable-next-line no-redeclare
export function Proxy(proxyInit: any): TimelinePipe<Queryable> {

    const proxy = typeof proxyInit === "string" ? new HttpsProxyAgent(proxyInit) : proxyInit;

    return (instance: Queryable) => {

        instance.on.pre(async (url, init, result) => {

            // we add the proxy to the request
            (<any>init).agent = proxy;

            return [url, init, result];
        });

        return instance;
    };
}
