# PnPjs

This package is a rollup package of all the other libraries for scenarios where you would prefer to access all of the code from a single file. Examples would be importing a single file into a script editor webpart or using the library in other ways that benefit from a single file. You will not be able to take advantage of selective imports using this bundle.

> Our recommendation is to import the packages directly into your project, or to [create a custom bundle](../concepts/custom-bundle.md). This package is mostly provided to help folks with backward-compatibility needs.

## Script Editor Webpart

The below is an example of using the pnp.js bundle within a Script Editor webpart. This script editor example is provided for folks on older version of SharePoint - when possible your first choice is SharePoint Framework.

You will need to grab the pnp.js bundle file from the dist folder of the pnpjs package and upload it to a location where you can reference it from without your script editor webparts.

> *This is included as a reference for backward compatibility. The script editor webpart is no longer available in SharePoint online. In addition, see our General Statement on Polyfills and [IE11](../concepts/polyfill.md)

```HTML
<script src="https://mytenant.sharepoint.com/sites/dev/Shared%20Documents/pnp2bundle/pnp.js"></script>
<!-- Optional to include the IE11 polyfill package -->
<script src="https://unpkg.com/@pnp/polyfill-ie11"></script>
<script>

document.onreadystatechange = async function() {

    if(document.readyState === "complete") {

        // because this is a UMD bundle there is a global root object named "pnp"
        const a = await pnp.sp.web.lists();
        document.getElementById("pnpexample").innerHTML = JSON.stringify(a);
    }
}
</script>
<div id="pnpexample"></div>
```

## Access Library Features

Within the bundle all of the classes and methods are exported at the root object, with the exports from sp and graph libraries contained with NS variables to avoid naming conflicts. So if you need to access say the "Web" factory you can do so:

```JavaScript
const web = pnp.SPNS.Web("https://something.sharepoint.com");
const lists = await web.lists();
```

```JavaScript
pnp.GraphNS.*
```

Individual libraries can also be accessed for their exports:

```JavaScript
pnp.Logger.subscribe(new pnp.ConsoleListener());
pnp.log.write("hello");
```
