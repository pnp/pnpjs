# @pnp/sp/clientside-pages

The 'clientside-pages' module allows you to create, edit, and delete modern SharePoint pages. There are methods to update the page settings and add/remove client-side web parts.

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

| Scenario    | Import Statement                                                                                                                                                                                                |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Selective 1 | import { sp } from "@pnp/sp";<br />import { ClientsidePageFromFile, ClientsideText, ClientsideWebpartPropertyTypes, CreateClientsidePage, ClientsideWebpart, IClientsidePage } from "@pnp/sp/clientside-pages"; |
| Selective 2 | import { sp } from "@pnp/sp";<br />import "@pnp/sp/clientside-pages";                                                                                                                                           |
| Preset: All | import { sp, ClientsidePageFromFile, ClientsideText, ClientsideWebpartPropertyTypes, CreateClientsidePage, ClientsideWebpart, IClientsidePage } from "@pnp/sp/presets/all";                                    |

## Create a new Page

You can create a new client-side page in several ways, all are equivalent.

### Create using IWeb.addClientsidePage

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";
import { PromotedState } from "@pnp/sp/clientside-pages";

// Create a page providing a file name
const page = await sp.web.addClientsidePage("mypage1");

// ... other operations on the page as outlined below

// the page is initially not published, you must publish it so it appears for others users
await page.save();

// include title and page layout
const page2 = await sp.web.addClientsidePage("mypage", "My Page Title", "Article");

// you must publish the new page
await page2.save();

// include title, page layout, and specifying the publishing status (Added in 2.0.4)
const page3 = await sp.web.addClientsidePage("mypage", "My Page Title", "Article", PromotedState.PromoteOnPublish);

// you must publish the new page, after which the page will immediately be promoted to a news article
await page3.save();
```

### Create using CreateClientsidePage method

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import { Web } from "@pnp/sp/webs";
import { CreateClientsidePage, PromotedState } from "@pnp/sp/clientside-pages";

const page1 = await CreateClientsidePage(sp.web, "mypage2", "My Page Title");

// you must publish the new page
await page1.save(true);

// specify the page layout type parameter
const page2 = await CreateClientsidePage(sp.web, "mypage3", "My Page Title", "Article");

// you must publish the new page
await page2.save();

// specify the page layout type parameter while also specifying the publishing status (Added in 2.0.4)
const page2half = await CreateClientsidePage(sp.web, "mypage3", "My Page Title", "Article", PromotedState.PromoteOnPublish);

// you must publish the new page, after which the page will immediately be promoted to a news article
await page2half.save();

// use the web factory to create a page in a specific web
const page3 = await CreateClientsidePage(Web("https://{absolute web url}"), "mypage4", "My Page Title");

// you must publish the new page
await page3.save();
```

## Load Pages

There are a few ways to load pages, each of which results in an IClientsidePage instance being returned.

### Load using IWeb.loadClientsidePage

This method takes a _server relative_ path to the page to load.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";

// use from the sp.web fluent chain
const page = await sp.web.loadClientsidePage("/sites/dev/sitepages/mypage3.aspx");

// use the web factory to target a specific web
const page2 = await Web("https://{absolute web url}").loadClientsidePage("/sites/dev/sitepages/mypage3.aspx");
```

### Load using ClientsidePageFromFile

This method takes an IFile instance and loads an IClientsidePage instance.

```TypeScript
import { sp } from "@pnp/sp";
import { ClientsidePageFromFile } from "@pnp/sp/clientside-pages";
import "@pnp/sp/webs";
import "@pnp/sp/files/web";

const page = await ClientsidePageFromFile(sp.web.getFileByServerRelativePath("/sites/dev/sitepages/mypage3.aspx"));
```

## Edit Sections and Columns

Client-side pages are made up of sections, columns, and controls. Sections contain columns which contain controls. There are methods to operate on these within the page, in addition to the standard array methods available in JavaScript. These samples use a variable `page` that is understood to be an IClientsidePage instance which is either created or loaded as outlined in previous sections.

```TypeScript
// our page instance
const page: IClientsidePage;

