# @pnp/sp/clientside-pages

The 'clientside-pages' module allows you to create, edit, and delete modern SharePoint pages. There are methods to update the page settings and add/remove client-side web parts.

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

## Create a new Page

You can create a new client-side page in several ways, all are equivalent.

### Create using IWeb.addClientsidePage

```TypeScript
import { spfi, SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";
import { PromotedState } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

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
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import { Web } from "@pnp/sp/webs";
import { CreateClientsidePage, PromotedState } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

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
const page3 = await CreateClientsidePage(Web([sp, "https://{absolute web url}"]), "mypage4", "My Page Title");

// you must publish the new page
await page3.save();
```

### Create using IWeb.addFullPageApp

Using this method you can easily create a full page app page given the component id. Don't forget the page will not be published and you will need to call save.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages";

const sp = spfi(...);

const page = await sp.web.addFullPageApp("name333", "My Title", "2CE4E250-B997-11EB-A9D2-C9D2FF95D000");
// ... other page actions
// you must save the page to publish it
await page.save();
```

## Load Pages

There are a few ways to load pages, each of which results in an IClientsidePage instance being returned.

### Load using IWeb.loadClientsidePage

This method takes a _server relative_ path to the page to load.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";

const sp = spfi(...);

// use from the sp.web fluent chain
const page = await sp.web.loadClientsidePage("/sites/dev/sitepages/mypage3.aspx");

// use the web factory to target a specific web
const page2 = await Web([sp.web, "https://{absolute web url}"]).loadClientsidePage("/sites/dev/sitepages/mypage3.aspx");
```

### Load using ClientsidePageFromFile

This method takes an IFile instance and loads an IClientsidePage instance.

```TypeScript
import { spfi } from "@pnp/sp";
import { ClientsidePageFromFile } from "@pnp/sp/clientside-pages";
import "@pnp/sp/webs";
import "@pnp/sp/files/web";

const sp = spfi(...);

const page = await ClientsidePageFromFile(sp.web.getFileByServerRelativePath("/sites/dev/sitepages/mypage3.aspx"));
```

## Edit Sections and Columns

Client-side pages are made up of sections, columns, and controls. Sections contain columns which contain controls. There are methods to operate on these within the page, in addition to the standard array methods available in JavaScript. These samples use a variable `page` that is understood to be an IClientsidePage instance which is either created or loaded as outlined in previous sections.

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

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
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

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
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

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
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

// swap the order of two sections
// this will preserve the controls within the columns
page.sections = [page.sections[1], page.sections[0]];

// publish our changes
await page.save();
```

### Reorder Columns

The sections and columns are arrays, so normal array operations work as expected

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

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
import { spfi } from "@pnp/sp";
import { ClientsideText, IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

page.addSection().addControl(new ClientsideText("@pnp/sp is a great library!"));

await page.save();
```

### Add Controls

Adding controls involves loading the available client-side part definitions from the server or creating a text part.

```TypeScript
import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";
import { spfi } from "@pnp/sp";
import { ClientsideWebpart } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

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

### Handle Different Webpart's Settings

There are many ways that client side web parts are implemented and we can't provide handling within the library for all possibilities. This example shows how to handle a property set within the serverProcessedContent, in this case a List part's display title.

```TypeScript
import { spfi } from "@pnp/sp";
import { ClientsideWebpart } from "@pnp/sp/clientside-pages";
import "@pnp/sp/webs";

// we create a class to wrap our functionality in a reusable way
class ListWebpart extends ClientsideWebpart {

  constructor(control: ClientsideWebpart) {
    super((<any>control).json);
  }

  // add property getter/setter for what we need, in this case "listTitle" within searchablePlainTexts
  public get DisplayTitle(): string {
    return this.json.webPartData?.serverProcessedContent?.searchablePlainTexts?.listTitle || "";
  }

  public set DisplayTitle(value: string) {
    this.json.webPartData.serverProcessedContent.searchablePlainTexts.listTitle = value;
  }
}

const sp = spfi(...);

// now we load our page
const page = await sp.web.loadClientsidePage("/sites/dev/SitePages/List-Web-Part.aspx");

