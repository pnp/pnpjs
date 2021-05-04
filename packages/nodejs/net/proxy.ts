import { stringIsNullOrEmpty, mergeOptions, IConfigOptions, objectDefinedNotNull } from "@pnp/common";
import pkg from "https-proxy-agent";
const { HttpsProxyAgent } = pkg;

let proxyUrl = "";
let proxyAgent = null;

export function configureProxyOptions<T extends IConfigOptions>(opts: T): T & { agent: typeof pkg } {

    if (!stringIsNullOrEmpty(proxyUrl) || objectDefinedNotNull(proxyAgent)) {
        mergeOptions(opts, {
            agent: proxyAgent || new HttpsProxyAgent(proxyUrl),
        });
    }

    return <T & { agent: typeof pkg }>opts;
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