// add two columns with factor 6 - this is a two column layout as the total factor in a section should add up to 12
const section1 = page.addSection();
section1.addColumn(6);
section1.addColumn(6);

// create a three column layout in a new section
const section2 = page.addSection();
section2.addColumn(4);
section2.addColumn(4);
section2.addColumn(4);

// publish our changes
await page.save();
```

### Manipulate Sections and Columns

```TypeScript
// our page instance
const page: IClientsidePage;

// drop all the columns in this section
// this will also DELETE all controls contained in the columns
page.sections[1].columns.length = 0;

// create a new column layout
page.sections[1].addColumn(4);
page.sections[1].addColumn(8);

// publish our changes
await page.save();
```

### Vertical Section

The vertical section, if on the page, is stored within the sections array. However, you access it slightly differently to make things easier.

```TypeScript
// our page instance
const page: IClientsidePage;

// add or get a vertical section (handles case where section already exists)
const vertSection = page.addVerticalSection();

// ****************************************************************

// if you know or want to test if a vertical section is present:
if (page.hasVerticalSection) {

    // access the vertical section (this method will NOT create the section if it does not exist)
    page.verticalSection.addControl(new ClientsideText("hello"));
} else {

    const vertSection = page.addVerticalSection();
    vertSection.addControl(new ClientsideText("hello"));
}
```

### Reorder Sections

```TypeScript
// our page instance
const page: IClientsidePage;

// swap the order of two sections
// this will preserve the controls within the columns
page.sections = [page.sections[1], page.sections[0]];

// publish our changes
await page.save();
```

### Reorder Columns

The sections and columns are arrays, so normal array operations work as expected

```TypeScript
// our page instance
const page: IClientsidePage;

// swap the order of two columns
// this will preserve the controls within the columns
page.sections[1].columns = [page.sections[1].columns[1], page.sections[1].columns[0]];

// publish our changes
await page.save();
```

## Clientside Controls

Once you have your sections and columns defined you will want to add/edit controls within those columns.

### Add Text Content

```TypeScript
import { ClientsideText } from "@pnp/sp/clientside-pages";

// our page instance
const page: IClientsidePage;

page.addSection().addControl(new ClientsideText("@pnp/sp is a great library!"));

await page.save();
```

### Add Controls

Adding controls involves loading the available client-side part definitions from the server or creating a text part.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";
import { ClientsideWebpart } from "@pnp/sp/clientside-pages";

// this will be a ClientsidePageComponent array
// this can be cached on the client in production scenarios
const partDefs = await sp.web.getClientsideWebParts();

// find the definition we want, here by id
const partDef = partDefs.filter(c => c.Id === "490d7c76-1824-45b2-9de3-676421c997fa");

// optionally ensure you found the def
if (partDef.length < 1) {
    // we didn't find it so we throw an error
    throw new Error("Could not find the web part");
}

// create a ClientWebPart instance from the definition
const part = ClientsideWebpart.fromComponentDef(partDef[0]);

// set the properties on the web part. Here for the embed web part we only have to supply an embedCode - in this case a YouTube video.
// the structure of the properties varies for each web part and each version of a web part, so you will need to ensure you are setting
// the properties correctly
part.setProperties<{ embedCode: string }>({
    embedCode: "https://www.youtube.com/watch?v=IWQFZ7Lx-rg",
});

// we add that part to a new section
page.addSection().addControl(part);

await page.save();
```

## Page Operations

There are other operation you can perform on a page in addition to manipulating the content.

### pageLayout

You can get and set the page layout. Changing the layout after creating the page may have side effects and should be done cautiously.

```TypeScript
// our page instance
const page: IClientsidePage;

// get the current value
const value = page.pageLayout;

// set the value
page.pageLayout = "Article";
await page.save();
```

### bannerImageUrl

```TypeScript
// our page instance
const page: IClientsidePage;

// get the current value
const value = page.bannerImageUrl;

// set the value
page.bannerImageUrl = "/server/relative/path/to/image.png";
await page.save();
```

