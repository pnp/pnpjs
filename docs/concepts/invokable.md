# Invokables

For people who have been using the library since the early days you are familiar with the need to use the `.get()` method to invoke a method chain:

```TypeScript
// an example of get
const lists = await sp.web.lists.get();
```

Starting with v2 this is no longer required, you can invoke the object directly to execute the default action for that class - typically a get.

```TypeScript
const lists = await sp.web.lists();
```

This has two main benefits for people using the library: you can write less code, and we now have a way to model default actions for objects that might do something other than a get. The way we designed the library prior to v2 hid the post, put, delete operations as protected methods attached to the Queryable classes. Without diving into why we did this, having a rethink seemed appropriate for v2. Based on that, the entire queryable chain is now invokable as well for any of the operations.

## Other Operations (post, put, delete)

```TypeScript
import { sp, spPost } from "@pnp/sp";
import "@pnp/sp/webs";

// do a post to a web - just an example doesn't do anything fancy
spPost(sp.web);
```

Things get a little more interesting in that you can now do posts (or any of the operations) to any of the urls defined by a fluent chain. Meaning you can easily implement methods that are not yet part of the library. For this example I have made up a method called "MagicFieldCreationMethod" that doesn't exist. Imagine it was just added to the SharePoint API and we do not yet have support for it. You can now write code like so:

```TypeScript
import { sp, spPost, SharePointQueryable } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/fields/web";

// call our made up example method
spPost(SharePointQueryable(sp.web.fields, "MagicFieldCreationMethod"), {
    body: JSON.stringify({
        // ... this would be the post body
    }),
});
```
