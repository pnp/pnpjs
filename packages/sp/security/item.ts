import { addProp } from "@pnp/queryable";
import { _Item } from "../items/types.js";
import { RoleAssignments, ISecurableMethods } from "./types.js";
import { SPInstance } from "../spqueryable.js";
import {
    getUserEffectivePermissions,
    getCurrentUserEffectivePermissions,
    breakRoleInheritance,
    resetRoleInheritance,
    userHasPermissions,
    currentUserHasPermissions,
    hasPermissions,
} from "./funcs.js";

declare module "../items/types" {
    interface _Item extends ISecurableMethods {}
    interface IItem extends ISecurableMethods {}
}

addProp(_Item, "roleAssignments", RoleAssignments);
addProp(_Item, "firstUniqueAncestorSecurableObject", SPInstance);

_Item.prototype.getUserEffectivePermissions = getUserEffectivePermissions;
_Item.prototype.getCurrentUserEffectivePermissions = getCurrentUserEffectivePermissions;
_Item.prototype.breakRoleInheritance = breakRoleInheritance;
_Item.prototype.resetRoleInheritance = resetRoleInheritance;
_Item.prototype.userHasPermissions = userHasPermissions;
_Item.prototype.currentUserHasPermissions = currentUserHasPermissions;
_Item.prototype.hasPermissions = hasPermissions;