> Banner images need to exist within the same site collection as the page where you want to use them.

### thumbnailUrl

Allows you to set the thumbnail used for the page independently of the banner.

> If you set the bannerImageUrl property and not thumbnailUrl the thumbnail will be reset to match the banner, mimicking the UI functionality.

```TypeScript
// our page instance
const page: IClientsidePage;

// get the current value
const value = page.thumbnailUrl;

// set the value
page.thumbnailUrl = "/server/relative/path/to/image.png";
await page.save();
```

### topicHeader

```TypeScript
// our page instance
const page: IClientsidePage;

// get the current value
const value = page.topicHeader;

// set the value
page.topicHeader = "My cool header!";
await page.save();

// clear the topic header and hide it
page.topicHeader = "";
await page.save();
```

### title

```TypeScript
// our page instance
const page: IClientsidePage;

// get the current value
const value = page.title;

// set the value
page.title = "My page title";
await page.save();
```

### description

> Descriptions are limited to 255 chars

```TypeScript
// our page instance
const page: IClientsidePage;

// get the current value
const value = page.description;

// set the value
page.description = "A description";
await page.save();
```

### layoutType

Sets the layout type of the page. The valid values are: "FullWidthImage", "NoImage", "ColorBlock", "CutInShape"

```TypeScript
// our page instance
const page: IClientsidePage;

// get the current value
const value = page.layoutType;

// set the value
page.layoutType = "ColorBlock";
await page.save();
```

### headerTextAlignment

Sets the header text alignment to one of "Left" or "Center"

```TypeScript
// our page instance
const page: IClientsidePage;

// get the current value
const value = page.headerTextAlignment;

// set the value
page.headerTextAlignment = "Center";
await page.save();
```

### showTopicHeader

Sets if the topic header is displayed on a page.

```TypeScript
// our page instance
const page: IClientsidePage;

// get the current value
const value = page.showTopicHeader;

// show the header
page.showTopicHeader = true;
await page.save();

// hide the header
page.showTopicHeader = false;
await page.save();
```

### showPublishDate

Sets if the publish date is displayed on a page.

```TypeScript
// our page instance
const page: IClientsidePage;

// get the current value
const value = page.showPublishDate;

// show the date
page.showPublishDate = true;
await page.save();

// hide the date
page.showPublishDate = false;
await page.save();
```

### Get / Set author details

_Added in 2.0.4_

```TypeScript
// our page instance
const page: IClientsidePage;

// get the author details (string | null)
const value = page.authorByLine;

// set the author by user id
const user = await web.currentUser.select("Id", "LoginName")();
const userId = user.Id;
const userLogin = user.LoginName;

await page.setAuthorById(userId);
await page.save();

await page.setAuthorByLoginName(userLogin);
await page.save();
```

> you must still save the page after setting the author to persist your changes as shown in the example.

### load

Loads the page from the server. This will overwrite any local unsaved changes.

```TypeScript
// our page instance
const page: IClientsidePage;

await page.load();
```

### save

Saves any changes to the page, optionally keeping them in draft state.

```TypeScript
// our page instance
const page: IClientsidePage;

// changes are published
await page.save();

// changes remain in draft
await page.save(false);
```

### discardPageCheckout

Discards any current checkout of the page by the current user.

```TypeScript
// our page instance
const page: IClientsidePage;

await page.discardPageCheckout();
```

### promoteToNews

Promotes the page as a news article.

```TypeScript
// our page instance
const page: IClientsidePage;

await page.promoteToNews();
```

### enableComments & disableComments

Used to control the availability of comments on a page.

