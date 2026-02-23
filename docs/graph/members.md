# @pnp/graph/members

Members are collections of users and other principals. Other API objects have membership so all membership functionality is encapsulated in one import.

## IMember, IMembers

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## List Group Members/Owners

Get the members and/or owners of a group.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/members";

const graph = graphfi(...);
const members = await graph.groups.getById({groupId}).members();
const owners = await graph.groups.getById({groupId}).owners();
```

## Add Member/Owner

Add a member/owner to an group

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/members";

const graph = graphfi(...);
const members = await graph.groups.getById({groupId}).members.add({directoryObjectId}).
const owners = await graph.groups.getById({groupId}).owners.add({directoryObjectId});
```

## Remove Member/Owner

Remove a member/owner to an group

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/members";

const graph = graphfi(...);
const members = await graph.groups.getById({groupId}).members.getById({directoryObjectId}).remove().
const owners = await graph.groups.getById({groupId}).owners.getById({directoryObjectId}).remove();
```

