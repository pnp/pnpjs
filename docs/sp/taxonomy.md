# @pnp/sp/taxonomy

Provides access to the v2.1 api term store

### Docs updated with v2.0.9 release as the underlying API changed.

> NOTE: This API may change so please be aware updates to the taxonomy module will not trigger a major version bump in PnPjs even if they are breaking. Once things stabalize this note will be removed.

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

## Term Store

Access term store data from the root sp object as shown below.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermStoreInfo } from "@pnp/sp/taxonomy";

// get term store data
const info: ITermStoreInfo = await sp.termStore();
```

## Term Groups

Access term group information

### List

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermGroupInfo } from "@pnp/sp/taxonomy";

// get term groups
const info: ITermGroupInfo[] = await sp.termStore.groups();
```

### Get By Id

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermGroupInfo } from "@pnp/sp/taxonomy";

// get term groups data
const info: ITermGroupInfo = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72")();
```

## Term Sets

Access term set information

### List

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermSetInfo } from "@pnp/sp/taxonomy";

// get get set info
const info: ITermSetInfo[] = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets();

// also works to get sets not in groups
const info: ITermSetInfo[] = await sp.termStore.sets();
```

### Get By Id

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermSetInfo } from "@pnp/sp/taxonomy";

// get term set data
const info: ITermSetInfo = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72")();

const info2: ITermSetInfo = await sp.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72")();
```

## Terms

Access term set information

### List

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermInfo } from "@pnp/sp/taxonomy";

// list all the terms
const info: ITermInfo = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").children();

const info2: ITermInfo = await sp.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72").children();
```

### Get By Id

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermInfo } from "@pnp/sp/taxonomy";

// get term set data
const info: ITermInfo = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72").sets.getById("338666a8-1111-2222-3333-f72471314e72").getTermById("338666a8-1111-2222-3333-f72471314e72")();

const info2: ITermInfo = await sp.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72").getTermById("338666a8-1111-2222-3333-f72471314e72")();
```
