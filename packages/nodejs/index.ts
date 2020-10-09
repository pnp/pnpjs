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

// auto populate all extensions
import "./sp-extensions";

// export extension types as a namespace
import * as SPNS from "./sp-extensions";

export {
    SPNS,
};

export { AADToken, SPOAuthEnv } from "./types";
export { ProviderHostedRequestContext } from "./providerhosted";
export * from "./net/index";
export { setProxyUrl, setProxyAgent } from "./net/proxy";
