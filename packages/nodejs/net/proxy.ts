import { stringIsNullOrEmpty, mergeOptions, IConfigOptions, objectDefinedNotNull } from "@pnp/common";
import { HttpsProxyAgent } from "https-proxy-agent";

let proxyUrl = "";
let proxyAgent = null;

export function configureProxyOptions<T extends IConfigOptions>(opts: T): T & { agent: typeof HttpsProxyAgent } {

    if (!stringIsNullOrEmpty(proxyUrl) || objectDefinedNotNull(proxyAgent)) {
        mergeOptions(opts, {
            agent: proxyAgent || new HttpsProxyAgent(proxyUrl),
        });
    }

    return <T & { agent: typeof HttpsProxyAgent }>opts;
}

/**
 * Sets the given url as a proxy on all requests
 * 
 * @param url The url of the proxy
 */
export function setProxyUrl(url: string) {
    proxyUrl = url;
}

/**
 * Sets the given agent as a proxy on all requests
 * 
 * @param url The proxy agent to use
 */
export function setProxyAgent(agent: any) {
    proxyAgent = agent;
}
