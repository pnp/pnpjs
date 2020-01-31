# @pnp/graph/users

Users are Azure Active Directory objects representing users in the organizations. They represent the single identity for a person across Microsoft 365 services.  

You can learn more about Microsoft Graph users by reading the [Official Microsoft Graph Documentation](https://docs.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0).

## IUsers, IUser

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 1|import { graph } from "@pnp/graph";<br />import "@pnp/graph/users";|
|Preset: All|import { graph } from "@pnp/sp/presets/all";|

## Current User

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users";

const currentUser = await graph.me();
```

## Get All Users in the Organization

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users";

const allUsers = await graph.users();
```

## Get a User by email address (or user id)

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users";

const matchingUser = await graph.users.getById('jane@contoso.com')();
```

## Update Current User

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users";

await graph.me.update({
    displayName: 'John Doe'
});
```

## People

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users";

const people = await graph.me.people();

// get the top 3 people
const people = await graph.me.people.top(3)();
```
