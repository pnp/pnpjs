# @pnp/odata/queryable

The Queryable class is the base class for all of the libraries building fluent request apis.

## abstract class ODataQueryable<BatchType extends ODataBatch>

This class takes a single type parameter represnting the type of the batch implementation object. If your api will not support batching 
you can create a dummy class here and simply not use the batching calls.

## properties

### query

Provides access to the query builder for this url



## public methods

### concat

Directly concatonates the supplied string to the current url, not normalizing "/" chars

### configure

Sets custom options for current object and all derived objects accessible via chaining

### configureFrom

Sets custom options from another queryable instance's options

### usingCaching

Enables caching for this request. See [caching](caching.md) for more details.

```TypeScript
import { sp } from "@pnp/sp"

sp.web.usingCaching().get().then(...);
```

### inBatch

Adds this query to the supplied batch

### toUrl

Gets the currentl url

### abstract toUrlAndQuery()

When implemented by an inheriting class will build the full url with appropriate query string used to make the actual request

## get

Execute the current request. Takes an optional type parameter allowing for the typing of the value or the user of parsers that will create specific object intances.
