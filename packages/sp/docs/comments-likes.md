# @pnp/sp/comments and likes

Likes and comments in the context of modern sites are based on list items, meaning the operations branch from the Item class. To load an item you can refer to the guidance in the [items article](items.md). If you want to set the likes or comments on a modern page and don't know the item id but do know the url you can first load the file and then use the getItem method to get an item instance:

_These APIs are currently in BETA and are subject to change or may not work on all tenants._

```TypeScript
import { sp } from "@pnp/sp";

const item = await sp.web.getFileByServerRelativeUrl("/sites/dev/SitePages/Test_8q5L.aspx").getItem();

// as an example, or any of the below options
await item.like();
```

The below examples use a variable named "item" which is taken to represent an instance of the Item class.

## Comments

### Get Comments

```TypeScript
const comments = await item.comments.get();
```

You can also get the comments merged with instances of the Comment class to immediately start accessing the properties and methods:

```TypeScript
import { spODataEntityArray, Comment, CommentData } from "@pnp/sp";

const comments = await item.comments.get(spODataEntityArray<Comment, CommentData>(Comment));

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

const comments = await item.comments.get(spODataEntityArray<Comment, CommentData>(Comment));

// these will be Comment instances in the array
comments[0].delete()
```

### Like Comment

```TypeScript
import { spODataEntityArray, Comment, CommentData } from "@pnp/sp";

const comments = await item.comments.get(spODataEntityArray<Comment, CommentData>(Comment));

// these will be Comment instances in the array
comments[0].like()
```

### Unlike Comment

```TypeScript
import { spODataEntityArray, Comment, CommentData } from "@pnp/sp";

const comments = await item.comments.get(spODataEntityArray<Comment, CommentData>(Comment));

comments[0].unlike()
```

### Reply to a Comment

```TypeScript
import { spODataEntityArray, Comment, CommentData } from "@pnp/sp";

const comments = await item.comments.get(spODataEntityArray<Comment, CommentData>(Comment));

const comment: Comment & CommentData = await comments[0].replies.add({ text: "#PnPjs is pretty ok!" });
```

### Load Replies to a Comment

```TypeScript
import { spODataEntityArray, Comment, CommentData } from "@pnp/sp";

const comments = await item.comments.get(spODataEntityArray<Comment, CommentData>(Comment));

const replies = await comments[0].replies.get();
```

## Like

You can like items and comments on items. See above for how to like or unlike a comment. Below you can see how to like and unlike an items, as well as get the liked by data.

```TypeScript
import { LikeData } from "@pnp/sp";

// like an item
await item.like();

// unlike an item
await item.unlike();

// get the liked by information
const likedByData: LikeData[] = await item.getLikedBy();
```
