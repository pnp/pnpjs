# @pnp/sp/related-items

The related items API allows you to add related items to items within a task or workflow list. Related items need to be in the same site collection.

## Setup

Instead of copying this block of code into each sample, understand that each sample is meant to run with this supporting code to work.

```TypeScript
import { spfi, SPFx, extractWebUrl } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/related-items/web";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import "@pnp/sp/files/list";
import { IList } from "@pnp/sp/lists";
import { getRandomString } from "@pnp/core";

const sp = spfi(...);

// setup some lists (or just use existing ones this is just to show the complete process)
// we need two lists to use for creating related items, they need to use template 107 (task list)
const ler1 = await sp.web.lists.ensure("RelatedItemsSourceList", "", 107);
const ler2 = await sp.web.lists.ensure("RelatedItemsTargetList", "", 107);

const sourceList = ler1.list;
const targetList = ler2.list;

const sourceListName = await sourceList.select("Id")().then(r => r.Id);
const targetListName = await targetList.select("Id")().then(r => r.Id);

// or whatever you need to get the web url, both our example lists are in the same web.
const webUrl = sp.web.toUrl();

// ...individual samples start here
```

## addSingleLink

```TypeScript
const sourceItem = await sourceList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);

await sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);
```

## addSingleLinkToUrl

This method adds a link to task item based on a url. The list name and item id are to the task item, the url is to the related item/document.

```TypeScript
// get a file's server relative url in some manner, here we add one
const file = await sp.web.defaultDocumentLibrary.rootFolder.files.add(`file_${getRandomString(4)}.txt`, "Content", true).then(r => r.data);
// add an item or get an item from the task list
const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);

await sp.web.relatedItems.addSingleLinkToUrl(targetListName, targetItem.Id, file.ServerRelativeUrl);
```

## addSingleLinkFromUrl

This method adds a link to task item based on a url. The list name and item id are to related item, the url is to task item to which the related reference is being added. I haven't found a use case for this method.

## deleteSingleLink

This method allows you to delete a link previously created.

```TypeScript
const sourceItem = await sourceList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);

// add the link
await sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);

// delete the link
await sp.web.relatedItems.deleteSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);
```

## getRelatedItems

Gets the related items for an item

```TypeScript
import { IRelatedItem } from "@pnp/sp/related-items";

const sourceItem = await sourceList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);

// add a link
await sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);

const targetItem2 = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);

// add a link
await sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem2.Id, webUrl);

const items: IRelatedItem[] = await sp.web.relatedItems.getRelatedItems(sourceListName, sourceItem.Id);

// items.length === 2
```

Related items are defined by the IRelatedItem interface

```JSON
export interface IRelatedItem {
    ListId: string;
    ItemId: number;
    Url: string;
    Title: string;
    WebId: string;
    IconUrl: string;
}
```

## getPageOneRelatedItems

Gets an abbreviated set of related items

```TypeScript
import { IRelatedItem } from "@pnp/sp/related-items";

const sourceItem = await sourceList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);
const targetItem = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);

// add a link
await sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem.Id, webUrl);

const targetItem2 = await targetList.items.add({ Title: `Item ${getRandomString(4)}` }).then(r => r.data);

// add a link
await sp.web.relatedItems.addSingleLink(sourceListName, sourceItem.Id, webUrl, targetListName, targetItem2.Id, webUrl);

const items: IRelatedItem[] = await sp.web.relatedItems.getPageOneRelatedItems(sourceListName, sourceItem.Id);

// items.length === 2
```