// get our part and pass it to the constructor of our wrapper class
const part = new ListWebpart(page.sections[0].columns[0].getControl(0));

part.DisplayTitle = "My New Title!";

await page.save();
```

> Unfortunately each webpart can be authored differently, so there isn't a way to know how the setting for a given webpart are stored without loading it and examining the properties.

## Page Operations

There are other operation you can perform on a page in addition to manipulating the content.

### pageLayout

You can get and set the page layout. Changing the layout after creating the page may have side effects and should be done cautiously.

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

// get the current value
const value = page.pageLayout;

// set the value
page.pageLayout = "Article";
await page.save();
```

### bannerImageUrl

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

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
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

// get the current value
const value = page.thumbnailUrl;

// set the value
page.thumbnailUrl = "/server/relative/path/to/image.png";
await page.save();
```

### topicHeader

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

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
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

// get the current value
const value = page.title;

// set the value
page.title = "My page title";
await page.save();
```

### description

> Descriptions are limited to 255 chars

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

// get the current value
const value = page.description;

// set the value
page.description = "A description";
await page.save();
```

### layoutType

Sets the layout type of the page. The valid values are: "FullWidthImage", "NoImage", "ColorBlock", "CutInShape"

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

// get the current value
const value = page.layoutType;

// set the value
page.layoutType = "ColorBlock";
await page.save();
```

### headerTextAlignment

Sets the header text alignment to one of "Left" or "Center"

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

// get the current value
const value = page.headerTextAlignment;

// set the value
page.headerTextAlignment = "Center";
await page.save();
```

### showTopicHeader

Sets if the topic header is displayed on a page.

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

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
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";
const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

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

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";
import "@pnp/sp/clientside-pages";
import "@pnp/sp/site-users";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

// get the author details (string | null)
const value = page.authorByLine;

// set the author by user id
const user = await sp.web.currentUser.select("Id", "LoginName")();
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
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

await page.load();
```

### save

