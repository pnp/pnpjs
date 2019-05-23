# @pnp/sp/views

Views define the columns, ordering, and other details we see when we look at a list. You can have multiple views for a list, including private views - and one default view.

## Get a View's Properties

To get a views properties you need to know it's id or title. You can use the standard OData operators as expected to select properties. For a list of the properties, please see [this article](https://msdn.microsoft.com/en-us/library/office/dn531433.aspx#bk_View).

```TypeScript
import { sp, IView } from "@pnp/sp";

// get by the GUID of the view
sp.web.lists.getByTitle("Documents").views.getById("2B382C69-DF64-49C4-85F1-70FB9CECACFE").then(v: IView => {
    console.log(v);
});

// get by the display title of the view
sp.web.lists.getByTitle("Documents").views.getByTitle("All Documents").get().then(v: IView => {
    console.log(v);
});
```

## Add a View

To add a view you use the add method of the views collection. You must supply a title and can supply other parameters as well.

```TypeScript
import { sp, IViewAddResult } from "@pnp/sp";

// create a new view with default fields and properties
sp.web.lists.getByTitle("Documents").views.add("My New View").then(v: IViewAddResult => {
    console.log(v);
});

// create a new view with specific properties
sp.web.lists.getByTitle("Documents").views.add("My New View 2", false, {
    RowLimit: 10,
    ViewQuery: "<OrderBy><FieldRef Name='Modified' Ascending='False' /></OrderBy>",
}).then((v: IViewAddResult) => {

    // manipulate the view's fields
    v.view.fields.removeAll().then(_ => {

        Promise.all([
            v.view.fields.add("Title"),
            v.view.fields.add("Modified"),
        ]).then(_ =>{
            console.log("View created");
        });
    });
});
```

## Update a View

```TypeScript
import { sp, IViewUpdateResult } from "@pnp/sp";

sp.web.lists.getByTitle("Documents").views.getByTitle("My New View").update({
    RowLimit: 20,
}).then((v: IViewUpdateResult) => {
    console.log(v);
});
```

## Set View XML

_Added in 1.2.6_

```TypeScript
import { sp } from "@pnp/sp";

const viewXml: string = "...";

await sp.web.lists.getByTitle("Documents").views.getByTitle("My New View").setViewXml(viewXml);
```

## Delete a View

```TypeScript
import { sp } from "@pnp/sp";

sp.web.lists.getByTitle("Documents").views.getByTitle("My New View").delete().then(_ => {
    console.log("View deleted");
});
```
