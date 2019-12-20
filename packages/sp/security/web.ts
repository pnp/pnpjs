import { addProp } from "@pnp/odata";
import { _Web } from "../webs/types";
import { RoleDefinitions, IRoleDefinitions, RoleAssignments, ISecurableMethods } from "./types";
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

declare module "../webs/types" {
    interface _Web extends ISecurableMethods {
        roleDefinitions: IRoleDefinitions;
    }
    interface IWeb extends ISecurableMethods {
        roleDefinitions: IRoleDefinitions;
    }
}

addProp(_Web, "roleDefinitions", RoleDefinitions);
addProp(_Web, "roleAssignments", RoleAssignments);
addProp(_Web, "firstUniqueAncestorSecurableObject", SharePointQueryableInstance);

_Web.prototype.getUserEffectivePermissions = getUserEffectivePermissions;
_Web.prototype.getCurrentUserEffectivePermissions = getCurrentUserEffectivePermissions;
_Web.prototype.breakRoleInheritance = breakRoleInheritance;
_Web.prototype.resetRoleInheritance = resetRoleInheritance;
_Web.prototype.userHasPermissions = userHasPermissions;
_Web.prototype.currentUserHasPermissions = currentUserHasPermissions;
_Web.prototype.hasPermissions = hasPermissions;
