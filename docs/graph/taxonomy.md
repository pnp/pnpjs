# @pnp/graph/taxonomy

Provides access to the v1.0 api term store

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

![Batching Not Supported Banner](https://img.shields.io/badge/Batching%20Not%20Supported-important.svg)

## Term Store

Access tenant termstore

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/taxonomy";
import { ITermStore } from "@pnp/graph/taxonomy";

const graph = graphfi(...);

// get term store data
const info: ITermStore = await graph.termStore();
```

Access site specific termstore

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/taxonomy";

const graph = graphfi(...);

// get term store data
const info: ITermStoreInfo = await graph.sites.getById("contoso.sharepoint.com,91dd2418-8fb9-4e0e-919d-c1b31e938386,285cc5a1-cf50-4e4d-8d93-5ba5a8e76e01").termStore();

```
### SearchTerm

Search for terms starting with provided label under entire termStore or a termSet or a parent term.

The following properties are valid for the supplied query: `label: string`, `setId?: string`, `parentTermId?: string`, `languageTag?: string`, `stringMatchOption?: "ExactMatch" | "StartsWith"`.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/taxonomy";

const graph = graphfi(...);

// minimally requires the label
const results1 = await graph.termStore.searchTerm({
  label: "test",
});

// other properties can be included as needed
const results2 = await graph.termStore.searchTerm({
  label: "test",
  setId: "{guid}",
});

// other properties can be included as needed
const results3 = await graph.termStore.searchTerm({
  label: "test",
  setId: "{guid}",
  stringMatchOption: "ExactMatch",
});
```

### Update

Allows you to update language setttings for the store

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/taxonomy";

const graph = graphfi(...);

await graph.termStore.update({
  defaultLanguageTag: "en-US",
  languageTags: ["en-US", "en-IE", "de-DE"],
});
```

## Term Groups

Access term group information

### List

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/taxonomy";
import { ITermGroupInfo } from "@pnp/graph/taxonomy";

const graph = graphfi(...);

// get term groups
const info: ITermGroupInfo[] = await graph.termStore.groups();
```

### Get By Id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/taxonomy";
import { ITermGroupInfo } from "@pnp/graph/taxonomy";

const graph = graphfi(...);

// get term groups data
const info: ITermGroupInfo = await graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72")();
```

### Add

Allows you to add a term group to a store.

```TypeScript
import { graphfi, SPFxToken, SPFx } from "@pnp/graph";
import "@pnp/graph/taxonomy";
import { ITermGroupInfo } from "@pnp/graph/taxonomy";

const graph = graphfi(...);
const groupInfo: ITermGroupInfo = await graph.termStore.groups.add({
  displayName: "Accounting",
  description: "Term Group for Accounting",
  name: "accounting1",
  scope: "global",
});
```

## Term Group

### Delete

Allows you to add a term group to a store.

```TypeScript
import { graphfi, SPFxToken, SPFx } from "@pnp/graph";
import "@pnp/graph/taxonomy";
import { ITermGroupInfo } from "@pnp/graph/taxonomy";

const graph = graphfi(...);

await graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").delete();
```

## Term Sets

Access term set information

### List

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/taxonomy";
import { ITermSetInfo } from "@pnp/graph/taxonomy";

const graph = graphfi(...);

// get set info
const info: ITermSetInfo[] = await graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets();
```

### Get By Id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/taxonomy";
import { ITermSetInfo } from "@pnp/graph/taxonomy";

const graph = graphfi(...);

// get term set data by group id then by term set id
const info: ITermSetInfo = await graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72")();

// get term set data by term set id
const infoByTermSetId: ITermSetInfo = await graph.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72")();
```

### Add

Allows you to add a term set.

```TypeScript
import { graphfi, SPFxToken, SPFx } from "@pnp/graph";
import "@pnp/graph/taxonomy";
import { ITermGroupInfo } from "@pnp/graph/taxonomy";

const graph = graphfi(...);

// when adding a set directly from the root .sets property, you must include the "parentGroup" property
const setInfo = await graph.termStore.sets.add({
  parentGroup: {
    id: "338666a8-1111-2222-3333-f72471314e72"
  },
  contact: "steve",
  description: "description",
  isAvailableForTagging: true,
  isOpen: true,
  localizedNames: [{
    name: "MySet",
    languageTag: "en-US",
  }],
  properties: [{
    key: "key1",
    value: "value1",
  }]
});

// when adding a termset through a group's sets property you do not specify the "parentGroup" property
const setInfo2 = await graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.add({
  contact: "steve",
  description: "description",
  isAvailableForTagging: true,
  isOpen: true,
  localizedNames: [{
    name: "MySet2",
    languageTag: "en-US",
  }],
  properties: [{
    key: "key1",
    value: "value1",
  }]
});
```

### getAllChildrenAsOrderedTree

This method will get all of a set's child terms in an ordered array. It is a costly method in terms of requests so we suggest you cache the results as taxonomy trees seldom change.

> Starting with version 2.6.0 you can now include an optional param to retrieve all of the term's properties and localProperties in the tree. Default is false.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/taxonomy";
import { ITermInfo } from "@pnp/graph/taxonomy";
import { dateAdd, PnPClientStorage } from "@pnp/core";

const graph = graphfi(...);

// here we get all the children of a given set
const childTree = await graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").getAllChildrenAsOrderedTree();

// here we show caching the results using the PnPClientStorage class, there are many caching libraries and options available
const store = new PnPClientStorage();

// our tree likely doesn't change much in 30 minutes for most applications
// adjust to be longer or shorter as needed
const cachedTree = await store.local.getOrPut("myKey", () => {
    return graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").getAllChildrenAsOrderedTree();
}, dateAdd(new Date(), "minute", 30));

// you can also get all the properties and localProperties
const set = graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72");
const childTree = await set.getAllChildrenAsOrderedTree({ retrieveProperties: true });
```

## TermSet

Access term set information

### Update

```TypeScript
import { graphfi, SPFxToken, SPFx } from "@pnp/graph";
import "@pnp/graph/taxonomy";
import { ITermGroupInfo } from "@pnp/graph/taxonomy";

const graph = graphfi(...);

const termSetInfo = await graph.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72").update({
  properties: [{
    key: "MyKey2",
    value: "MyValue2",
  }],
});

