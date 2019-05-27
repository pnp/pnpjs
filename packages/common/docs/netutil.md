# @pnp/common/netutil

This module contains a set of classes and interfaces used to characterize shared http interactions and configuration of the libraries. Some of the interfaces
are described below (many have no use outside the library) as well as several classes.

## Interfaces

### HttpClientImpl

Defines an implementation of an Http Client within the context of @pnp. This being a class with a a single method "fetch" take a URL and 
options and returning a Promise<Response>. Used primarily with the shared request pipeline to define the client used to make the actual request. You can 
write your own [custom implementation](custom-httpclientimpl.md) if needed.

### RequestClient

An abstraction that contains specific methods related to each of the primary request methods get, post, patch, delete as well as fetch and fetchRaw. The
difference between fetch and fetchRaw is that a client may include additional logic or processing in fetch, where fetchRaw should be a direct call to the
underlying HttpClientImpl fetch method.

## Classes

This module export two classes of note, FetchClient and BearerTokenFetchClient. Both implement HttpClientImpl.

### FetchClient

Basic implementation that calls the global (window) fetch method with no additional processing.

```TypeScript
import { FetchClient } from "@pnp/common";

const client = new FetchClient();

client.fetch("{url}", {});
```

### BearerTokenFetchClient

A simple implementation that takes a provided authentication token and adds the Authentication Bearer header to the request. No other processing is done and 
the token is treated as a static string.

```TypeScript
import { BearerTokenFetchClient } from "@pnp/common";

const client = new BearerTokenFetchClient("{authentication token}");

client.fetch("{url}", {});
```

