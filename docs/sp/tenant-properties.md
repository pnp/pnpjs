# @pnp/sp/web - tenant properties

You can set, read, and remove tenant properties using the methods shown below:

## setStorageEntity

This method MUST be called in the context of the app catalog web or you will get an access denied message.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/appcatalog";
import "@pnp/sp/webs";

const sp = spfi(...);

const w = await sp.getTenantAppCatalogWeb();

// specify required key and value
await w.setStorageEntity("Test1", "Value 1");

// specify optional description and comments
await w.setStorageEntity("Test2", "Value 2", "description", "comments");
```

## getStorageEntity

This method can be used from any web to retrieve values previously set.

```TypeScript
import { spfi, SPFx, IStorageEntity } from "@pnp/sp";
import "@pnp/sp/appcatalog";
import "@pnp/sp/webs";

const sp = spfi(...);

const prop: IStorageEntity = await sp.web.getStorageEntity("Test1");

console.log(prop.Value);
```

## removeStorageEntity

This method MUST be called in the context of the app catalog web or you will get an access denied message.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/appcatalog";
import "@pnp/sp/webs";

const sp = spfi(...);

const w = await sp.getTenantAppCatalogWeb();

await w.removeStorageEntity("Test1");
```
