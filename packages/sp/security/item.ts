import { addProp } from "@pnp/odata";
import { _Item } from "../items/types";
import { RoleAssignments, ISecurableMethods } from "./types";
import { _SharePointQueryableInstance, SharePointQueryableInstance } from "../sharepointqueryable";
import {
    getUserEffectivePermissions,
    getCurrentUserEffectivePermissions,
    breakRoleInheritance,
    resetRoleInheritance,
    userHasPermissions,
    currentUserHasPermissions,
    hasPermissions,
} from "./funcs";

declare module "../items/types" {
    interface _Item extends ISecurableMethods { }
    interface IItem extends ISecurableMethods { }
}

addProp(_Item, "roleAssignments", RoleAssignments);
addProp(_Item, "firstUniqueAncestorSecurableObject", SharePointQueryableInstance);

_Item.prototype.getUserEffectivePermissions = getUserEffectivePermissions;
_Item.prototype.getCurrentUserEffectivePermissions = getCurrentUserEffectivePermissions;
_Item.prototype.breakRoleInheritance = breakRoleInheritance;
_Item.prototype.resetRoleInheritance = resetRoleInheritance;
_Item.prototype.userHasPermissions = userHasPermissions;
_Item.prototype.currentUserHasPermissions = currentUserHasPermissions;
_Item.prototype.hasPermissions = hasPermissions;
