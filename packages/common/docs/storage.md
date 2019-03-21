# @pnp/common/storage

This module provides a thin wrapper over the browser storage options, local and session. If neither option is available it shims storage with
a non-persistent in memory polyfill. Optionally through configuration you can activate expiration. Sample usage is shown below.

## PnPClientStorage

The main export of this module, contains properties representing local and session storage.

```TypeScript
import { PnPClientStorage } from "@pnp/common";

const storage = new PnPClientStorage();
const myvalue = storage.local.get("mykey");
```

## PnPClientStorageWrapper

Each of the storage locations (session and local) are wrapped with this helper class. You can use it directly, but generally it would be used
from an instance of PnPClientStorage as shown below. These examples all use local storage, the operations are identical for session storage.

```TypeScript
import { PnPClientStorage } from "@pnp/common";

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

### Cache Expiration

The ability remove of expired items based on a configured timeout can help if the cache is filling up. This can be accomplished in two ways. The first is to explicitly call the new deleteExpired method on the cache you wish to clear. A suggested usage is to add this into your page init code as clearing expired items once per page load is likely sufficient.

```TypeScript
import { PnPClientStorage } from "@pnp/common";

const storage = new PnPClientStorage();

// session storage
storage.session.deleteExpired();

// local storage
storage.local.deleteExpired();

// this returns a promise, so you can perform some activity after the expired items are removed:
storage.local.deleteExpired().then(_ => {
    // init my application
});
```

The second method is to enable automated cache expiration through global config. Setting the enableCacheExpiration property to true will enable the timer. Optionally you can set the interval at which the cache is checked via the cacheExpirationIntervalMilliseconds property, by default 750 milliseconds is used. We enforce a minimum of 300 milliseconds as this functionality is enabled via setTimeout and there is little value in having an excessive number of cache checks. This method is more appropriate for a single page application where the page is infrequently reloaded and many cached operations are performed. There is no advantage to enabling cache expiration unless you are experiencing cache storage space pressure in a long running page - and you may see a performance hit due to the use of setTimeout. 

```TypeScript

import { setup } from "@pnp/common";

setup({
    enableCacheExpiration: true,
    cacheExpirationIntervalMilliseconds: 1000, // optional
});
```
