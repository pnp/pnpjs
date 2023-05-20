# @pnp/graph/search

The search module allows you to access the Microsoft Graph Search API. You can read full details of using the API, for library examples please see below.

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Call graph.query

This example shows calling the search API via the `query` method of the root graph object.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/search";

const graph = graphfi(...);

const results = await graph.query({
    entityTypes: ["site"],
    query: {
        queryString: "test"
    },
});
```

> Note: This library allows you to pass multiple search requests to the `query` method as the value consumed by the server is an array, but it only a single requests works at this time. Eventually this may change and no updates will be required.
