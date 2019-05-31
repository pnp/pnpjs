# @pnp/sp-taxonomy/utilities

These are a collection of helper methods you may find useful.

## setItemMetaDataField

Allows you to easily set the value of a metadata field in a list item.

```TypeScript
import { sp } from "@pnp/sp";
import { taxonomy, setItemMetaDataField } from "@pnp/sp-taxonomy";

// create a new item, or load an existing
const itemResult = await sp.web.lists.getByTitle("TaxonomyList").items.add({
    Title: "My Title",
});

// get a term
const term = await taxonomy.getDefaultSiteCollectionTermStore()
    .getTermById("99992696-1111-1111-1111-15e65b221111").get();

setItemMetaDataField(itemResult.item, "MetaDataFieldName", term);
```

## setItemMetaDataMultiField

Allows you to easily set the value of a multi-value metadata field in a list item.

```TypeScript
import { sp } from "@pnp/sp";
import { taxonomy, setItemMetaDataMultiField } from "@pnp/sp-taxonomy";

// create a new item, or load an existing
const itemResult = await sp.web.lists.getByTitle("TaxonomyList").items.add({
    Title: "My Title",
});

// get a term
const term = await taxonomy.getDefaultSiteCollectionTermStore()
    .getTermById("99992696-1111-1111-1111-15e65b221111").get();

// get another term
const term2 = await taxonomy.getDefaultSiteCollectionTermStore()
    .getTermById("99992696-1111-1111-1111-15e65b221112").get();

// get yet another term
const term3 = await taxonomy.getDefaultSiteCollectionTermStore()
    .getTermById("99992696-1111-1111-1111-15e65b221113").get();

setItemMetaDataMultiField(
    itemResult.item,
    "MultiValueMetaDataFieldName",
    term,
    term2,
    term3
);
```
