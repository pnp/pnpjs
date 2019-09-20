# @pnp/graph/users

Users are Azure Active Directory objects representing users in the organizations. They represent the single identity for a person accross Microsoft 365 services.  

You can learn more about Microsoft Graph users by reading the [Official Microsoft Graph Documentation](https://docs.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0).

## IUsers, IUser

[![](https://img.shields.io/badge/Invokable-informational.svg)](../invokable.md) [![](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../selective-imports.md)

|Scenario|Import Statement|
|--|--|
|Selective 1|import { graph } from "@pnp/graph";<br />import "@pnp/graph/src/users";|
|Preset: All|import { graph } from "@pnp/sp/presets/all";|

## Current User
```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/src/users";

const currentUser = await graph.me();
```

## Get All Users in the Organization
```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/src/users";

const allUsers = await graph.users();
```

## Get a User by email address (or user id)
```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/src/users";

const matchingUser = await graph.users.getById('jane@contoso.com');
```

## Update Current User
```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/src/users";

await graph.me.update({
    displayName: 'John Doe'
});
```