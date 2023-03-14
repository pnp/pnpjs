# @pnp/sp/recycle-bin

The contents of the recycle bin.

## IRecycleBin, IRecycleBinItem

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

### Work with the contents of the web's Recycle Bin

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/recycle-bin";

const sp = spfi(...);

// gets contents of the web's recycle bin
const bin = await sp.web.recycleBin();

// gets a specific item from the recycle bin
const rbItem = await sp.web.recycleBin.getById(bin[0].id);

// delete the item from the recycle bin
await rbItem.delete();

// restore the item from the recycle bin
await rbItem.restore();

// move the item to the second-stage (site) recycle bin.
await rbItem.moveToSecondStage();

// deletes everything in the recycle bin
await sp.web.recycleBin.deleteAll();

// restores everything in the recycle bin
await sp.web.recycleBin.restoreAll();

// moves contents of recycle bin to second-stage (site) recycle bin.
await sp.web.recycleBin.moveAllToSecondStage();

// deletes contents of the second-stage (site) recycle bin.
await sp.web.recycleBin.deleteAllSecondStageItems();
```

### Work with the contents of the Second-stage (site) Recycle Bin

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/recycle-bin";

const sp = spfi(...);

// gets contents of the second-stage recycle bin
const ssBin = await sp.site.recycleBin();

// gets a specific item from the second-stage recycle bin
const rbItem = await sp.site.recycleBin.getById(ssBin[0].id);

// delete the item from the second-stage recycle bin
await rbItem.delete();

// restore the item from the second-stage recycle bin
await rbItem.restore();

// deletes everything in the second-stage recycle bin
await sp.site.recycleBin.deleteAll();

// restores everything in the second-stage recycle bin
await sp.site.recycleBin.restoreAll();
```
