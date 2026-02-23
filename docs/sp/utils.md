# SP Utilities

## createChangeToken

Helps you create a change token for use with getChanges on Site, Web, or List.

```TS
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import { createChangeToken } from "@pnp/sp";
import { dateAdd } from "@pnp/core";

const sp = spfi(...);

const w = await sp.web.select("Id")();

const token = createChangeToken("web", w.Id, dateAdd(new Date(), "day", -29));

const c = await sp.web.getChanges({
    ChangeTokenStart: token,
});
```
