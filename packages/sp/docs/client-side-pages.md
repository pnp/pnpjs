# @pnp/sp/clientsidepages

The ability to manage client-side pages is a capability introduced in version 1.0.2 of @pnp/sp. Through the methods described
you can add and edit "modern" pages in SharePoint sites.

## Add Client-side page

Using the addClientSidePage you can add a new client side page to a site, specifying the filename.

```TypeScript
import { sp } from "@pnp/sp";

const page = await sp.web.addClientSidePage(`file-name`);

// OR

const page = await sp.web.addClientSidePage(`file-name`, `Page Display Title`);
```

Added in 1.0.5 you can also add a client side page using the list path. This gets around potential language issues with list title. You must specify the list path when calling this method in addition to the new page's filename.

```TypeScript
import { sp } from "@pnp/sp";

const page = await sp.web.addClientSidePageByPath(`file-name`, "/sites/dev/SitePages");
```

## Load Client-side page

You can also load an existing page based on the file representing that page. Note that the static fromFile returns a promise which 
resolves so the loaded page. Here we are showing use of the getFileByServerRelativeUrl method to get the File instance, but any of the ways
of [getting a File instance](files.md) will work. Also note we are passing the File instance, not the file content.

```TypeScript
import { 
    sp,
    ClientSidePage,
} from "@pnp/sp";

const page = await ClientSidePage.fromFile(sp.web.getFileByServerRelativeUrl("/sites/dev/SitePages/ExistingFile.aspx"));
```

**The remaining examples below reference a variable "page" which is assumed to be a ClientSidePage instance loaded through one of the above means.**

## Add Controls

A client-side page is made up of sections, which have columns, which contain controls. A new page will have none of these and an existing page may have
any combination of these. There are a few rules to understand how sections and columns layout on a page for display. A section is a horizontal piece of
a page that extends 100% of the page width. A page with multiple sections will stack these sections based on the section's order property - a 1 based index.

Within a section you can have one or more columns. Each column is ordered left to right based on the column's order property. The width of each column is
controlled by the factor property whose value is one of 0, 2, 4, 6, 8, 10, or 12. The columns in a section should have factors that add up to 12. Meaning 
if you wanted to have two equal columns you can set a factor of 6 for each. A page can have empty columns.

```TypeScript
import { 
    sp, 
    ClientSideText, 
} from "@pnp/sp";

// this code adds a section, and then adds a control to that section. The control is added to the section's defaultColumn, and if there are no columns a single
// column of factor 12 is created as a default. Here we add the ClientSideText part
page.addSection().addControl(new ClientSideText("@pnp/sp is a great library!"));

// here we add a section, add two columns, and add a text control to the second section so it will appear on the right of the page
// add and get a reference to a new section
const section = page.addSection();

// add a column of factor 6
section.addColumn(6);

// add and get a reference to a new column of factor 6
const column = section.addColumn(6);

// add a text control to the second new column
column.addControl(new ClientSideText("Be sure to check out the @pnp docs at https://pnp.github.io/pnpjs/"));

// we need to save our content changes
await page.save();
```

## Add Client-side Web Parts

Beyond the text control above you can also add any of the available client-side web parts in a given site. To find out what web parts are available you
first call the web's getClientSideWebParts method. Once you have a list of parts you need to find the defintion you want to use, here we get the Embed web part
whose's id is "490d7c76-1824-45b2-9de3-676421c997fa" (at least in one farm, your mmv).

