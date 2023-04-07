# @pnp/sp/taxonomy

Provides access to the v2.1 api term store

### Docs updated with v2.0.9 release as the underlying API changed

> NOTE: This API may change so please be aware updates to the taxonomy module will not trigger a major version bump in PnPjs even if they are breaking. Once things stabilize this note will be removed.

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

![Batching Not Supported Banner](https://img.shields.io/badge/Batching%20Not%20Supported-important.svg)

## Term Store

Access term store data from the root sp object as shown below.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermStoreInfo } from "@pnp/sp/taxonomy";

const sp = spfi(...);

// get term store data
const info: ITermStoreInfo = await sp.termStore();
```

### searchTerm

_Added in 3.3.0_

Search for terms starting with provided label under entire termStore or a termSet or a parent term.

The following properties are valid for the supplied query: `label: string`, `setId?: string`, `parentTermId?: string`, `languageTag?: string`, `stringMatchOption?: "ExactMatch" | "StartsWith"`.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/taxonomy";

const sp = spfi(...);

// minimally requires the label
const results1 = await sp.termStore.searchTerm({
  label: "test",
});

// other properties can be included as needed
const results2 = await sp.termStore.searchTerm({
  label: "test",
  setId: "{guid}",
});

// other properties can be included as needed
const results3 = await sp.termStore.searchTerm({
  label: "test",
  setId: "{guid}",
  stringMatchOption: "ExactMatch",
});
```

### update

_Added in 3.10.0_

Allows you to update language setttings for the store

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/taxonomy";

const sp = spfi(...);

await sp.termStore.update({
  defaultLanguageTag: "en-US",
  languageTags: ["en-US", "en-IE", "de-DE"],
});
```

## Term Groups

Access term group information

### List

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermGroupInfo } from "@pnp/sp/taxonomy";

const sp = spfi(...);

// get term groups
const info: ITermGroupInfo[] = await sp.termStore.groups();
```

### Get By Id

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermGroupInfo } from "@pnp/sp/taxonomy";

const sp = spfi(...);

// get term groups data
const info: ITermGroupInfo = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72")();
```

### Add

_Added in 3.10.0_

Allows you to add a term group to a store.

```TypeScript
import { spfi, SPFxToken, SPFx } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermGroupInfo } from "@pnp/sp/taxonomy";

// NOTE: Because this endpoint requires a token and does not work with cookie auth you must create an instance of SPFI that includes an auth token.
// We've included a new behavior to support getting a token for sharepoint called `SPFxToken`
const sp = spfi().using(SPFx(context), SPFxToken(context));
const groupInfo: ITermGroupInfo = await sp.termStore.groups.add({
  displayName: "Accounting",
  description: "Term Group for Accounting",
  name: "accounting1",
  scope: "global",
});
```

## Term Group

### Delete

_Added in 3.10.0_

Allows you to add a term group to a store.

```TypeScript
import { spfi, SPFxToken, SPFx } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermGroupInfo } from "@pnp/sp/taxonomy";

// NOTE: Because this endpoint requires a token and does not work with cookie auth you must create an instance of SPFI that includes an auth token.
// We've included a new behavior to support getting a token for sharepoint called `SPFxToken`
const sp = spfi().using(SPFx(context), SPFxToken(context));

await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").delete();
```

## Term Sets

Access term set information

### List

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermSetInfo } from "@pnp/sp/taxonomy";

const sp = spfi(...);

// get set info
const info: ITermSetInfo[] = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets();
```

### Get By Id

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermSetInfo } from "@pnp/sp/taxonomy";

const sp = spfi(...);

// get term set data by group id then by term set id
const info: ITermSetInfo = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72")();

// get term set data by term set id
const infoByTermSetId: ITermSetInfo = await sp.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72")();
```

### Add

_Added in 3.10.0_

Allows you to add a term set.

```TypeScript
import { spfi, SPFxToken, SPFx } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermGroupInfo } from "@pnp/sp/taxonomy";

// NOTE: Because this endpoint requires a token and does not work with cookie auth you must create an instance of SPFI that includes an auth token.
// We've included a new behavior to support getting a token for sharepoint called `SPFxToken`
const sp = spfi().using(SPFx(context), SPFxToken(context));

// when adding a set directly from the root .sets property, you must include the "parentGroup" property
const setInfo = await sp.termStore.sets.add({
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
const setInfo2 = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.add({
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
import { spfi } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermInfo } from "@pnp/sp/taxonomy";
import { dateAdd, PnPClientStorage } from "@pnp/core";

const sp = spfi(...);

// here we get all the children of a given set
const childTree = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").getAllChildrenAsOrderedTree();

// here we show caching the results using the PnPClientStorage class, there are many caching libraries and options available
const store = new PnPClientStorage();

// our tree likely doesn't change much in 30 minutes for most applications
// adjust to be longer or shorter as needed
const cachedTree = await store.local.getOrPut("myKey", () => {
    return sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").getAllChildrenAsOrderedTree();
}, dateAdd(new Date(), "minute", 30));

// you can also get all the properties and localProperties
const set = sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72");
const childTree = await set.getAllChildrenAsOrderedTree({ retrieveProperties: true });
```

## TermSet

Access term set information

### Update

_Added in 3.10.0_

```TypeScript
import { spfi, SPFxToken, SPFx } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermGroupInfo } from "@pnp/sp/taxonomy";

// NOTE: Because this endpoint requires a token and does not work with cookie auth you must create an instance of SPFI that includes an auth token.
// We've included a new behavior to support getting a token for sharepoint called `SPFxToken`
const sp = spfi().using(SPFx(context), SPFxToken(context));

const termSetInfo = await sp.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72").update({
  properties: [{
    key: "MyKey2",
    value: "MyValue2",
  }],
});

