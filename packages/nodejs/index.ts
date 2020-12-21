declare let global: any;
import * as NodeFetch from "node-fetch";

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
import "./sp-extensions/index.js";

// export extension types as a namespace
import * as SPNS from "./sp-extensions/index.js";

export {
    SPNS,
};

export { AADToken, SPOAuthEnv } from "./types.js";
export { ProviderHostedRequestContext } from "./providerhosted.js";
export * from "./net/index.js";
export { setProxyUrl, setProxyAgent } from "./net/proxy.js";
