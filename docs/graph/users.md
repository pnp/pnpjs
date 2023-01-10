# @pnp/graph/users

Users are Azure Active Directory objects representing users in the organizations. They represent the single identity for a person across Microsoft 365 services.  

You can learn more about Microsoft Graph users by reading the [Official Microsoft Graph Documentation](https://docs.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0).

## IUsers, IUser, IPeople

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Current User

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";

const graph = graphfi(...);

const currentUser = await graph.me();
```

## Get Users in the Organization

> If you want to get all users you will need to [use paging](./behaviors.md#paged)

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";

const graph = graphfi(...);

const allUsers = await graph.users();
```

## Get a User by email address (or user id)

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";

const graph = graphfi(...);

const matchingUser = await graph.users.getById('jane@contoso.com')();
```

## User Properties

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";

const graph = graphfi(...);

await graph.me.memberOf();
await graph.me.transitiveMemberOf();
```

## Update Current User

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";

const graph = graphfi(...);

await graph.me.update({
    displayName: 'John Doe'
});
```

## People

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";

const graph = graphfi(...);

const people = await graph.me.people();

// get the top 3 people
const people = await graph.me.people.top(3)();
```

## Manager

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";

const graph = graphfi(...);

const manager = await graph.me.manager();
```

## Direct Reports

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";

const graph = graphfi(...);

const reports = await graph.me.directReports();
```

## Photo

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/photos";

const graph = graphfi(...);

const currentUser = await graph.me.photo();
const specificUser = await graph.users.getById('jane@contoso.com').photo();
```

## User Photo Operations

See [Photos](./photos.md)

## User Presence Operation

See [Cloud Communications](./cloud-communications.md)

## User Messages (Mail)

See [Messages](./messages.md)

## User OneDrive

See [OneDrive](./onedrive.md)
