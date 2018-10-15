declare var global: any;
declare var require: (path: string) => any;
const NodeFetch = require("node-fetch");

(function (g) {

    // patch these globally for nodejs
    if (!g.Headers) {
        g.Headers = NodeFetch.Headers;
    }
    if (!g.Request) {
        g.Request = NodeFetch.Request;
    }
    if (!g.Response) {
        g.Response = NodeFetch.Response;
    }

})(global);


export { SPFetchClient, SPOAuthEnv } from "./net/spfetchclient";
export { SPFetchClientRetry, IRetryData } from "./net/spfetchclientretry";
export { AdalFetchClient, AADToken } from "./net/adalfetchclient";
