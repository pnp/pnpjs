# @pnp/graph/directoryObjects


## The groups and directory roles for the user
```TypeScript
import { graph } from "@pnp/graph";

const memberOf = await graph.users.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').memberOf.get();

const memberOf = await graph.me.memberOf.get();

```

## Return all the groups the user, group or directoryObject is a member of
```TypeScript
import { graph } from "@pnp/graph";

const memberGroups = await graph.users.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').getMemberGroups();

const memberGroups = await graph.me.getMemberGroups();

const memberGroups = await graph.groups.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').getMemberGroups();

const memberGroups = await graph.directoryObjects.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').getMemberGroups();


```
## Returns all the groups, administrative units and directory roles that a user, group, or directory object is a member of.
```TypeScript
import { graph } from "@pnp/graph";

const memberObjects = await graph.users.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').getMemberObjects();

const memberObjects = await graph.me.getMemberObjects();

const memberObjects = await graph.groups.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').getMemberObjects();

const memberObjects = await graph.directoryObjects.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').getMemberObjects();


```
## Check for membership in a specified list of groups
And returns from that list those groups of which the specified user, group, or directory object is a member
```TypeScript
import { graph } from "@pnp/graph";

const checkedMembers = await graph.users.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').checkMemberGroups(["c2fb52d1-5c60-42b1-8c7e-26ce8dc1e741","2001bb09-1d46-40a6-8176-7bb867fb75aa"]);

const checkedMembers = await graph.me.checkMemberGroups(["c2fb52d1-5c60-42b1-8c7e-26ce8dc1e741","2001bb09-1d46-40a6-8176-7bb867fb75aa"]);

const checkedMembers = await graph.groups.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').checkMemberGroups(["c2fb52d1-5c60-42b1-8c7e-26ce8dc1e741","2001bb09-1d46-40a6-8176-7bb867fb75aa"]);

const checkedMembers = await graph.directoryObjects.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').checkMemberGroups(["c2fb52d1-5c60-42b1-8c7e-26ce8dc1e741","2001bb09-1d46-40a6-8176-7bb867fb75aa"]);
```

## Get directoryObject by Id
```TypeScript
import { graph } from "@pnp/graph";

const dirObject = await graph.directoryObjects.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').get();

```


## Delete directoryObject
```TypeScript
import { graph } from "@pnp/graph";

const deleted = await graph.directoryObjects.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').delete()

```