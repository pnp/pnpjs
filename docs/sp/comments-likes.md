# @pnp/sp/comments and likes

Comments can be accessed through either IItem or IClientsidePage instances, though in slightly different ways. For information on loading [clientside pages](./clientside-pages.md) or [items](./items.md) please refer to those articles.

_These APIs are currently in BETA and are subject to change or may not work on all tenants._

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 1|import { spfi } from "@pnp/sp";<br />import "@pnp/sp/comments";|
|Preset: All|import { spfi } from "@pnp/sp/presets/all";|

## ClientsidePage Comments

The IClientsidePage interface has three methods to provide easier access to the comments for a page, without requiring that you load the item separately.

### Add Comments

You can add a comment using the addComment method as shown

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import { CreateClientsidePage } from "@pnp/sp/clientside-pages";
import "@pnp/sp/comments/clientside-page";
import "@pnp/sp/webs";

const sp = spfi("{tenant url}").using(SPFx(this.content));

const page = await CreateClientsidePage(sp.web, "mypage", "My Page Title", "Article");
// optionally publish the page first
await page.save();

const comment = await page.addComment("A test comment");
```

### Get Page Comments

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import { CreateClientsidePage } from "@pnp/sp/clientside-pages";
import "@pnp/sp/comments/clientside-page";
import "@pnp/sp/webs";

const sp = spfi("{tenant url}").using(SPFx(this.content));

const page = await CreateClientsidePage(sp.web, "mypage", "My Page Title", "Article");
// optionally publish the page first
await page.save();

await page.addComment("A test comment");
await page.addComment("A test comment");
await page.addComment("A test comment");
await page.addComment("A test comment");
await page.addComment("A test comment");
await page.addComment("A test comment");

const comments = await page.getComments();
```

### enableComments & disableComments

Used to control the availability of comments on a page

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import { IClientsidePage } from "@pnp/sp/clientside-pages";
// you need to import the comments sub-module or use the all preset
import "@pnp/sp/comments/clientside-page";
import "@pnp/sp/webs";

const sp = spfi("{tenant url}").using(SPFx(this.content));

// our page instance
const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

// turn on comments
await page.enableComments();

// turn off comments
await page.disableComments();
```

### GetById

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import { CreateClientsidePage } from "@pnp/sp/clientside-pages";
import "@pnp/sp/comments/clientside-page";
import "@pnp/sp/webs";

const sp = spfi("{tenant url}").using(SPFx(this.content));

const page = await CreateClientsidePage(sp.web, "mypage", "My Page Title", "Article");
// optionally publish the page first
await page.save();

const comment = await page.addComment("A test comment");

const commentData = await page.getCommentById(parseInt(comment.id, 10));
```

### Clear Comments

## Item Comments

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files/web";
import "@pnp/sp/items";
import "@pnp/sp/comments/item";

const sp = spfi("{tenant url}").using(SPFx(this.content));

const item = await sp.web.getFileByServerRelativePath("/sites/dev/SitePages/Test_8q5L.aspx").getItem();

// as an example, or any of the below options
await item.like();
```

The below examples use a variable named "item" which is taken to represent an IItem instance.

## Comments

### Get Item Comments

```TypeScript
const comments = await item.comments();
```

You can also get the comments merged with instances of the Comment class to immediately start accessing the properties and methods:

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import { IComments } from "@pnp/sp/comments";

const sp = spfi("{tenant url}").using(SPFx(this.content));

const comments: IComments = await item.comments();

// these will be Comment instances in the array
comments[0].replies.add({ text: "#PnPjs is pretty ok!" });

//load the top 20 replies and comments for an item including likedBy information
const comments = await item.comments.expand("replies", "likedBy", "replies/likedBy").top(20)();
```

### Add Comment

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import { ICommentInfo } from "@pnp/sp/comments";

const sp = spfi("{tenant url}").using(SPFx(this.content));

// you can add a comment as a string
const comment = await item.comments.add("string comment");

// or you can add it as an object to include mentions
const commentInfo: Partial<ICommentInfo> = { text: "This is the test comment with at mentions", 
    mentions: [{ loginName: 'test@contoso.com', email: 'test@contoso.com', name: 'Test User' }], };
const comment = await page.addComment(commentInfo);
```

### Delete a Comment

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import { IComments } from "@pnp/sp/comments";

const sp = spfi("{tenant url}").using(SPFx(this.content));

const comments: IComments = await item.comments();

// these will be Comment instances in the array
comments[0].delete()
```

### Like Comment

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import { IComments } from "@pnp/sp/comments";

const sp = spfi("{tenant url}").using(SPFx(this.content));

const comments: IComments = await item.comments();

// these will be Comment instances in the array
comments[0].like();
```

### Unlike Comment

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import { IComments } from "@pnp/sp/comments";

const sp = spfi("{tenant url}").using(SPFx(this.content));

const comments: IComments = await item.comments();

comments[0].unlike()
```

### Reply to a Comment

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import { IComments } from "@pnp/sp/comments";

const sp = spfi("{tenant url}").using(SPFx(this.content));

const comments: IComments = await item.comments();

const comment = await comments[0].comments.add({ text: "#PnPjs is pretty ok!" });
```

### Load Replies to a Comment

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import { IComments } from "@pnp/sp/comments";

const sp = spfi("{tenant url}").using(SPFx(this.content));

const comments: IComments = await item.comments();

const replies = await comments[0].replies();
```

## Like

You can like/unlike client-side pages, items, and comments on items. See above for how to like or unlike a comment. Below you can see how to like and unlike an items, as well as get the liked by data.

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/comments/item";
import { ILikeData, ILikedByInformation } from "@pnp/sp/comments";

const sp = spfi("{tenant url}").using(SPFx(this.content));

const item = await sp.web.getFileByServerRelativePath("/sites/dev/SitePages/Home.aspx").getItem();

// like an item
await item.like();

// unlike an item
await item.unlike();

// get the liked by data
const likedByData: ILikeData[] = await item.getLikedBy();

// get the liked by information
const likedByInfo: ILikedByInformation = await item.getLikedByInformation();
```

To like/unlike a client-side page and get liked by information.

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import { ILikedByInformation } from "@pnp/sp/comments";
import { IClientsidePage } from "@pnp/sp/clientside-pages";

import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages";
import "@pnp/sp/comments/clientside-page";

const sp = spfi("{tenant url}").using(SPFx(this.content));

const page: IClientsidePage = await sp.web.loadClientsidePage("/sites/dev/sitepages/home.aspx");

// like a page
await page.like();

// unlike a page
await page.unlike();

// get the liked by information
const likedByInfo: ILikedByInformation = await page.getLikedByInformation();
```
