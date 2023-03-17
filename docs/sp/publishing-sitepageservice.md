# @pnp/sp/publishing-sitepageservice

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

Through the REST api you are able to call a SP.Publishing.SitePageService method GetCurrentUserMemberships. This method allows you to fetch identifiers of unified groups to which current user belongs. It's an alternative for using [graph.me.transitiveMemberOf()](../graph/users.md#user-properties) method from graph package. Note, method only works with the context of a logged in user, and not with app-only permissions.

## Get current user's group memberships

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/publishing-sitepageservice";

const sp = spfi(...);

const groupIdentifiers = await sp.publishingSitePageService.getCurrentUserMemberships();
```