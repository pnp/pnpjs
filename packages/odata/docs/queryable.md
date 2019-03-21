# @pnp/odata/queryable

The Queryable class is the base class for all of the libraries building fluent request apis.

## abstract class ODataQueryable<BatchType extends ODataBatch>

This class takes a single type parameter representing the type of the batch implementation object. If your api will not support batching 
you can create a dummy class here and simply not use the batching calls.

## properties

### query

Provides access to the query string builder for this url

## public methods

### concat

Directly concatenates the supplied string to the current url, not normalizing "/" chars

### configure

Sets custom options for current object and all derived objects accessible via chaining

```TypeScript
import { ConfigOptions } from "@pnp/odata";
import { sp } from "@pnp/sp";

const headers: ConfigOptions = {
    Accept: 'application/json;odata=nometadata'
};

// here we use configure to set the headers value for all child requests of the list instance
const list = sp.web.lists.getByTitle("List1").configure({ headers });

// this will use the values set in configure
list.items.get().then(items => console.log(JSON.stringify(items, null, 2));
```

For reference the ConfigOptions interface is shown below:
```TypeScript
export interface ConfigOptions {
    headers?: string[][] | { [key: string]: string } | Headers;
    mode?: "navigate" | "same-origin" | "no-cors" | "cors";
    credentials?: "omit" | "same-origin" | "include";
    cache?: "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached";
}
```

### configureFrom

Sets custom options from another queryable instance's options. Identical to configure except the options are derived from the supplied instance.

### usingCaching

Enables caching for this request. See [caching](caching.md) for more details.

```TypeScript
import { sp } from "@pnp/sp"

sp.web.usingCaching().get().then(...);
```

### inBatch

Adds this query to the supplied batch

### toUrl

Gets the current url

### abstract toUrlAndQuery()

When implemented by an inheriting class will build the full url with appropriate query string used to make the actual request

## get

Execute the current request. Takes an optional type parameter allowing for the typing of the value or the user of parsers that will create specific object instances.
