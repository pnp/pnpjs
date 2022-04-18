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
