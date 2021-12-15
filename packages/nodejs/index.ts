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
import "./sp-extensions/stream.js";

// export extension types as a namespace
import * as SPNS from "./sp-extensions/stream.js";

export {
    SPNS,
};

export * from "./behaviors/msal.js";
export * from "./behaviors/fetch.js";
export * from "./behaviors/stream-parse.js";
export * from "./behaviors/spdefault.js";
export * from "./behaviors/graphdefault.js";
