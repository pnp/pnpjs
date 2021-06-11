import { Queryable2 } from "@pnp/queryable";

export function Agent(proxyInit: any): (instance: Queryable2) => Queryable2 {

    const proxy = typeof proxyInit === "string" ? new HttpsProxyAgent(proxyInit) : proxyInit;

    return (instance: Queryable2) => {

        instance.on.pre(async (url, init, result) => {

            // we add the proxy to the request
            (<any>init).agent = proxy;

            return [url, init, result];
        });

        return instance;
    };
}
