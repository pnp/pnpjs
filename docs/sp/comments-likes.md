# @pnp/sp/comments and likes

Comments can be accessed through either IItem or IClientsidePage instances, though in slightly different ways. For information on loading [clientside pages](./clientside-pages.md) or [items](./items.md) please refer to those articles.

_These APIs are currently in BETA and are subject to change or may not work on all tenants._

[![](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

|Scenario|Import Statement|
|--|--|
|Selective 1|import { sp } from "@pnp/sp";<br />import from "@pnp/sp/src/comments";|
|Preset: All|import { sp } from "@pnp/sp/presets/all";|

## ClientsidePage Comments

The IClientsidePage interface has three methods to provide easier access to the comments for a page, without requiring that you load the item separately.

### Add Comments

You can add a comment using the addComment method as shown

```TypeScript
import { CreateClientsidePage } from "@pnp/sp/src/clientside-pages";
import "@pnp/sp/src/comments/clientside-page";

const page = await CreateClientsidePage(sp.web, pageName, pageName, "Article");
// optionaly publish the page first
await page.save();

const comment = await page.addComment("A test comment");
```

### Get Comments

```TypeScript
import { CreateClientsidePage } from "@pnp/sp/src/clientside-pages";
import "@pnp/sp/src/comments/clientside-page";

const page = await CreateClientsidePage(sp.web, pageName, pageName, "Article");
// optionaly publish the page first
await page.save();

await page.addComment("A test comment");
await page.addComment("A test comment");
await page.addComment("A test comment");
await page.addComment("A test comment");
await page.addComment("A test comment");
await page.addComment("A test comment");

const comments = await page.getComments();
```

### GetById

```TypeScript
import { CreateClientsidePage } from "@pnp/sp/src/clientside-pages";
import "@pnp/sp/src/comments/clientside-page";

const page = await CreateClientsidePage(sp.web, pageName, pageName, "Article");
// optionaly publish the page first
await page.save();

const comment = await page.addComment("A test comment");

const commentData = await page.getCommentById(parseInt(comment.id, 10));
```

### Clear Comments


## Item Comments

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/files/web";
import "@pnp/sp/src/items";
import "@pnp/sp/src/comments/item";

const item = await sp.web.getFileByServerRelativeUrl("/sites/dev/SitePages/Test_8q5L.aspx").getItem();

// as an example, or any of the below options
await item.like();
```

The below examples use a variable named "item" which is taken to represent an IItem instance.

## Comments

### Get Comments

```TypeScript
const comments = await item.comments();
```

You can also get the comments merged with instances of the Comment class to immediately start accessing the properties and methods:

```TypeScript
import { spODataEntityArray } from "@pnp/sp/src/odata";
import { Comment, ICommentData } from "@pnp/sp/src/comments";

const comments = await item.comments(spODataEntityArray<Comment, CommentData>(Comment));

// these will be Comment instances in the array
comments[0].replies.add({ text: "#PnPjs is pretty ok!" });

//load the top 20 replies and comments for an item including likedBy information
const comments = await item.comments.expand("replies", "likedBy", "replies/likedBy").top(20).get();
```

### Add Comment

```TypeScript
// you can add a comment as a string
item.comments.add("string comment");

// or you can add it as an object to include mentions
item.comments.add({ text: "comment from object property" });
```

### Delete a Comment

```TypeScript
import { spODataEntityArray, Comment, CommentData } from "@pnp/sp";

const comments = await item.comments(spODataEntityArray<Comment, CommentData>(Comment));

// these will be Comment instances in the array
comments[0].delete()
```

### Like Comment

```TypeScript
import { spODataEntityArray, Comment, CommentData } from "@pnp/sp";

const comments = await item.comments(spODataEntityArray<Comment, CommentData>(Comment));

// these will be Comment instances in the array
comments[0].like()
```

### Unlike Comment

```TypeScript
import { spODataEntityArray, Comment, CommentData } from "@pnp/sp";

const comments = await item.comments(spODataEntityArray<Comment, CommentData>(Comment));

comments[0].unlike()
```

### Reply to a Comment

```TypeScript
import { spODataEntityArray, Comment, CommentData } from "@pnp/sp";

const comments = await item.comments(spODataEntityArray<Comment, CommentData>(Comment));

const comment: Comment & CommentData = await comments[0].replies.add({ text: "#PnPjs is pretty ok!" });
```

### Load Replies to a Comment

```TypeScript
import { spODataEntityArray, Comment, CommentData } from "@pnp/sp";

const comments = await item.comments(spODataEntityArray<Comment, CommentData>(Comment));

const replies = await comments[0].replies();
```

## Like

You can like items and comments on items. See above for how to like or unlike a comment. Below you can see how to like and unlike an items, as well as get the liked by data.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/comments/item";
import { ILikeData, ILikedByInformation } from "@pnp/sp/src/comments";

// like an item
await item.like();

// unlike an item
await item.unlike();

// get the liked by data
const likedByData: ILikeData[] = await item.getLikedBy();

// get the liked by information
const likedByInfo: ILikedByInformation = await item.getLikedByInformation();
```
