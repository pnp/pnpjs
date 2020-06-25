# @pnp/sp - permissions

A common task is to determine if a user or the current user has a certain permission level. It is a great idea to check before performing a task such as creating a list to ensure a user can without getting back an error. This allows you to provide a better experience to the user.

Permissions in SharePoint are assigned to the set of securable objects which include Site, Web, List, and List Item. These are the four level to which unique permissions can be assigned. As such @pnp/sp provides a set of methods defined in the QueryableSecurable class to handle these permissions. These examples all use the Web to get the values, however the methods work identically on all securables.

## Get Role Assignments

This gets a collection of all the role assignments on a given securable. The property returns a RoleAssignments collection which supports the OData collection operators.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/security";
import { Logger } from "@pnp/logging";

const roles = await sp.web.roleAssignments.get();
Logger.writeJSON(roles);
```

## First Unique Ancestor Securable Object

This method can be used to find the securable parent up the hierarchy that has unique permissions. If everything inherits permissions this will be the Site. If a sub web has unique permissions it will be the web, and so on.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/security";
import { Logger } from "@pnp/logging";

const obj = await sp.web.firstUniqueAncestorSecurableObject.get();
Logger.writeJSON(obj);
```

## User Effective Permissions

This method returns the BasePermissions for a given user or the current user. This value contains the High and Low values for a user on the securable you have queried.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/security";
import { Logger } from "@pnp/logging";

const perms = await sp.web.getUserEffectivePermissions("i:0#.f|membership|user@site.com");
Logger.writeJSON(perms);

const perms2 = await sp.web.getCurrentUserEffectivePermissions();
Logger.writeJSON(perms2);
```

## User Has Permissions

Because the High and Low values in the BasePermission don't obviously mean anything you can use these methods along with the PermissionKind enumeration to check actual rights on the securable.

```TypeScript
import { sp } from "@pnp/sp";
import { PermissionKind } from "@pnp/sp/security";

const perms = await sp.web.userHasPermissions("i:0#.f|membership|user@site.com", PermissionKind.ApproveItems);
console.log(perms);

const perms2 = await sp.web.currentUserHasPermissions(PermissionKind.ApproveItems);
console.log(perms2);
```

## Has Permissions

If you need to check multiple permissions it can be more efficient to get the BasePermissions once and then use the hasPermissions method to check them as shown below.

```TypeScript
import { sp } from "@pnp/sp";
import { PermissionKind } from "@pnp/sp/security";

const perms = await sp.web.getCurrentUserEffectivePermissions();
if (sp.web.hasPermissions(perms, PermissionKind.AddListItems) && sp.web.hasPermissions(perms, PermissionKind.DeleteVersions)) {
    // ...
}
```
