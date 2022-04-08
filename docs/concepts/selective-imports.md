# Selective Imports

As the libraries have grown to support more of the SharePoint and Graph API they have also grown in size. On one hand this is good as more functionality becomes available but you had to include lots of code you didn't use if you were only doing simple operations. To solve this we introduced selective imports. This allows you to only import the parts of the sp or graph library you need, allowing you to greatly reduce your overall solution bundle size - and enables [treeshaking](https://github.com/rollup/rollup#tree-shaking).

This concept works well with [custom bundling](./custom-bundle.md) to create a shared package tailored exactly to your needs.

If you would prefer to not worry about selective imports please see the section on [presets](#presets).

> A quick note on how TypeScript handles type only imports. If you have a line like `import { IWeb } from "@pnp/sp/webs"` everything will transpile correctly but you will get runtime errors because TS will see that line as a type only import and drop it. You need to include both `import { IWeb } from "@pnp/sp/webs"` and `import "@pnp/sp/webs"` to ensure the webs functionality is correctly included. You can see this in the last example below.

```TypeScript
// the sp var now has almost nothing attached at import time and relies on

// we need to import each of the pieces we need to "attach" them for chaining
// here we are importing the specific sub modules we need and attaching the functionality for lists to web and items to list
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";

// placeholder for fully configuring the sp interface
const sp = spfi();

const itemData = await sp.web.lists.getById('00000000-0000-0000-0000-000000000000').items.getById(1)();
```

Above we are being very specific in what we are importing, but you can also import entire sub-modules and be slightly less specific

```TypeScript
// the sp var now has almost nothing attached at import time and relies on

// we need to import each of the pieces we need to "attach" them for chaining
// here we are importing the specific sub modules we need and attaching the functionality for lists to web and items to list
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

// placeholder for fully configuring the sp interface
const sp = spfi();

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

The below example shows the need to import types and module augmentation separately.

```TypeScript
// this will fail
import "@pnp/sp/webs";
import { IList } from "@pnp/sp/lists";

// do this instead
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import { IList } from "@pnp/sp/lists";

// placeholder for fully configuring the sp interface
const sp = spfi();

const lists = await sp.web.lists();
```

## Presets

Sometimes you don't care as much about bundle size - testing or node development for example. In these cases we have provided what we are calling presets to allow you to skip importing each module individually. Both libraries supply an "all" preset that will attach all of the available library functionality.

> While the presets provided may be useful, we encourage you to look at making your own [project presets](./project-preset.md) or [custom bundles](./custom-bundle.md) as a preferred solution. Use of the presets in client-side solutions is not recommended.

## SP

```TypeScript
import "@pnp/sp/presets/all";


// placeholder for fully configuring the sp interface
const sp = spfi();

// sp.* will have all of the library functionality bound to it, tree shaking will not work
const lists = await sp.web.lists();
```

## Graph

The graph library contains a single preset, "all" mimicking the v1 structure.

```TypeScript
import "@pnp/graph/presets/all";
import { graphfi } from "@pnp/graph";

// placeholder for fully configuring the sp interface
const graph = graphfi();

// graph.* will have all of the library functionality bound to it, tree shaking will not work
const me = await graph.me();
```
