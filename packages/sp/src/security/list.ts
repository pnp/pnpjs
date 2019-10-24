import { addProp } from "@pnp/odata";
import { _List } from "../lists/types";
import { RoleAssignments, ISecurableMethods } from "./types";
import { SharePointQueryableInstance } from "../sharepointqueryable";
import {
    getUserEffectivePermissions,
    getCurrentUserEffectivePermissions,
    breakRoleInheritance,
    resetRoleInheritance,
    userHasPermissions,
    currentUserHasPermissions,
    hasPermissions,
} from "./funcs";

declare module "../lists/types" {
    interface _List extends ISecurableMethods { }
    interface IList extends ISecurableMethods { }
}

addProp(_List, "roleAssignments", RoleAssignments);
addProp(_List, "firstUniqueAncestorSecurableObject", SharePointQueryableInstance);

_List.prototype.getUserEffectivePermissions = getUserEffectivePermissions;
_List.prototype.getCurrentUserEffectivePermissions = getCurrentUserEffectivePermissions;
_List.prototype.breakRoleInheritance = breakRoleInheritance;
_List.prototype.resetRoleInheritance = resetRoleInheritance;
_List.prototype.userHasPermissions = userHasPermissions;
_List.prototype.currentUserHasPermissions = currentUserHasPermissions;
_List.prototype.hasPermissions = hasPermissions;
