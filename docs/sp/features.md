# @pnp/sp/features

Features module provides method to get the details of activated features. And to activate/deactivate features scoped at Site Collection and Web.

## IFeatures

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

Represents a collection of features. SharePoint Sites and Webs will have a collection of features

### getById

Gets the information about a feature for the given GUID

```TypeScript
import { spfi } from "@pnp/sp";

const sp = spfi(...);

//Example of GUID format a7a2793e-67cd-4dc1-9fd0-43f61581207a
const webFeatureId = "guid-of-web-feature";
const webFeature = await sp.web.features.getById(webFeatureId)();

const siteFeatureId = "guid-of-site-scope-feature";
const siteFeature = await sp.site.features.getById(siteFeatureId)();
```

### add

Adds (activates) a feature at the Site or Web level

```TypeScript
import { spfi } from "@pnp/sp";

const sp = spfi(...);

//Example of GUID format a7a2793e-67cd-4dc1-9fd0-43f61581207a
const webFeatureId = "guid-of-web-feature";
let res = await sp.web.features.add(webFeatureId);
// Activate with force
res = await sp.web.features.add(webFeatureId, true);
```

### remove

Removes and deactivates the specified feature from the SharePoint Site or Web

```TypeScript
import { spfi } from "@pnp/sp";

const sp = spfi(...);

//Example of GUID format a7a2793e-67cd-4dc1-9fd0-43f61581207a
const webFeatureId = "guid-of-web-feature";
let res = await sp.web.features.remove(webFeatureId);
// Deactivate with force
res = await sp.web.features.remove(webFeatureId, true);
```

## IFeature  

Represents an instance of a SharePoint feature.

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

### deactivate

Deactivates the specified feature from the SharePoint Site or Web

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/features";

const sp = spfi(...);

//Example of GUID format a7a2793e-67cd-4dc1-9fd0-43f61581207a
const webFeatureId = "guid-of-web-feature";
sp.web.features.remove(webFeatureId);

// Deactivate with force
sp.web.features.remove(webFeatureId, true);
```
