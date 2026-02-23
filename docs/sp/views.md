# @pnp/sp/views

Views define the columns, ordering, and other details we see when we look at a list. You can have multiple views for a list, including private views - and one default view.

## IViews

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

### Get views in a list

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";

const sp = spfi(...);

const list = sp.web.lists.getByTitle("My List");

// get all the views and their properties
const views1 = await list.views();

// you can use odata select operations to get just a set a fields
const views2 = await list.views.select("Id", "Title")();

// get the top three views
const views3 = await list.views.top(3)();
```

### Add a View

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";

const sp = spfi(...);

const list = sp.web.lists.getByTitle("My List");

// create a new view with default fields and properties
const result = await list.views.add("My New View");

// create a new view with specific properties
const result2 = await list.views.add("My New View 2", false, {
    RowLimit: 10,
    ViewQuery: "<OrderBy><FieldRef Name='Modified' Ascending='False' /></OrderBy>",
});

// manipulate the view's fields
await result2.view.fields.removeAll();

await Promise.all([
    result2.view.fields.add("Title"),
    result2.view.fields.add("Modified"),
]);
```

## IView

### Get a View's Information

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";

const sp = spfi(...);

const list = sp.web.lists.getByTitle("My List");

const result = await list.views.getById("{GUID view id}")();

const result2 = await list.views.getByTitle("My View")();

const result3 = await list.views.getByTitle("My View").select("Id", "Title")();

const result4 = await list.defaultView();

const result5 = await list.getView("{GUID view id}")();
```

### fields

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";

const sp = spfi(...);

const list = sp.web.lists.getByTitle("My List");

const result = await list.views.getById("{GUID view id}").fields();
```

### update

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";

const sp = spfi(...);

const list = sp.web.lists.getByTitle("My List");

const result = await list.views.getById("{GUID view id}").update({
    RowLimit: 20,
});
```

### renderAsHtml

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";

const sp = spfi(...);

const result = await sp.web.lists.getByTitle("My List").views.getById("{GUID view id}").renderAsHtml();
```

### setViewXml

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";

const sp = spfi(...);

const viewXml = "...";

await sp.web.lists.getByTitle("My List").views.getById("{GUID view id}").setViewXml(viewXml);
```

### delete

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";

const sp = spfi(...);

const viewXml = "...";

await sp.web.lists.getByTitle("My List").views.getById("{GUID view id}").delete();
```

## ViewFields

### getSchemaXml

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";

const sp = spfi(...);

const xml = await sp.web.lists.getByTitle("My List").defaultView.fields.getSchemaXml();
```

### add

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";

const sp = spfi(...);

await sp.web.lists.getByTitle("My List").defaultView.fields.add("Created");
```

### move

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";

const sp = spfi(...);

await sp.web.lists.getByTitle("My List").defaultView.fields.move("Created", 0);
```

### remove

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";

const sp = spfi(...);

await sp.web.lists.getByTitle("My List").defaultView.fields.remove("Created");
```

### removeAll

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";

const sp = spfi(...);

await sp.web.lists.getByTitle("My List").defaultView.fields.removeAll();
```
