# Behavior Recipes

This article contains example recipes for building your own behaviors. We don't want to include every possible behavior within the library, but do want folks to have easy ways to solve the problems they encounter. If have ideas for a missing recipe, please let us know in the [issues list](https://github.com/pnp/pnpjs/issues) OR submit them to this page as a PR! We want to see what types of behaviors folks build and will evaluate options to either include them in the main libraries, leave them here as a reference resource, or possibly release a community behaviors package.

> Alternatively we encourage you to publish your own behaviors as npm packages to share with others!

## Proxy

At times you might need to introduce a proxy for requests for debugging or other networking needs. You can easily do so using your proxy of choice in Nodejs. This example uses "https-proxy-agent" but would work similarly for any implementation. 

_proxy.ts_
```TypeScript
import { TimelinePipe } from "@pnp/core";
import { Queryable } from "@pnp/queryable";
import { HttpsProxyAgent } from "https-proxy-agent";

export function Proxy(proxyInit: string): TimelinePipe<Queryable>;
// eslint-disable-next-line no-redeclare
export function Proxy(proxyInit: any): TimelinePipe<Queryable>;
// eslint-disable-next-line no-redeclare
export function Proxy(proxyInit: any): TimelinePipe<Queryable> {

    const proxy = typeof proxyInit === "string" ? new HttpsProxyAgent(proxyInit) : proxyInit;

    return (instance: Queryable) => {

        instance.on.pre(async (url, init, result) => {

            // we add the proxy to the request
            (<any>init).agent = proxy;

            return [url, init, result];
        });

        return instance;
    };
}
```

_usage_
```TypeScript
import { Proxy } from "./proxy.ts";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import { SPDefault } from "@pnp/nodejs";

// would work with graph library in the same manner
const sp = spfi("https://tenant.sharepoint.com/sites.dev").using(SPDefault({
    msal: {
        config: { config },
        scopes: {scopes },
    },
}), Proxy("http://127.0.0.1:8888"));

const webInfo = await sp.webs();
```

## Add QueryString to bypass request caching

In some instances users express a desire to append something to the querystring to avoid getting cached responses back for requests. This pattern is an example of doing that in v3.

_query-cache-param.ts_
```TypeScript
export function CacheBust(): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async (url, init, result) => {

            url += url.indexOf("?") > -1 ? "&" : "?";

            url += "nonce=" + encodeURIComponent(new Date().toISOString());

            return [url, init, result];
        });

        return instance;
    };
}
```

_usage_
```TypeScript
import { CacheBust } from "./query-cache-param.ts";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import { SPDefault } from "@pnp/nodejs";

// would work with graph library in the same manner
const sp = spfi("https://tenant.sharepoint.com/sites.dev").using(SPDefault({
    msal: {
        config: { config },
        scopes: { scopes },
    },
}), CacheBust());

const webInfo = await sp.webs();
```