```TypeScript
import {
    sp,
    ClientSideWebpart,
    ClientSideWebpartPropertyTypes,
} from "@pnp/sp";

// this will be a ClientSidePageComponent array
// this can be cached on the client in production scenarios
const partDefs = await sp.web.getClientSideWebParts();

// find the definition we want, here by id
const partDef = partDefs.filter(c => c.Id === "490d7c76-1824-45b2-9de3-676421c997fa");

// optionally ensure you found the def
if (partDef.length < 1) {
    // we didn't find it so we throw an error
    throw new Error("Could not find the web part");
}

// create a ClientWebPart instance from the definition
const part = ClientSideWebpart.fromComponentDef(partDef[0]);

// set the properties on the web part. Here we have imported the ClientSideWebpartPropertyTypes module and can use that to type
// the available settings object. You can use your own types or help us out and add some typings to the module :).
// here for the embed web part we only have to supply an embedCode - in this case a youtube video.
part.setProperties<ClientSideWebpartPropertyTypes.Embed>({
    embedCode: "https://www.youtube.com/watch?v=IWQFZ7Lx-rg",
});

// we add that part to a new section
page.addSection().addControl(part);

// save our content changes back to the server
await page.save();
```

## Find Controls

Added in _1.0.3_

You can use the either of the two available method to locate controls within a page. These method search through all sections, columns, and controls returning the first instance that meets the supplied criteria.

```TypeScript
import { ClientSideWebPart } from "@pnp/sp";

// find a control by instance id
const control1 = page.findControlById("b99bfccc-164e-4d3d-9b96-da48db62eb78");

// type the returned control
const control2 = page.findControlById<ClientSideWebPart>("c99bfccc-164e-4d3d-9b96-da48db62eb78");
const control3 = page.findControlById<ClientSideText>("a99bfccc-164e-4d3d-9b96-da48db62eb78");

// use any predicate to find a control
const control4 = page2.findControl<ClientSideWebpart>((c: CanvasControl) => {

    // any logic you wish can be used on the control here
    // return true to return that control
    return c.order > 3;
});
```

## Control Comments

You can choose to enable or disable comments on a page using these methods

```TypeScript
// indicates if comments are disabled, not valid until the page is loaded (Added in _1.0.3_)
page.commentsDisabled

// enable comments
await page.enableComments();

// disable comments
await page.disableComments();
```

## Like/Unlike Client-side page, get like information about page

Added in _1.2.4_

You can like or unlike a modern page. You can also get information about the likes (i.e like Count and which users liked the page)

```TypeScript
// Like a Client-side page (Added in _1.2.4_)
await page.like();

// Unlike a Client-side page
await page.unlike();

// Get liked by information such as like count and user's who liked the page
await page.getLikedByInformation();
```

## Sample

The below sample shows the process to add a Yammer feed webpart to the page. The properties required as well as the data version are found by adding the part using the UI and reviewing the values. Some or all of these may be discoverable using [Yammer APIs](https://developer.microsoft.com/en-us/yammer/docs). An identical process can be used to add web parts of any type by adjusting the definition, data version, and properties appropriately.

```TypeScript
// get webpart defs
const defs = await sp.web.getClientSideWebParts();

// this is the id of the definition in my farm
const yammerPartDef = defs.filter(d => d.Id === "31e9537e-f9dc-40a4-8834-0e3b7df418bc")[0];

// page file
const file = sp.web.getFileByServerRelativePath("/sites/dev/SitePages/Testing_kVKF.aspx");

// create page instance
const page = await ClientSidePage.fromFile(file);

// create part instance from definition
const part = ClientSideWebpart.fromComponentDef(yammerPartDef);

// update data version
part.dataVersion = "1.5";

// set the properties required
part.setProperties({
    feedType: 0,
    isSuiteConnected: false,
    mode: 2,
    networkId: 9999999,
    yammerEmbedContainerHeight: 400,
    yammerFeedURL: "",
    yammerGroupId: -1,
    yammerGroupMugshotUrl: "https://mug0.assets-yammer.com/mugshot/images/{width}x{height}/all_company.png",
    yammerGroupName: "All Company",
    yammerGroupUrl: "https://www.yammer.com/{tenant}/#/threads/company?type=general",
});

// add to the section/column you want
page.sections[0].addControl(part);

// persist changes
page.save();
```
