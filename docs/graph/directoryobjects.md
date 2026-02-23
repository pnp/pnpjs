# @pnp/graph/directoryObjects

Represents an Azure Active Directory object. The directoryObject type is the base type for many other directory entity types.

More information can be found in the official Graph documentation:

- [DirectoryObject Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/directoryobject?view=graph-rest-1.0)

## IDirectoryObject, IDirectoryObjects

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## The groups and directory roles for the user

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";

const graph = graphfi(...);

const memberOf = await graph.users.getById('user@tenant.onmicrosoft.com').memberOf();

const memberOf2 = await graph.me.memberOf();

```

## Return all the groups the user, group or directoryObject is a member of. Add true parameter to return only security enabled groups

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/groups";

const graph = graphfi(...);

const memberGroups = await graph.users.getById('user@tenant.onmicrosoft.com').getMemberGroups();

const memberGroups2 = await graph.me.getMemberGroups();

// Returns only security enabled groups
const memberGroups3 = await graph.me.getMemberGroups(true);

const memberGroups4 = await graph.groups.getById('user@tenant.onmicrosoft.com').getMemberGroups();

```

## Returns all the groups, administrative units and directory roles that a user, group, or directory object is a member of. Add true parameter to return only security enabled groups

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/groups";

const graph = graphfi(...);

const memberObjects = await graph.users.getById('user@tenant.onmicrosoft.com').getMemberObjects();

const memberObjects2 = await graph.me.getMemberObjects();

// Returns only security enabled groups
const memberObjects3 = await graph.me.getMemberObjects(true);

const memberObjects4 = await graph.groups.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').getMemberObjects();
```

## Check for membership in a specified list of groups

And returns from that list those groups of which the specified user, group, or directory object is a member

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/groups";

const graph = graphfi(...);

const checkedMembers = await graph.users.getById('user@tenant.onmicrosoft.com').checkMemberGroups(["c2fb52d1-5c60-42b1-8c7e-26ce8dc1e741","2001bb09-1d46-40a6-8176-7bb867fb75aa"]);

const checkedMembers2 = await graph.me.checkMemberGroups(["c2fb52d1-5c60-42b1-8c7e-26ce8dc1e741","2001bb09-1d46-40a6-8176-7bb867fb75aa"]);

const checkedMembers3 = await graph.groups.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').checkMemberGroups(["c2fb52d1-5c60-42b1-8c7e-26ce8dc1e741","2001bb09-1d46-40a6-8176-7bb867fb75aa"]);
```

## Get directoryObject by Id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/directory-objects";

const graph = graphfi(...);

const dirObject = await graph.directoryObjects.getById('99dc1039-eb80-43b1-a09e-250d50a80b26');

```

## Delete directoryObject

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/directory-objects";

const graph = graphfi(...);

const deleted = await graph.directoryObjects.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').delete()

```
