# @pnp/sp/web - tenant properties

You can set, read, and remove tenant properties using the methods shown below:

## setStorageEntity

This method MUST be called in the context of the app catalog web or you will get an access denied message.

```TypeScript
import { Web } from "@pnp/sp";

const w = new Web("https://tenant.sharepoint.com/sites/appcatalog/");

// specify required key and value
await w.setStorageEntity("Test1", "Value 1");

// specify optional description and comments
await w.setStorageEntity("Test2", "Value 2", "description", "comments");
``` 

## getStorageEntity

This method can be used from any web to retrieve values previsouly set.

```TypeScript
import { sp, StorageEntity } from "@pnp/sp";

const prop: StorageEntity = await sp.web.getStorageEntity("Test1");

console.log(prop.Value);
```

## removeStorageEntity

This method MUST be called in the context of the app catalog web or you will get an access denied message.

```TypeScript
import { Web } from "@pnp/sp";

const w = new Web("https://tenant.sharepoint.com/sites/appcatalog/");

await w.removeStorageEntity("Test1");
```
