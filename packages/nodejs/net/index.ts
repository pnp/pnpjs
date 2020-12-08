import { HttpsProxyAgent } from "https-proxy-agent";
export { AdalCertificateFetchClient } from "./adalcertificatefetchclient.js";
export { AdalFetchClient } from "./adalfetchclient.js";
export { BearerTokenFetchClient} from "./bearertokenfetchclient.js";
export { NodeFetchClient } from "./nodefetchclient.js";
export { SPFetchClient } from "./spfetchclient.js";
export { MsalFetchClient } from "./msalfetchclient.js";

declare module "@pnp/common" {
    interface IConfigOptions {
        agent?: HttpsProxyAgent;
    }
}
