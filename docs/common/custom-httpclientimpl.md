# Custom HttpClientImpl

**This should be considered an advanced topic and creating a custom HttpClientImpl is not something you will likely need to do. Also, we don't offer support beyond this article for writing your own implementation.**

It is possible you may need complete control over the sending and receiving of requests.

Before you get started read and understand the [fetch specification](https://fetch.spec.whatwg.org/) as you are essentially writing a custom fetch implementation.

The first step (second if you read the fetch spec as mentioned just above) is to understand the interface you need to implement, HttpClientImpl.

```TypeScript
export interface HttpClientImpl {
    fetch(url: string, options: FetchOptions): Promise<Response>;
}
```

There is a single method "fetch" which takes a url string and a set of options. These options can be just about anything but are constrained within the library to the FetchOptions interface.

```TypeScript
export interface FetchOptions {
    method?: string;
    headers?: HeadersInit | { [index: string]: string };
    body?: BodyInit;
    mode?: string | RequestMode;
    credentials?: string | RequestCredentials;
    cache?: string | RequestCache;
}
```

So you will need to handle any of those options along with the provided url when sending your request. The library will expect your implementation to return a Promise that resolves to a Response defined by the [fetch specification](https://fetch.spec.whatwg.org/) - which you've already read 👍.

## Using Your Custom HttpClientImpl

Once you have written your implementation using it on your requests is done by setting it in the global library configuration:

```TypeScript
import { setup } from "@pnp/common";
import { sp, Web } from "@pnp/sp";
import { MyAwesomeClient } from "./awesomeclient";

sp.setup({
    sp: {
        fetchClientFactory: () => {
            return new MyAwesomeClient();
        }
    }
});

let w = new Web("{site url}");

// this request will use your client.
w.select("Title").get().then(w => {
    console.log(w);
});
```

## Subclassing is Better

You can of course inherit from one of the implementations available within the @pnp scope if you just need to say add a header or need to do _something_ to every request sent. Perhaps some advanced logging. This approach will save you from needing to fully write a fetch implementation.

# A FINAL NOTE

Whatever you do, **do not** write a client that uses a client id and secret and exposes them on the client side. Client Id and Secret should only ever be used on a server, never exposed to clients as anyone with those values has the full permissions granted to that id and secret.


