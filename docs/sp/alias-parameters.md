# @pnp/sp - Aliased Parameters

Within the @pnp/sp api you can alias any of the parameters so they will be written into the querystring. This is most helpful if you are hitting up against the url length limits when working with files and folders.

To alias a parameter you include the label name, a separator ("::") and the value in the string. You also need to prepend a "!" to the string to trigger the replacement. You can see this below, as well as the string that will be generated. Labels must start with a "@" followed by a letter. It is also your responsibility to ensure that the aliases you supply do not conflict, for example if you use "@p1" you should use "@p2" for a second parameter alias in the same query.

## Construct a parameter alias

Pattern: !@{label name}::{value}

Example: "!@p1::\sites\dev" or "!@p2::\text.txt"

### Example without aliasing

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import "@pnp/sp/files";

// still works as expected, no aliasing
const query = spfi().web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents/").files.select("Title").top(3);

console.log(query.toUrl()); // _api/web/getFolderByServerRelativeUrl('/sites/dev/Shared Documents/')/files
console.log(query.toRequestUrl()); // _api/web/getFolderByServerRelativeUrl('/sites/dev/Shared Documents/')/files?$select=Title&$top=3

const r = await query();
console.log(r);;
```

### Example with aliasing

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import "@pnp/sp/files";

// same query with aliasing
const query = spfi().web.getFolderByServerRelativeUrl("!@p1::/sites/dev/Shared Documents/").files.select("Title").top(3);

console.log(query.toUrl()); // _api/web/getFolderByServerRelativeUrl('!@p1::/sites/dev/Shared Documents/')/files
console.log(query.toRequestUrl()); // _api/web/getFolderByServerRelativeUrl(@p1)/files?@p1='/sites/dev/Shared Documents/'&$select=Title&$top=3

const r = await query();
console.log(r);
```
