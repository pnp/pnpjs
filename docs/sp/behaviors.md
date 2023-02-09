# @pnp/sp : behaviors

The article describes the behaviors exported by the `@pnp/sp` library. Please also see available behaviors in [@pnp/core](../core/behaviors.md), [@pnp/queryable](../queryable/behaviors.md), [@pnp/graph](../graph/behaviors.md), and [@pnp/nodejs](../nodejs/behaviors.md).

## DefaultInit

The `DefaultInit` behavior, is a composed behavior which includes Telemetry, RejectOnError, and ResolveOnData. Additionally, it sets the cache and credentials properties of the RequestInit.

```TypeScript
import { spfi, DefaultInit } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(DefaultInit());

await sp.web();
```

## DefaultHeaders

The `DefaultHeaders` behavior uses InjectHeaders to set the Accept, Content-Type, and User-Agent headers.

```TypeScript
import { spfi, DefaultHeaders } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(DefaultHeaders());

await sp.web();
```

> DefaultInit and DefaultHeaders are separated to make it easier to create your own default headers or init behavior. You should include both if composing your own default behavior.

## RequestDigest

The `RequestDigest` behavior ensures that the "X-RequestDigest" header is included for requests where it is needed. If you are using MSAL, supplying your own tokens, or doing a GET request it is not required. As well it cache's the digests to reduce the number of requests.

Optionally you can provide a function to supply your own digests. The logic followed by the behavior is to check the cache, run a hook if provided, and finally make a request to "/_api/contextinfo" for the value.

```TypeScript
import { spfi, RequestDigest } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(RequestDigest());

await sp.web();
```

With a hook:

```TypeScript
import { dateAdd } from "@pnp/core";
import { spfi, RequestDigest } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(RequestDigest((url, init) => {

    // the url will be a URL instance representing the request url
    // init will be the RequestInit

    return {
        expiration: dateAdd(new Date(), "minute", 20);
        value: "MY VALID REQUEST DIGEST VALUE";
    }
}));

await sp.web();
```

## SPBrowser

A composed behavior suitable for use within a SPA or other scenario outside of SPFx. It includes DefaultHeaders, DefaultInit, BrowserFetchWithRetry, DefaultParse, and RequestDigest. As well it adds a pre observer to try and ensure the request url is absolute if one is supplied in props.

The baseUrl prop can be used to configure a fallback when making urls absolute.

> If you are building a SPA you likely need to handle authentication. For this we support the [msal library](../concepts/authentication.md#MSAL-in-Browser) which you can use directly or as a pattern to roll your own MSAL implementation behavior.

You should set a baseUrl as shown below.

```TypeScript
import { spfi, SPBrowser } from "@pnp/sp";
import "@pnp/sp/webs";

// you should use the baseUrl value when working in a SPA to ensure it is always properly set for all requests
const sp = spfi().using(SPBrowser({ baseUrl: "https://tenant.sharepoint.com/sites/dev" }));

await sp.web();
```

## SPFx

This behavior is designed to work closely with SPFx. The only parameter is the current SPFx Context. `SPFx` is a composed behavior including DefaultHeaders, DefaultInit, BrowserFetchWithRetry, DefaultParse, and RequestDigest. A hook is supplied to RequestDigest that will attempt to use any existing legacyPageContext formDigestValue it can find, otherwise defaults to the base [RequestDigest](#requestdigest) behavior. It also sets a pre handler to ensure the url is absolute, using the SPFx context's pageContext.web.absoluteUrl as the base.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

// this.context represents the context object within an SPFx webpart, application customizer, or ACE.
const sp = spfi(...).using(SPFx(this.context));

await sp.web();
```

Note that both the sp and graph libraries export an SPFx behavior. They are unique to their respective libraries and cannot be shared, i.e. you can't use the graph SPFx to setup sp and vice-versa.

```TypeScript
import { GraphFI, graphfi, SPFx as graphSPFx } from '@pnp/graph'
import { SPFI, spfi, SPFx as spSPFx } from '@pnp/sp'

const sp = spfi().using(spSPFx(this.context));
const graph = graphfi().using(graphSPFx(this.context));
```

## SPFxToken

_Added in 3.12_

Allows you to include the SharePoint Framework application token in requests. This behavior is include within the SPFx behavior, but is available separately should you wish to compose it into your own behaviors.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";

// this.context represents the context object within an SPFx webpart, application customizer, or ACE.
const sp = spfi(...).using(SPFxToken(this.context));

await sp.web();
```

## Telemetry

This behavior helps provide usage statistics to us about the number of requests made to the service using this library, as well as the methods being called. We do not, and cannot, access any PII information or tie requests to specific users. The data aggregates at the tenant level. We use this information to better understand how the library is being used and look for opportunities to improve high-use code paths.

> You can always opt out of the telemetry by creating your own default behaviors and leaving it out. However, we encourgage you to include it as it helps us understand usage and impact of the work.

```TypeScript
import { spfi, Telemetry } from "@pnp/sp";
import "@pnp/sp/webs";

const sp = spfi().using(Telemetry());

await sp.web();
```
