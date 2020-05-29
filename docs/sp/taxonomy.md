# @pnp/sp/taxonomy

Provides access to the v2.1 api term store

> NOTE: This API may change on the server so please be aware. Also updates to this API will not trigger a major version bump in PnPjs even if they are breaking. That will change once it is stable.

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

// get term groups data
const info: ITermGroupInfo[] = await sp.termStore.termGroups();

// seems to get the same information
const info2: ITermGroupInfo[] = await sp.termStore.groups();
```

### Get By Id

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermGroupInfo } from "@pnp/sp/taxonomy";

// get term groups data
const info: ITermGroupInfo = await sp.termStore.termGroups.getById("338666a8-1111-2222-3333-f72471314e72")();

const info: ITermGroupInfo = await sp.termStore.groups.getById("338666a8-1111-2222-3333-f72471314e72")();
```

## Term Sets

Access term set information

### List

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermSetInfo } from "@pnp/sp/taxonomy";

// get term set data
const info: ITermSetInfo[] = await sp.termStore.termSets();

// seems to get the same information
const info2: ITermSetInfo[] = await sp.termStore.sets();
```

### Get By Id

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermSetInfo } from "@pnp/sp/taxonomy";

// get term set data
const info: ITermSetInfo = await sp.termStore.termSets.getById("338666a8-1111-2222-3333-f72471314e72")();

const info: ITermSetInfo = await sp.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72")();
```

## Terms

Access term set information

### List

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermSetInfo } from "@pnp/sp/taxonomy";

// get term set data
const info: ITermsInfo = await sp.termStore.termSets.getById("338666a8-1111-2222-3333-f72471314e72").terms();

// seems to get the same information
const info2: ITermsInfo = await sp.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72").terms();
```

### Get By Id

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/taxonomy";
import { ITermSetInfo } from "@pnp/sp/taxonomy";

// get term set data
const info: ITermSetInfo = await sp.termStore.termSets.getById("338666a8-1111-2222-3333-f72471314e72")();

const info: ITermSetInfo = await sp.termStore.sets.getById("338666a8-1111-2222-3333-f72471314e72")();
```




