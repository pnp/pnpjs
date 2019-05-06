# @pnp/sp/navigation service

The global navigation service located at "_api/navigation" provides access to the SiteMapProvider instances available in a given site collection.

## getMenuState

The MenuState service operation returns a Menu-State (dump) of a SiteMapProvider on a site. It will return an exception if the SiteMapProvider cannot be found on the site, the SiteMapProvider does not implement the IEditableSiteMapProvider interface or the SiteMapNode key cannot be found within the provider hierarchy.

The IEditableSiteMapProvider also supports Custom Properties which is an optional feature. What will be return in the custom properties is up to the IEditableSiteMapProvider implementation and can differ for for each SiteMapProvider implementation. The custom properties can be requested by providing a comma seperated string of property names like: property1,property2,property3\\,containingcomma

NOTE: the , seperator can be escaped using the \ as escape character as done in the example above. The string above would split like:
* property1
* property2
* property3,containingcomma

```TypeScript
import { sp } from "@pnp/sp";

// Will return a menu state of the default SiteMapProvider 'SPSiteMapProvider' where the dump starts a the RootNode (within the site) with a depth of 10 levels.
sp.navigation.getMenuState().then(r => {

    console.log(JSON.stringify(r, null, 4));

}).catch(console.error);

// Will return the menu state of the 'SPSiteMapProvider', starting with the node with the key '1002' with a depth of 5
sp.navigation.getMenuState("1002", 5).then(r => {

    console.log(JSON.stringify(r, null, 4));

}).catch(console.error);

// Will return the menu state of the 'CurrentNavSiteMapProviderNoEncode' from the root node of the provider with a depth of 5
sp.navigation.getMenuState(null, 5, "CurrentNavSiteMapProviderNoEncode").then(r => {

    console.log(JSON.stringify(r, null, 4));

}).catch(console.error);
```

## getMenuNodeKey

Tries to get a SiteMapNode.Key for a given URL within a site collection. If the SiteMapNode cannot be found an Exception is returned. The method is using SiteMapProvider.FindSiteMapNodeFromKey(string rawUrl) to lookup the SiteMapNode. Depending on the actual implementation of FindSiteMapNodeFromKey the matching can differ for different SiteMapProviders.

```TypeScript
import { sp } from "@pnp/sp";

sp.navigation.getMenuNodeKey("/sites/dev/Lists/SPPnPJSExampleList/AllItems.aspx").then(r => {

    console.log(JSON.stringify(r, null, 4));

}).catch(console.error);
```