>![Known Issue Banner](https://img.shields.io/badge/Known%20Issue-important.svg) Uncustomized home pages (i.e the home page that is generated with a site out of the box) cannot be updated by this library without becoming corrupted.

Saves any changes to the page, optionally keeping them in draft state.

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

// changes are published
await page.save();

// changes remain in draft
await page.save(false);
```

### discardPageCheckout

Discards any current checkout of the page by the current user.

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

await page.discardPageCheckout();
```

### schedulePublish

Schedules the page for publishing.

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

// date and time to publish the page in UTC.
const publishDate = new Date("1/1/1901");

const scheduleVersion: string = await page.schedulePublish(publishDate);
```

### promoteToNews

Promotes the page as a news article.

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

await page.promoteToNews();
```

### enableComments & disableComments

Used to control the availability of comments on a page.

[![Known Issue Banner](https://img.shields.io/badge/Known%20Issue-important.svg)](https://github.com/pnp/pnpjs/issues/1383)

```TypeScript
import { spfi } from "@pnp/sp";
// you need to import the comments sub-module or use the all preset
import "@pnp/sp/comments/clientside-page";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

// turn on comments
await page.enableComments();

// turn off comments
await page.disableComments();
```

### findControlById

Finds a control within the page by id.

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage, ClientsideText } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

const control = page.findControlById("06d4cdf6-bce6-4200-8b93-667a1b0a6c9d");

// you can also type the control
const control = page.findControlById<ClientsideText>("06d4cdf6-bce6-4200-8b93-667a1b0a6c9d");
```

### findControl

Finds a control within the page using the supplied delegate. Can also be used to iterate through all controls in the page.

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

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
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";
import "@pnp/sp/webs";

const sp = spfi(...);

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

// creates a published copy of the page
const pageCopy = await page.copy(sp.web, "newpagename", "New Page Title");

// creates a draft (unpublished) copy of the page
const pageCopy2 = await page.copy(sp.web, "newpagename", "New Page Title", false);

// edits to pageCopy2 ...

// publish the page
pageCopy2.save();
```

### copyTo

Copies the contents of a page to another existing page instance.

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";
import "@pnp/sp/webs";

const sp = spfi(...);

// our page instances, loaded in any of the ways shown above
const source: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");
const target: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/target.aspx");
const target2: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/target2.aspx");

// creates a published copy of the page
await source.copyTo(target);

// creates a draft (unpublished) copy of the page
await source.copyTo(target2, false);

// edits to target2...

// publish the page
target2.save();
```

### setBannerImage

Sets the banner image url and optionally additional properties. Allows you to set additional properties if needed, if you do not need to set the additional properties they are equivalent.

> Banner images need to exist within the same site collection as the page where you want to use them.

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

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
import { join } from "path";
import { createReadStream } from "fs";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import { SPDefault } from "@pnp/nodejs";
import { LogLevel  } from "@pnp/logging";

import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/clientside-pages";

const buffer = readFileSync("c:/temp/key.pem");

const config:any = {
  auth: {
    authority: "https://login.microsoftonline.com/{my tenant}/",
    clientId: "{application (client) id}",
    clientCertificate: {
      thumbprint: "{certificate thumbprint, displayed in AAD}",
      privateKey: buffer.toString(),
    },
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel: any, message: any, containsPii: any) {
          console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Verbose
    }
  }
};

// configure your node options
const sp = spfi('{site url}').using(SPDefault({
  baseUrl: '{site url}',
  msal: {
    config: config,
    scopes: [ 'https://{my tenant}.sharepoint.com/.default' ]
  }
}));


// add the banner image
const dirname = join("C:/path/to/file", "img-file.jpg");

const chunkedFile = createReadStream(dirname);

const far = await sp.web.getFolderByServerRelativePath("/sites/dev/Shared Documents").files.addChunked( "banner.jpg", chunkedFile );

// add the page
const page = await sp.web.addClientsidePage("MyPage", "Page Title");

// set the banner image
page.setBannerImage(far.data.ServerRelativeUrl);

// publish the page
await page.save();
```

### setBannerImageFromExternalUrl

Allows you to set the banner image from a source outside the current site collection. The image file will be copied to the SiteAssets library and referenced from there.

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

// you must await this method
await page.setBannerImageFromExternalUrl("https://absolute.url/to/my/image.jpg");

// save the changes
await page.save();
```

You can optionally supply additional props for the banner image, these match the properties when calling [setBannerImage](#setbannerimage)

```TypeScript
import { spfi } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

const sp = spfi(...);

const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

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

### recycle

Allows you to recycle a page without first needing to use getItem

```TypeScript
// our page instance
const page: IClientsidePage;
// you must await this method
await page.recycle();
```

### delete

Allows you to delete a page without first needing to use getItem

```TypeScript
// our page instance
const page: IClientsidePage;
// you must await this method
await page.delete();
```

### saveAsTemplate

Save page as a template from which other pages can be created. If it doesn't exist a special folder "Templates" will be added to the doc lib

```TypeScript
// our page instance
const page: IClientsidePage;
// you must await this method
await page.saveAsTemplate();
// save a template, but don't publish it allowing you to make changes before it is available to users
// you 
await page.saveAsTemplate(false);
// ... changes to the page
// you must publish the template so it is available
await page.save();
```

### share

Allows sharing a page with one or more email addresses, optionall including a message in the email

```TypeScript
// our page instance
const page: IClientsidePage;
// you must await this method
await page.share(["email@place.com", "email2@otherplace.com"]);
// optionally include a message
await page.share(["email@place.com", "email2@otherplace.com"], "Please check out this cool page!");
```

## Add Repost Page

You can use the `addRepostPage` method to add a report page. The method returns the absolute url of the created page. All properties are optional but it is recommended to include as much as possible to improve the quality of the repost card's display.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages";

const sp = spfi(...);
const page = await sp.web.addRepostPage({
    BannerImageUrl: "https://some.absolute/path/to/an/image.jpg",
    IsBannerImageUrlExternal: true,
    Description: "My Description",
    Title: "This is my title!",
    OriginalSourceUrl: "https://absolute/path/to/article",
});
```

> To specify an existing item in another list all of the four properties OriginalSourceSiteId, OriginalSourceWebId, OriginalSourceListId, and OriginalSourceItemId are required.