const termSetInfo2 = await graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").update({
  properties: [{
    key: "MyKey3",
    value: "MyValue3",
  }],
});
```

### Delete

```TypeScript
import { graphfi, SPFxToken, SPFx } from "@pnp/graph";
import "@pnp/graph/taxonomy";
import { ITermGroupInfo } from "@pnp/graph/taxonomy";

const graph = graphfi(...);

await graph.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72").delete();

await graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").delete();
```

## Terms

Access term set information

### List

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/taxonomy";
import { ITermInfo } from "@pnp/graph/taxonomy";

const graph = graphfi(...);

// list all the terms that are direct children of this set
const infos: ITermInfo[] = await graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").children();
```

### List (terms)

You can use the terms property to get a flat list of all terms in the set. These terms do not contain parent/child relationship information.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/taxonomy";
import { ITermInfo } from "@pnp/graph/taxonomy";

const graph = graphfi(...);

// list all the terms available in this term set by group id then by term set id
const infos: ITermInfo[] = await graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").terms();

// list all the terms available in this term set by term set id
const infosByTermSetId: ITermInfo[] = await graph.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72").terms();
```

### Get By Id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/taxonomy";
import { ITermInfo } from "@pnp/graph/taxonomy";

const graph = graphfi(...);

// get term set data
const info: ITermInfo = await graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").getTermById("338666a8-1111-2222-3333-f72471314e72")();
```

### Add

```TypeScript
import { graphfi, SPFxToken, SPFx } from "@pnp/graph";
import "@pnp/graph/taxonomy";
import { ITermInfo } from "@pnp/graph/taxonomy";

const graph = graphfi(...);

const newTermInfo = await graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").children.add({
  labels: [
    {
      isDefault: true,
      languageTag: "en-us",
      name: "New Term",
    }
  ]
});

const newTermInfo = await graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").children.add({
  labels: [
    {
      isDefault: true,
      languageTag: "en-us",
      name: "New Term 2",
    }
  ]
});
```

## Term

### Update

> Note that when updating a Term if you update the `properties` it replaces the collection, so a merge of existing + new needs to be handled by your application.

```TypeScript
import { graphfi, SPFxToken, SPFx } from "@pnp/graph";
import "@pnp/graph/taxonomy";

const graph = graphfi(...);

const termInfo = await graph.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72").getTermById("338666a8-1111-2222-3333-f72471314e72").update({
  properties: [{
    key: "something",
    value: "a value 2",
  }],
});

const termInfo2 = await graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").getTermById("338666a8-1111-2222-3333-f72471314e72").update({
  properties: [{
    key: "something",
    value: "a value",
  }],
});
```

### Delete

_Added in 3.10.0_

```TypeScript
import { graphfi, SPFxToken, SPFx } from "@pnp/graph";
import "@pnp/graph/taxonomy";

const graph = graphfi(...);

const termInfo = await graph.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72").getTermById("338666a8-1111-2222-3333-f72471314e72").delete();

const termInfo2 = await graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").getTermById("338666a8-1111-2222-3333-f72471314e72").delete();
```

## Get Term Parent

The server API changed again, resulting in the removal of the "parent" property from ITerm as it is not longer supported as a path property. You now must use "expand" to load a term's parent information. The side affect of this is that the parent is no longer chainable, meaning you need to load a new term instance to work with the parent term. An approach for this is shown below.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/taxonomy";

const graph = graphfi(...);

// get a ref to the set
const set = graph.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72");

// get a term's information and expand parent to get the parent info as well
const w = await set.getTermById("338666a8-1111-2222-3333-f72471314e72").expand("parent")();

// get a ref to the parent term
const parent = set.getTermById(w.parent.id);

// make a request for the parent term's info - this data currently match the results in the expand call above, but this
// is to demonstrate how to gain a ref to the parent and select its data
const parentInfo = await parent.select("Id", "Descriptions")();
```
