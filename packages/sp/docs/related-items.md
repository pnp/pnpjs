# @pnp/sp/relateditems

Related items are used in Task and Workflow lists (as well as others) to track items that have relationships similar to database relationships.

All methods chain off the Web's relatedItems property as shown below:

## getRelatedItems

Expects the named library to exist within the contextual web.

```TypeScript
import { sp, RelatedItem } from "@pnp/sp";

sp.web.relatedItems.getRelatedItems("Documents", 1).then((result: RelatedItem[]) => {

    console.log(result);
});
```

## getPageOneRelatedItems

Expects the named library to exist within the contextual web.

```TypeScript
import { sp, RelatedItem } from "@pnp/sp";

sp.web.relatedItems.getPageOneRelatedItems("Documents", 1).then((result: RelatedItem[]) => {

    console.log(result);
});
```
## addSingleLink

```TypeScript
import { sp } from "@pnp/sp";

sp.web.relatedItems.addSingleLink("RelatedItemsList1", 2, "https://site.sharepoint.com/sites/dev/subsite", "RelatedItemsList2", 1, "https://site.sharepoint.com/sites/dev").then(_ => {

    // ... return is void
});

sp.web.relatedItems.addSingleLink("RelatedItemsList1", 2, "https://site.sharepoint.com/sites/dev/subsite", "RelatedItemsList2", 1, "https://site.sharepoint.com/sites/dev", true).then(_ => {

    // ... return is void
});
```

## addSingleLinkToUrl

Adds a related item link from an item specified by list name and item id, to an item specified by url

```TypeScript
import { sp } from "@pnp/sp";

sp.web.relatedItems.addSingleLinkToUrl("RelatedItemsList1", 2, "https://site.sharepoint.com/sites/dev/subsite/Documents/test.txt").then(_ => {

    // ... return is void
});

sp.web.relatedItems.addSingleLinkToUrl("RelatedItemsList1", 2, "https://site.sharepoint.com/sites/dev/subsite/Documents/test.txt", true).then(_ => {
    // ... return is void
});
```

## addSingleLinkFromUrl

Adds a related item link from an item specified by url, to an item specified by list name and item id

```TypeScript
import { sp } from "@pnp/sp";

sp.web.relatedItems.addSingleLinkFromUrl("https://site.sharepoint.com/sites/dev/subsite/Documents/test.txt", "RelatedItemsList1", 2).then(_ => {
    // ... return is void
});

sp.web.relatedItems.addSingleLinkFromUrl("https://site.sharepoint.com/sites/dev/subsite/Documents/test.txt", "RelatedItemsList1", 2, true).then(_ => {

    // ... return is void
});
```

## deleteSingleLink

```TypeScript
import { sp } from "@pnp/sp";

sp.web.relatedItems.deleteSingleLink("RelatedItemsList1", 2, "https://site.sharepoint.com/sites/dev/subsite", "RelatedItemsList2", 1, "https://site.sharepoint.com/sites/dev").then(_ => {

    // ... return is void
});

sp.web.relatedItems.deleteSingleLink("RelatedItemsList1", 2, "https://site.sharepoint.com/sites/dev/subsite", "RelatedItemsList2", 1, "https://site.sharepoint.com/sites/dev", true).then(_ => {

    // ... return is void
});
```
