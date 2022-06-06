# @pnp/sp/recycle-bin

The contents of the web's recycle bin.

## IRecycleBin

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

### Get contents of the web's recycle bin

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/recycle-bin";

const sp = spfi(...);

// gets contents of the web's recycle bin
const bin = await sp.web.recycleBin();
```

// TODO: Finish docs after validate API.
