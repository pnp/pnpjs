# @pnp/sp/security

There are four levels where you can break inheritance and assign security: Site, Web, List, Item. All four of these objects share a common set of methods. Because of this we are showing in the examples below usage of these methods for an IList instance, but they apply across all four securable objects. In addition to the shared methods, some types have unique methods which are listed below.

### A Note on Selective Imports for Security

Because the method are shared you can opt to import only the methods for one of the instances. 

```TypeScript
import "@pnp/sp/src/security/web";
import "@pnp/sp/src/security/list";
import "@pnp/sp/src/security/item";
```

Possibly useful if you are trying to hyper-optimize for bundle size but it is just as easy to import the whole module:

```TypeScript
import "@pnp/sp/src/security";
```

## Securable Methods

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/lists";
import "@pnp/sp/src/security/list";
import "@pnp/sp/src/site-users/web";
import { IList } from "@pnp/sp/src/lists";
import { PermissionKind } from "@pnp/sp/src/security";

// ensure we have a list
const ler = await sp.web.lists.ensure("SecurityTestingList");
const list: IList = ler.list;

// role assignments
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
```


