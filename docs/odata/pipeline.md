# @pnp/odata/pipeline

All of the odata requests processed by @pnp/odata pass through an extensible request pipeline. Each request is executed in a specific request context defined by
the RequestContext<T> interface with the type parameter representing the type ultimately returned at the end a successful processing through the
pipeline. Unless you are writing a pipeline method it is unlikely you will ever interact directly with the request pipeline.

## interface RequestContext<T>

The interface that defines the context within which all requests are executed. Note that the pipeline methods to be executed are part of the context. This
allows full control over the methods called during a request, and allows for the insertion of any custom methods required.

```TypeScript
interface RequestContext<T> {
    batch: ODataBatch;
    batchDependency: () => void;
    cachingOptions: ICachingOptions;
    hasResult?: boolean;
    isBatched: boolean;
    isCached: boolean;
    options: FetchOptions;
    parser: ODataParser<T>;
    pipeline: Array<(c: RequestContext<T>) => Promise<RequestContext<T>>>;
    requestAbsoluteUrl: string;
    requestId: string;
    result?: T;
    verb: string;
    clientFactory: () => RequestClient;
}
```

## requestPipelineMethod decorator

The requestPipelineMethod decorator is used to tag a pipeline method and add functionality to bypass processing if a result is already present in the pipeline. If you
would like your method to always run regardless of the existance of a result you can pass true to ensure it will always run. Each pipeline method takes a single argument
of the current RequestContext and returns a promise resolving to the RequestContext updated as needed.

```TypeScript
@requestPipelineMethod(true)
public static myPipelineMethod<T>(context: RequestContext<T>): Promise<RequestContext<T>> {

    return new Promise<RequestContext<T>>(resolve => {

        // do something

        resolve(context);
    });
}
```

## Default Pipeline

1. logs the start of the request
2. checks the cache for a value based on the context's cache settings
3. sends the request if no value from found in the cache
4. logs the end of the request


