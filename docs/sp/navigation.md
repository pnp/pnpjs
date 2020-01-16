# @pnp/sp - navigation

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Navigation Service

|Scenario|Import Statement|
|--|--|
|Selective 1|import { sp } from "@pnp/sp";<br />import "@pnp/sp/navigation";

### getMenuState

The MenuState service operation returns a Menu-State (dump) of a SiteMapProvider on a site. It will return an exception if the SiteMapProvider cannot be found on the site, the SiteMapProvider does not implement the IEditableSiteMapProvider interface or the SiteMapNode key cannot be found within the provider hierarchy.

The IEditableSiteMapProvider also supports Custom Properties which is an optional feature. What will be return in the custom properties is up to the IEditableSiteMapProvider implementation and can differ for for each SiteMapProvider implementation. The custom properties can be requested by providing a comma separated string of property names like: property1,property2,property3\\,containingcomma

NOTE: the , separator can be escaped using the \ as escape character as done in the example above. The string above would split like:

* property1
* property2
* property3,containingcomma

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/navigation";

// Will return a menu state of the default SiteMapProvider 'SPSiteMapProvider' where the dump starts a the RootNode (within the site) with a depth of 10 levels.
const state = await sp.navigation.getMenuState();

// Will return the menu state of the 'SPSiteMapProvider', starting with the node with the key '1002' with a depth of 5
const state2 = await sp.navigation.getMenuState("1002", 5);

// Will return the menu state of the 'CurrentNavSiteMapProviderNoEncode' from the root node of the provider with a depth of 5
const state3 = await sp.navigation.getMenuState(null, 5, "CurrentNavSiteMapProviderNoEncode");
```

### getMenuNodeKey

Tries to get a SiteMapNode.Key for a given URL within a site collection. If the SiteMapNode cannot be found an Exception is returned. The method is using SiteMapProvider.FindSiteMapNodeFromKey(string rawUrl) to lookup the SiteMapNode. Depending on the actual implementation of FindSiteMapNodeFromKey the matching can differ for different SiteMapProviders.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/navigation";

const key = await sp.navigation.getMenuNodeKey("/sites/dev/Lists/SPPnPJSExampleList/AllItems.aspx");
```

## Web Navigation

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 1|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br />import "@pnp/sp/navigation";

The navigation object contains two properties "quicklaunch" and "topnavigationbar". Both have the same set of methods so our examples below show use of only quicklaunch but apply equally to topnavigationbar.

### Get navigation

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/navigation";

const top = await sp.web.navigation.topNavigationBar();
const quick = await sp.web.navigation.quicklaunch();
```

For the following examples we will refer to a variable named "nav" that is understood to be one of topNavigationBar or quicklaunch.

### getById

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/navigation";

const node = await nav.getById(3)();
```

### add

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/navigation";

const result = await nav.add("Node Title", "/sites/dev/pages/mypage.aspx", true);

const nodeDataRaw = result.data;

// request the data from the created node
const nodeData = result.node();
```

### moveAfter

Places a navigation node after another node in the tree

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/navigation";

const node1result = await nav.add(`Testing - ${getRandomString(4)} (1)`, url, true);
const node2result = await nav.add(`Testing - ${getRandomString(4)} (2)`, url, true);
const node1 = await node1result.node();
const node2 = await node2result.node();

await nav.moveAfter(node1.Id, node2.Id);
```

### Delete

Deletes a given node

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/navigation";

const node1result = await nav.add(`Testing - ${getRandomString(4)}`, url, true);
let nodes = await nav();
// check we added a node
let index = nodes.findIndex(n => n.Id === node1result.data.Id)
// index >= 0

// delete a node
await nav.getById(node1result.data.Id).delete();

nodes = await nav();
index = nodes.findIndex(n => n.Id === node1result.data.Id)
// index = -1
```

### Update

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/navigation";


await nav.getById(4).update({
    Title: "A new title",
});
```

### Children

The children property of a Navigation Node represents a collection with all the same properties and methods available on topNavigationBar or quicklaunch.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/navigation";

const childrenData = await nav.getById(1).children();

// add a child
await nav.getById(1).children.add("Title", "Url", true);
```
