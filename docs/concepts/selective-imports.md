# Selective Imports

As the libraries have grown to support more of the SharePoint and Graph API they have also grown in size. On one hand this is good as more functionality becomes available but you had to include lots of code you didn't use if you were only doing simple operations. To solve this we introduced selective imports in v2. This allows you to only import the parts of the sp or graph library you need, allowing you to greatly reduce your overall solution bundle size - and enables [treeshaking](https://github.com/rollup/rollup#tree-shaking).

This concept works well with [custom bundling](./custom-bundle.md) to create a shared package tailored exactly to your needs.

If you would prefer to not worry about selective imports please see the section on [presets](#presets).

## Old way

```TypeScript
// the sp var came with all library functionality already attached
// meaning treeshaking couldn't reduce the size
import { sp } from "@pnp/sp";

const itemData = await sp.web.lists.getById('00000000-0000-0000-0000-000000000000').items.getById(1).get();
```

## New Way

```TypeScript
// the sp var now has almost nothing attached at import time and relies on
import { sp } from "@pnp/sp";
// we need to import each of the pieces we need to "attach" them for chaining
// here we are importing the specific sub modules we need and attaching the functionality for lists to web and items to list
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";

const itemData = await sp.web.lists.getById('00000000-0000-0000-0000-000000000000').items.getById(1)();
```

Above we are being very specific in what we are importing, but you can also import entire sub-modules and be slightly less specific

```TypeScript
// the sp var now has almost nothing attached at import time and relies on
import { sp } from "@pnp/sp";
// we need to import each of the pieces we need to "attach" them for chaining
// here we are importing the specific sub modules we need and attaching the functionality for lists to web and items to list
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const itemData = await sp.web.lists.getById('00000000-0000-0000-0000-000000000000').items.getById(1)();
```

The above two examples both work just fine but you may end up with slightly smaller bundle sizes using the first. Consider this example:

```TypeScript
// this import statement will attach content-type functionality to list, web, and item
import "@pnp/sp/content-types";

// this import statement will only attach content-type functionality to web
import "@pnp/sp/content-types/web";
```

If you only need to access content types on the web object you can reduce size by only importing that piece.

> **Gotcha**
> If you import only an interface from a sub-module AND rely on the functionality within that module you need to include two separate imports. The reason being that during testing it will pull the default imports (because we are using ts-node) but the interface only import statement will be stripped when it is transpiled.

```TypeScript
// this will fail
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import { IList } from "@pnp/sp/lists";

// do this instead
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import { IList } from "@pnp/sp/lists";

const lists = await sp.web.lists();
```

## Presets

Sometimes you don't care as much about bundle size - testing or node development for example. In these cases we have provided what we are calling presets to allow you to skip importing each module individually.

## SP

For the sp library there are two presets "all" and "core". The all preset mimics the behavior in v1 and includes everything in the library already attached to the sp var.

```TypeScript
import { sp } from "@pnp/sp/presets/all";

// sp.* exists as it did in v1, tree shaking will not work
const lists = await sp.web.lists();
```

The "core" preset includes sites, webs, lists, and items.

```TypeScript
import { sp } from "@pnp/sp/presets/core";

// sp.* exists as it did in v1, tree shaking will not work
const lists = await sp.web.lists();
```

## Graph

The graph library contains a single preset, "all" mimicking the v1 structure.

```TypeScript
import { graph } from "@pnp/graph/presets/all";

// graph.* exists as it did in v1, tree shaking will not work
```

> While we may look to add additional presets in the future you are encouraged to look at making your own [custom bundles](./custom-bundle.md) as a preferred solution.
