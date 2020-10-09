# @pnp/nodejs/proxy

In some cases when deploying on node you may need to use a proxy as governed by corporate policy, or perhaps you want to examine the traffic using a tool such as Fiddler.

# setProxyUrl

## Basic Usage

You need to import the `setProxyUrl` function from @pnp/nodejs library and call it with your proxy url. Once done an [https-proxy-agent](https://github.com/TooTallNate/node-https-proxy-agent) will be used with each request. This works across all clients within the @pnp/nodejs library.

```TypeScript
import { SPFetchClient, SPOAuthEnv, setProxyUrl } from "@pnp/nodejs";

sp.setup({
    sp: {
        fetchClientFactory: () => {

            // call the set proxy url function and it will be used for all requests regardless of client
            setProxyUrl("{your proxy url}");
            return new SPFetchClient(settings.testing.sp.url, settings.testing.sp.id, settings.testing.sp.secret, SPOAuthEnv.SPO);
        },
    },
});
```

## Use with Fiddler

To get Fiddler to work you may need to set an environment variable. __This should only be done for testing!__

```TypeScript
import { SPFetchClient, SPOAuthEnv, setProxyUrl } from "@pnp/nodejs";

sp.setup({
    sp: {
        fetchClientFactory: () => {

            // ignore certificate errors: ONLY FOR TESTING!!
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

            // this is my fiddler url locally
            setProxyUrl("http://127.0.0.1:8888");
            return new SPFetchClient(settings.testing.sp.url, settings.testing.sp.id, settings.testing.sp.secret, SPOAuthEnv.SPO);
        },
    },
});
```   

# setProxyAgent

_Added in 2.0.11_

You need to import the `setProxyAgent` function from @pnp/nodejs library and call it with your proxy url. You can supply any valid proxy and it will be used.

```TypeScript
import { SPFetchClient, SPOAuthEnv, setProxyAgent } from "@pnp/nodejs";

sp.setup({
    sp: {
        fetchClientFactory: () => {

            const myAgent = new MyAgentOfSomeType({});

            // call the set proxy agent function and it will be used for all requests regardless of client
            setProxyAgent(myAgent);
            return new SPFetchClient(settings.testing.sp.url, settings.testing.sp.id, settings.testing.sp.secret, SPOAuthEnv.SPO);
        },
    },
});
```