[![Known Issue Banner](https://img.shields.io/badge/Known%20Issue-important.svg)](https://github.com/pnp/pnpjs/issues/1383)

```TypeScript
// you need to import the comments sub-module or use the all preset
import "@pnp/sp/comments/clientside-page";

// our page instance
const page: IClientsidePage;

// turn on comments
await page.enableComments();

// turn off comments
await page.disableComments();
```

### findControlById

Finds a control within the page by id.

```TypeScript
import { ClientsideText } from "@pnp/sp/clientside-pages";

// our page instance
const page: IClientsidePage;

const control = page.findControlById("06d4cdf6-bce6-4200-8b93-667a1b0a6c9d");

// you can also type the control
const control = page.findControlById<ClientsideText>("06d4cdf6-bce6-4200-8b93-667a1b0a6c9d");
```

### findControl

Finds a control within the page using the supplied delegate. Can also be used to iterate through all controls in the page.

```TypeScript
// our page instance
const page: IClientsidePage;

// find the first control whose order is 9
const control = page.findControl((c) => c.order === 9);

// iterate all the controls and output the id to the console
page.findControl((c) => {
    console.log(c.id);
    return false;
});
```

### like & unlike

Updates the page's like value for the current user.

```TypeScript
// our page instance
const page: IClientsidePage;

// like this page
await page.like();

// unlike this page
await page.unlike();
```

### getLikedByInformation

Gets the likes information for this page.

```TypeScript
// our page instance
const page: IClientsidePage;

const info = await page.getLikedByInformation();
```

### copy

Creates a copy of the page, including all controls.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";

// our page instance
const page: IClientsidePage;

// creates a published copy of the page
const pageCopy = await page.copy(sp.web, "newpagename", "New Page Title");

// creates a draft (unpublished) copy of the page
const pageCopy2 = await page.copy(sp.web, "newpagename", "New Page Title", false);

// edits to pageCopy2 ...

// publish the page
pageCopy2.save();
```

### setBannerImage

Sets the banner image url and optionally additional properties. Allows you to set additional properties if needed, if you do not need to set the additional properties they are equivalent.

> Banner images need to exist within the same site collection as the page where you want to use them.

```TypeScript
// our page instance
const page: IClientsidePage;

page.setBannerImage("/server/relative/path/to/image.png");

// save the changes
await page.save();

// set additional props
page.setBannerImage("/server/relative/path/to/image.png", {
    altText: "Image description",
    imageSourceType: 2,
    translateX: 30,
    translateY: 1234,
});

// save the changes
await page.save();
```

This sample shows the full process of adding a page, image file, and setting the banner image in nodejs. The same code would work in a browser with an update on how you get the `file` - likely from a file input or similar.

```TypeScript
import { SPFetchClient } from "@pnp/nodejs";
import { join } from "path";
import { readFileSync } from "fs";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/clientside-pages";

// configure your node options
sp.setup({
  sp: {
    fetchClientFactory: () => {
      return new SPFetchClient("{Site Url}", "{Client Id}", "{Client Secret}");
    },
  },
});

// add the banner image
const dirname = join("C:/path/to/file", "img-file.jpg");
const file: Uint8Array = new Uint8Array(readFileSync(dirname));
const far = await sp.web.getFolderByServerRelativeUrl("/sites/dev/Shared Documents").files.add("banner.jpg", file, true);

// add the page
const page = await sp.web.addClientsidePage("MyPage", "Page Title");

// set the banner image
page.setBannerImage(far.data.ServerRelativeUrl);

// publish the page
await page.save();
```

### setBannerImageFromExternalUrl

_Added in 2.0.12_

Allows you to set the banner image from a source outside the current site collection. The image file will be copied to the SiteAssets library and referenced from there.

```TypeScript
// our page instance
const page: IClientsidePage;

// you must await this method
await page.setBannerImageFromExternalUrl("https://absolute.url/to/my/image.jpg");

// save the changes
await page.save();
```

You can optionally supply additional props for the banner image, these match the properties when calling [setBannerImage](#setbannerimage)

```TypeScript
// our page instance
const page: IClientsidePage;

// you must await this method
await page.setBannerImageFromExternalUrl("https://absolute.url/to/my/image.jpg", {
    altText: "Image description",
    imageSourceType: 2,
    translateX: 30,
    translateY: 1234,
});

// save the changes
await page.save();
```
