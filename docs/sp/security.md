# @pnp/sp/security

There are four levels where you can break inheritance and assign security: Site, Web, List, Item. All four of these objects share a common set of methods. Because of this we are showing in the examples below usage of these methods for an IList instance, but they apply across all four securable objects. In addition to the shared methods, some types have unique methods which are listed below.

> Site permissions are managed on the root web of the site collection.

## A Note on Selective Imports for Security

Because the method are shared you can opt to import only the methods for one of the instances.

```TypeScript
import "@pnp/sp/security/web";
import "@pnp/sp/security/list";
import "@pnp/sp/security/item";
```

Possibly useful if you are trying to hyper-optimize for bundle size but it is just as easy to import the whole module:

```TypeScript
import "@pnp/sp/security";
```

## Securable Methods

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/security/list";
import "@pnp/sp/site-users/web";
import { IList } from "@pnp/sp/lists";
import { PermissionKind } from "@pnp/sp/security";

const sp = spfi(...);

// ensure we have a list
const ler = await sp.web.lists.ensure("SecurityTestingList");
const list: IList = ler.list;

// role assignments (see section below)
await list.roleAssignments();

// data will represent one of the possible parents Site, Web, or List
const data = await list.firstUniqueAncestorSecurableObject();

// getUserEffectivePermissions
const users = await sp.web.siteUsers.top(1).select("LoginName")();
const perms = await list.getUserEffectivePermissions(users[0].LoginName);

// getCurrentUserEffectivePermissions
const perms2 = list.getCurrentUserEffectivePermissions();

// userHasPermissions
const v: boolean = list.userHasPermissions(users[0].LoginName, PermissionKind.AddListItems)

// currentUserHasPermissions
const v2: boolean = list.currentUserHasPermissions(PermissionKind.AddListItems)

// breakRoleInheritance
await list.breakRoleInheritance();
// copy existing permissions
await list.breakRoleInheritance(true);
// copy existing permissions and reset all child securables to the new permissions
await list.breakRoleInheritance(true, true);

// resetRoleInheritance
await list.resetRoleInheritance();
```

## Web Specific methods

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/security/web";

const sp = spfi(...);

// role definitions (see section below)
const defs = await sp.web.roleDefinitions();
```

## Role Assignments

Allows you to list and manipulate the set of role assignments for the given securable. Again we show usage using list, but the examples apply to web and item as well.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/security/web";
import "@pnp/sp/site-users/web";
import { IList } from "@pnp/sp/lists";
import { PermissionKind } from "@pnp/sp/security";

const sp = spfi(...);

// ensure we have a list
const ler = await sp.web.lists.ensure("SecurityTestingList");
const list: IList = ler.list;

// list role assignments
const assignments = await list.roleAssignments();

// add a role assignment
const defs = await sp.web.roleDefinitions();
const user = await sp.web.currentUser();
const r = await list.roleAssignments.add(user.Id, defs[0].Id);

// remove a role assignment
const { Id: fullRoleDefId } = await list.roleDefinitions.getByName('Full Control')();
const ras = await list.roleAssignments();
// filter/find the role assignment you want to remove
// here we just grab the first
const ra = ras.find(v => true);
const r = await list.roleAssignments.remove(ra.PrincipalId, fullRoleDefId);

// read role assignment info
const info = await list.roleAssignments.getById(ra.Id)();

// get the groups
const info2 = await list.roleAssignments.getById(ra.Id).groups();

// get the bindings
const info3 = await list.roleAssignments.getById(ra.Id).bindings();

// delete a role assignment (same as remove)
const ras = await list.roleAssignments();
// filter/find the role assignment you want to remove
// here we just grab the first
const ra = ras.find(v => true);

// delete it
await list.roleAssignments.getById(ra.Id).delete();
```

## Role Definitions

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/security/web";

const sp = spfi(...);

// read role definitions
const defs = await sp.web.roleDefinitions();

// get by id
const def = await sp.web.roleDefinitions.getById(5)();
const def = await sp.web.roleDefinitions.getById(5).select("Name", "Order")();

// get by name
const def = await sp.web.roleDefinitions.getByName("Full Control")();
const def = await sp.web.roleDefinitions.getByName("Full Control").select("Name", "Order")();

// get by type
const def = await sp.web.roleDefinitions.getByType(5)();
const def = await sp.web.roleDefinitions.getByType(5).select("Name", "Order")();

// add
// name The new role definition's name
// description The new role definition's description
// order The order in which the role definition appears
// basePermissions The permissions mask for this role definition
const rdar = await sp.web.roleDefinitions.add("title", "description", 99, { High: 1, Low: 2 });



// the following methods work on a single role def, you can use any of the three getBy methods, here we use getById as an example

// delete
await sp.web.roleDefinitions.getById(5).delete();

// update
const res = sp.web.roleDefinitions.getById(5).update({ Name: "New Name" });
```

## Get List Items with Unique Permissions

In order to get a list of items that have unique permissions you have to specifically select the '' field and then filter on the client.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/security/items";

const sp = spfi(...);

const listItems = await sp.web.lists.getByTitle("pnplist").items.select("Id, HasUniqueRoleAssignments")();

//Loop over list items filtering for HasUniqueRoleAssignments value

```