const termSetInfo2 = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").update({
  properties: [{
    key: "MyKey3",
    value: "MyValue3",
  }],
});
```

### Delete

_Added in 3.10.0_

```TypeScript
import { spfi, SPFxToken, SPFx } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermGroupInfo } from "@pnp/sp/taxonomy";

// NOTE: Because this endpoint requires a token and does not work with cookie auth you must create an instance of SPFI that includes an auth token.
// We've included a new behavior to support getting a token for sharepoint called `SPFxToken`
const sp = spfi().using(SPFx(context), SPFxToken(context));

await sp.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72").delete();

await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").delete();
```

## Terms

Access term set information

### List

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermInfo } from "@pnp/sp/taxonomy";

const sp = spfi(...);

// list all the terms that are direct children of this set
const infos: ITermInfo[] = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").children();
```

### List (terms)

You can use the terms property to get a flat list of all terms in the set. These terms do not contain parent/child relationship information.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermInfo } from "@pnp/sp/taxonomy";

const sp = spfi(...);

// list all the terms available in this term set by group id then by term set id
const infos: ITermInfo[] = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").terms();

// list all the terms available in this term set by term set id
const infosByTermSetId: ITermInfo[] = await sp.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72").terms();
```

### Get By Id

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermInfo } from "@pnp/sp/taxonomy";

const sp = spfi(...);

// get term set data
const info: ITermInfo = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").getTermById("338666a8-1111-2222-3333-f72471314e72")();
```

### Add

_Added in 3.10.0_

```TypeScript
import { spfi, SPFxToken, SPFx } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermInfo } from "@pnp/sp/taxonomy";

// NOTE: Because this endpoint requires a token and does not work with cookie auth you must create an instance of SPFI that includes an auth token.
// We've included a new behavior to support getting a token for sharepoint called `SPFxToken`
const sp = spfi().using(SPFx(context), SPFxToken(context));

const newTermInfo = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").children.add({
  labels: [
    {
      isDefault: true,
      languageTag: "en-us",
      name: "New Term",
    }
  ]
});

const newTermInfo = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").children.add({
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

_Added in 3.10.0_

```TypeScript
import { spfi, SPFxToken, SPFx } from "@pnp/sp";
import "@pnp/sp/taxonomy";

// NOTE: Because this endpoint requires a token and does not work with cookie auth you must create an instance of SPFI that includes an auth token.
// We've included a new behavior to support getting a token for sharepoint called `SPFxToken`
const sp = spfi().using(SPFx(context), SPFxToken(context));

const termInfo = await sp.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72").getTermById("338666a8-1111-2222-3333-f72471314e72").update({
  properties: [{
    key: "something",
    value: "a value 2",
  }],
});

const termInfo2 = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").getTermById("338666a8-1111-2222-3333-f72471314e72").update({
  properties: [{
    key: "something",
    value: "a value",
  }],
});
```

### Delete

_Added in 3.10.0_

```TypeScript
import { spfi, SPFxToken, SPFx } from "@pnp/sp";
import "@pnp/sp/taxonomy";

// NOTE: Because this endpoint requires a token and does not work with cookie auth you must create an instance of SPFI that includes an auth token.
// We've included a new behavior to support getting a token for sharepoint called `SPFxToken`
const sp = spfi().using(SPFx(context), SPFxToken(context));

const termInfo = await sp.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72").getTermById("338666a8-1111-2222-3333-f72471314e72").delete();

const termInfo2 = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").getTermById("338666a8-1111-2222-3333-f72471314e72").delete();
```

## Get Term Parent

_Behavior Change in 2.1.0_

The server API changed again, resulting in the removal of the "parent" property from ITerm as it is not longer supported as a path property. You now must use "expand" to load a term's parent information. The side affect of this is that the parent is no longer chainable, meaning you need to load a new term instance to work with the parent term. An approach for this is shown below.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/taxonomy";

const sp = spfi(...);

// get a ref to the set
const set = sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72");

// get a term's information and expand parent to get the parent info as well
const w = await set.getTermById("338666a8-1111-2222-3333-f72471314e72").expand("parent")();

// get a ref to the parent term
const parent = set.getTermById(w.parent.id);

// make a request for the parent term's info - this data currently match the results in the expand call above, but this
// is to demonstrate how to gain a ref to the parent and select its data
const parentInfo = await parent.select("Id", "Descriptions")();
```
