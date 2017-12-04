# @pnp\common\storage

This module provides a thin wrapper over the browser storage options, local and session. If neither option is available it shims storage with
a non-persistent in memory polyfill. Optionally through configuratrion you can activate expiration. Sample usage is shown below.

## PnPClientStorage

The main export of this module, contains properties representing local and session storage.

```TypeScript
import { PnPClientStorage } from "@pnp/common"

const storage = new PnPClientStorage();
const myvalue = storage.local.get("mykey");
```

## PnPClientStorageWrapper

Each of the storage locations (session and local) are wrapped with this helper class. You can use it directly, but generally it would be used
from an instance of PnPClientStorage as shown below. These examples all use local storage, the operations are identical for session storage.

```TypeScript
import { PnPClientStorage } from "@pnp/common"

const storage = new PnPClientStorage();

// get a value from storage
const value = storage.local.get("mykey");

// put a value into storage
storage.local.put("mykey2", "my value");

// put a value into storage with an expiration
storage.local.put("mykey2", "my value", new Date());

// put a simple object into storage
// because JSON.stringify is used to package the object we do NOT do a deep rehydration of stored objects
storage.local.put("mykey3", {
    key: "value",
    key2: "value2",
});

// remove a value from storage
storage.local.delete("mykey3");

// get an item or add it if it does not exist
// returns a promise in case you need time to get the value for storage
// optionally takes a third parameter specifying the expiration
storage.local.getOrPut("mykey4", () => {
    return Promise.resolve("value");
});

// delete expired items
storage.local.deleteExpired();
```