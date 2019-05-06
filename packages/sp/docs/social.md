# @pnp/sp/social

The social API allows you to track followed sites, people, and docs. Note, many of these methods only work with the context of a logged in user, and not
with app-only permissions.

## getFollowedSitesUri

Gets a URI to a site that lists the current user's followed sites.

```TypeScript
import { sp } from "@pnp/sp";

const uri = await sp.social.getFollowedSitesUri();
```

## getFollowedDocumentsUri

Gets a URI to a site that lists the current user's followed documents.

```TypeScript
import { sp } from "@pnp/sp";

const uri = await sp.social.getFollowedDocumentsUri();
```

## follow

Makes the current user start following a user, document, site, or tag

```TypeScript
import { sp, SocialActorType } from "@pnp/sp";

// follow a site
const r1 = await sp.social.follow({
    ActorType: SocialActorType.Site,
    ContentUri: "htts://tenant.sharepoint.com/sites/site",
});

// follow a person
const r2 = await sp.social.follow({
    AccountName: "i:0#.f|membership|person@tenant.com",
    ActorType: SocialActorType.User,
});

// follow a doc
const r3 = await sp.social.follow({
    ActorType: SocialActorType.Document,
    ContentUri: "https://tenant.sharepoint.com/sites/dev/SitePages/Test.aspx",
});

// follow a tag
// You need the tag GUID to start following a tag.
// You can't get the GUID by using the REST service, but you can use the .NET client object model or the JavaScript object model.
// See How to get a tag's GUID based on the tag's name by using the JavaScript object model.
// https://docs.microsoft.com/en-us/sharepoint/dev/general-development/follow-content-in-sharepoint#bk_getTagGuid
const r4 = await sp.social.follow({
    ActorType: SocialActorType.Tag,
    TagGuid: "19a4a484-c1dc-4bc5-8c93-bb96245ce928",
});
```

## isFollowed

Indicates whether the current user is following a specified user, document, site, or tag

```TypeScript
import { sp, SocialActorType } from "@pnp/sp";

// pass the same social actor struct as shown in follow example for each type
const r = await sp.social.isFollowed({
    AccountName: "i:0#.f|membership|person@tenant.com",
    ActorType: SocialActorType.User,
});
```

## stopFollowing

Makes the current user stop following a user, document, site, or tag

```TypeScript
import { sp, SocialActorType } from "@pnp/sp";

// pass the same social actor struct as shown in follow example for each type
const r = await sp.social.stopFollowing({
    AccountName: "i:0#.f|membership|person@tenant.com",
    ActorType: SocialActorType.User,
});
```

## my

### get

Gets this user's social information

```TypeScript
import { sp } from "@pnp/sp";

const r = await sp.social.my.get();
```

### followed

Gets users, documents, sites, and tags that the current user is following based on the supplied flags.

```TypeScript
import { sp, SocialActorTypes } from "@pnp/sp";

// get all the followed documents
const r1 = await sp.social.my.followed(SocialActorTypes.Document);

// get all the followed documents and sites
const r2 = await sp.social.my.followed(SocialActorTypes.Document | SocialActorTypes.Site);

// get all the followed sites updated in the last 24 hours
const r3 = await sp.social.my.followed(SocialActorTypes.Site | SocialActorTypes.WithinLast24Hours);
```

### followedCount

Works as followed but returns on the count of actors specifed by the query

```TypeScript
import { sp, SocialActorTypes } from "@pnp/sp";

// get the followed documents count
const r = await sp.social.my.followedCount(SocialActorTypes.Document);
```

### followers

Gets the users who are following the current user.

```TypeScript
import { sp } from "@pnp/sp";

// get the followed documents count
const r = await sp.social.my.followers();
```

### suggestions

Gets users who the current user might want to follow.

```TypeScript
import { sp } from "@pnp/sp";

// get the followed documents count
const r = await sp.social.my.suggestions();
```
