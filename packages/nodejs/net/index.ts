import { HttpsProxyAgent } from "https-proxy-agent";
export { AdalCertificateFetchClient } from "./adalcertificatefetchclient";
export { AdalFetchClient } from "./adalfetchclient";
export { BearerTokenFetchClient} from "./bearertokenfetchclient";
export { NodeFetchClient } from "./nodefetchclient";
export { SPFetchClient } from "./spfetchclient";
export { MsalFetchClient } from "./msalfetchclient";

declare module "@pnp/common" {
    interface IConfigOptions {
        agent?: HttpsProxyAgent;
    }
}
