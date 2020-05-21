import { stringIsNullOrEmpty, mergeOptions } from "@pnp/common";
import { HttpsProxyAgent } from "https-proxy-agent";

let proxyUrl = "";

export function configureProxyOptions<T>(opts: T): T & { agent?: any } {

    if (!stringIsNullOrEmpty(proxyUrl)) {
        mergeOptions(opts, <any>{
            agent: new HttpsProxyAgent(proxyUrl),
        });
    }

    return opts;
}

/**
 * Sets the given url as a proxy on all requests
 * 
 * @param url The url of the proxy
 */
export function setProxyUrl(url: string) {
    proxyUrl = url;
}
