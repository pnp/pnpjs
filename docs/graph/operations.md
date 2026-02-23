# @pnp/graph/operations

Provides capabilities related to rich long-running operations.

More information can be found in the official Graph documentation:

- [Operations Resource Type](https://docs.microsoft.com/en-us/graph/api/site-list-operations?view=graph-rest-1.0)


[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## list site operations

```TypeScript
import "@pnp/graph/sites";
import "@pnp/graph/operations";

const graph = graphfi(...);

// using getByUrl
const site = await graph.sites.getByUrl("tenant.sharepoint.com", "/sites/dev");

const ops = await site.operations();

// using site id
const ops2 = await graph.sites.getById("{site id}").operations();
```
