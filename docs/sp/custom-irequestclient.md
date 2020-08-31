# Custom IRequestClient

Scenario: You have some special requirements involving auth scenarios or other needs that the library can't directly support. You may need to create a custom IRequestClient implementation to meet those needs as we can't customize the library to handle every case. This article walks you through how to create a custom IRequestClient and register it for use by the library.

> It is very unlikely this is a step you ever need to take and we encourage you to ask a question in the [issues list](https://github.com/pnp/pnpjs/issues) before going down this path.

## Create the Client

The easiest way to create a new IRequestClient is to subclass the existing SPHttpClient. You can always write a full client from scratch so long as it supports the IRequestClient interface but you need to handle all of the logic for retry, headers, and the request digest.

Here we show implementing a client to solve the need discussed in [pull request 1264](https://github.com/pnp/pnpjs/pull/1264) as an example.

```ts
// we subclass SPHttpClient
class CustomSPHttpClient extends SPHttpClient {

  // optionally add a constructor, done here as an example
  constructor(impl?: IHttpClientImpl) {
    super(impl);
  }

  // override the fetchRaw method to ensure we always include the credentials = "include" option
  // you could also override fetch, but fetchRaw ensures no matter what all requests get your custom logic is applied
  public fetchRaw(url: string, options?: IFetchOptions): Promise<Response> {
    options.credentials = "include";
    return super.fetchRaw(url, options);
  }
}
```

The final step is to register the custom client with the library so it is used instead of the default. For that we import the `registerCustomRequestClientFactory` function and call it before our request generating code. You can reset to the default client factory by passing `null` to this same function.

```ts
import { sp, registerCustomRequestClientFactory } from "@pnp/sp";
import "@pnp/sp/webs";

registerCustomRequestClientFactory(() => new CustomSPHttpClient());

// configure your other options
sp.setup({
    // ...
});

// this request will be executed through your custom client
const w = await sp.web();
```

### Unregister Custom Client

```ts
// unregister custom client factory
registerCustomRequestClientFactory(null);
```

## IRequestClient Interface

If you want to 100% roll your own client you need to implement the below interface, found in common.

```ts
import { IRequestClient } from "@pnp/common";
```

```ts
export interface IRequestClient {
    fetch(url: string, options?: IFetchOptions): Promise<Response>;
    fetchRaw(url: string, options?: IFetchOptions): Promise<Response>;
    get(url: string, options?: IFetchOptions): Promise<Response>;
    post(url: string, options?: IFetchOptions): Promise<Response>;
    patch(url: string, options?: IFetchOptions): Promise<Response>;
    delete(url: string, options?: IFetchOptions): Promise<Response>;
}
```

## Supportability Note

We cannot provide support for your custom client implementation, and creating your own client assumes an intimate knowledge of how SharePoint requests work. Again, this is very likely something you will never need to do - and we recommend exhausting all other options before taking this route.
