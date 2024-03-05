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

export * from "./behaviors/msal.js";
export * from "./behaviors/fetch.js";
export * from "./behaviors/spdefault.js";
export * from "./behaviors/graphdefault.js";
