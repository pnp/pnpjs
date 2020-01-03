# @pnp/graph/directoryObjects


## The groups and directory roles for the user
```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users"

const memberOf = await graph.users.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').memberOf();

const memberOf2 = await graph.me.memberOf();

```

## Return all the groups the user, group or directoryObject is a member of
```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users"
import "@pnp/graph/groups"

const memberGroups = await graph.users.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').getMemberGroups();

const memberGroups2 = await graph.me.getMemberGroups();

const memberGroups3 = await graph.groups.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').getMemberGroups();


```
## Returns all the groups, administrative units and directory roles that a user, group, or directory object is a member of.
```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users"
import "@pnp/graph/groups"

const memberObjects = await graph.users.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').getMemberObjects();

const memberObjects2 = await graph.me.getMemberObjects();

const memberObjects3 = await graph.groups.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').getMemberObjects();
```
## Check for membership in a specified list of groups
And returns from that list those groups of which the specified user, group, or directory object is a member
```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users"
import "@pnp/graph/groups"

const checkedMembers = await graph.users.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').checkMemberGroups(["c2fb52d1-5c60-42b1-8c7e-26ce8dc1e741","2001bb09-1d46-40a6-8176-7bb867fb75aa"]);

const checkedMembers2 = await graph.me.checkMemberGroups(["c2fb52d1-5c60-42b1-8c7e-26ce8dc1e741","2001bb09-1d46-40a6-8176-7bb867fb75aa"]);

const checkedMembers3 = await graph.groups.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').checkMemberGroups(["c2fb52d1-5c60-42b1-8c7e-26ce8dc1e741","2001bb09-1d46-40a6-8176-7bb867fb75aa"]);
```

## Get directoryObject by Id
```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/directory-objects"

const dirObject = await graph.directoryObjects.getById('99dc1039-eb80-43b1-a09e-250d50a80b26');

```


## Delete directoryObject
```TypeScript
import { graph } from "@pnp/graph";

const deleted = await graph.directoryObjects.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').delete()

```
