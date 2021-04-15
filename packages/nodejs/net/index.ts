import { HttpsProxyAgent } from "https-proxy-agent";
export { AdalCertificateFetchClient } from "./adalcertificatefetchclient.js";
export { AdalFetchClient } from "./adalfetchclient.js";
export { BearerTokenFetchClient } from "./bearertokenfetchclient.js";
export { NodeFetchClient } from "./nodefetchclient.js";
export { SPFetchClient } from "./spfetchclient.js";
export { MsalFetchClient } from "./msalfetchclient.js";
export * from "./msal.js";
export { NodeSend } from "./fetch.js";

declare module "@pnp/common" {
    interface IConfigOptions {
        agent?: HttpsProxyAgent;
    }
}
