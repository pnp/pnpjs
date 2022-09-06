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

## ACS Authentication

Starting with v3 we no longer provide support for ACS authentication within the library. However you may have a need (legacy applications, on-premises) to use ACS authentication while wanting to migrate to v3. Below you can find an example implementation of an Authentication observer for ACS. This is not a 100% full implementation, for example the tokens are not cached.

> Whenever possible we encourage you to use AAD authentication and move away from ACS for securing your server-side applications.

```Typescript
export function ACS(clientId: string, clientSecret: string, authUrl = "https://accounts.accesscontrol.windows.net"): (instance: Queryable) => Queryable {

  const SharePointServicePrincipal = "00000003-0000-0ff1-ce00-000000000000";

  async function getRealm(siteUrl: string): Promise<string> {

    const url = combine(siteUrl, "_vti_bin/client.svc");

    const r = await nodeFetch(url, {
      "headers": {
        "Authorization": "Bearer ",
      },
      "method": "POST",
    });

    const data: string = r.headers.get("www-authenticate") || "";
    const index = data.indexOf("Bearer realm=\"");
    return data.substring(index + 14, index + 50);
  }

  function getFormattedPrincipal(principalName: string, hostName: string, realm: string): string {
    let resource = principalName;
    if (hostName !== null && hostName !== "") {
      resource += "/" + hostName;
    }
    resource += "@" + realm;
    return resource;
  }

  async function getFullAuthUrl(realm: string): Promise<string> {

    const url = combine(authUrl, `/metadata/json/1?realm=${realm}`);

    const r = await nodeFetch(url, { method: "GET" });
    const json: { endpoints: { protocol: string; location: string }[] } = await r.json();

    const eps = json.endpoints.filter(ep => ep.protocol === "OAuth2");
    if (eps.length > 0) {
      return eps[0].location;
    }

    throw Error("Auth URL Endpoint could not be determined from data.");
  }

  return (instance: Queryable) => {

    instance.on.auth.replace(async (url: URL, init: RequestInit) => {

      const realm = await getRealm(url.toString());
      const fullAuthUrl = await getFullAuthUrl(realm);

      const resource = getFormattedPrincipal(SharePointServicePrincipal, url.host, realm);
      const formattedClientId = getFormattedPrincipal(clientId, "", realm);

      const body: string[] = [];
      body.push("grant_type=client_credentials");
      body.push(`client_id=${formattedClientId}`);
      body.push(`client_secret=${encodeURIComponent(clientSecret)}`);
      body.push(`resource=${resource}`);

      const r = await nodeFetch(fullAuthUrl, {
        body: body.join("&"),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
      });

      const accessToken: { access_token: string } = await r.json();

      init.headers = { ...init.headers, Authorization: `Bearer ${accessToken.access_token}` };

      return [url, init];
    });

    return instance;
  };
}
```

_usage_
```Typescript
import { CacheBust } from "./acs-auth-behavior.ts";
import "@pnp/sp/webs";
import { SPDefault } from "@pnp/nodejs";

const sp = spfi("https://tenant.sharepoint.com/sites.dev").using(SPDefault(), ACS("{client id}", "{client secret}"));

// you can optionally provide the authentication url, here using the one for China's sovereign cloud or an local url if working on-premises
// const sp = spfi("https://tenant.sharepoint.com/sites.dev").using(SPDefault(), ACS("{client id}", "{client secret}", "https://accounts.accesscontrol.chinacloudapi.cn"));

const webInfo = await sp.webs();
```
