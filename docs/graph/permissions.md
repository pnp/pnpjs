# @pnp/graph/permissions

Allows you to manipulate the permissions of various entities.

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## site permissions

[![Official Docs](https://img.shields.io/badge/Official_Graph_Docs-social.svg)](https://learn.microsoft.com/en-us/graph/api/resources/permission?view=graph-rest-1.0)

Allows you to manage application permissions for sites.

### list site permissions

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/permissions";

const graph = graphfi(...);

const permissions = await graph.sites.getById("{site id}").permissions();
```

### get a site permission

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/permissions";

const graph = graphfi(...);

const permissions = await graph.sites.getById("{site id}").permissions.getById("{permission id}")();
```

### add a site permission

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/permissions";

const graph = graphfi(...);

const permissions = await graph.sites.getById("{site id}").permissions.add({
  roles: ["fullcontrol"],
  grantedToIdentities: [{
    application: {
      id: "89ea5c94-7736-4e25-95ad-3fa95f62b66e",
      displayName: "Contoso Time Manager App",
    }
  }],
});
```

### update a site permission

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/permissions";

const graph = graphfi(...);

const permissions = await graph.sites.getById("{site id}").permissions.getById("{permission id}").update({
    roles: ["read"],
});
```

### delete a site permission

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/permissions";

const graph = graphfi(...);

const permissions = await graph.sites.getById("{site id}").permissions.getById("{permission id}").delete();
```
