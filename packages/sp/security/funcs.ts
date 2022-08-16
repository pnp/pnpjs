import { SecurableQueryable, IBasePermissions, PermissionKind } from "./types.js";
import { SPInstance, SPQueryable } from "../spqueryable.js";
import { spPost } from "../operations.js";

/**
* Gets the effective permissions for the user supplied
*
* @param loginName The claims username for the user (ex: i:0#.f|membership|user@domain.com)
*/
export async function getUserEffectivePermissions(this: SecurableQueryable, loginName: string): Promise<IBasePermissions> {

    const q = SPInstance(this, "getUserEffectivePermissions(@user)");
    q.query.set("@user", `'${loginName}'`);
    return q();
}

/**
 * Gets the effective permissions for the current user
 */
export async function getCurrentUserEffectivePermissions(this: SecurableQueryable): Promise<IBasePermissions> {

    return SPQueryable(this, "EffectiveBasePermissions")();
}

/**
 * Breaks the security inheritance at this level optinally copying permissions and clearing subscopes
 *
 * @param copyRoleAssignments If true the permissions are copied from the current parent scope
 * @param clearSubscopes Optional. true to make all child securable objects inherit role assignments from the current object
 */
export async function breakRoleInheritance(this: SecurableQueryable, copyRoleAssignments = false, clearSubscopes = false): Promise<void> {
    await spPost(SPQueryable(this, `breakroleinheritance(copyroleassignments=${copyRoleAssignments}, clearsubscopes=${clearSubscopes})`));
}

/**
 * Removes the local role assignments so that it re-inherit role assignments from the parent object.
 *
 */
export async function resetRoleInheritance(this: SecurableQueryable): Promise<void> {
    await spPost(SPQueryable(this, "resetroleinheritance"));
}

/**
 * Determines if a given user has the appropriate permissions
 *
 * @param loginName The user to check
 * @param permission The permission being checked
 */
export async function userHasPermissions(this: SecurableQueryable, loginName: string, permission: PermissionKind): Promise<boolean> {

    const perms = await getUserEffectivePermissions.call(this, loginName);
    return this.hasPermissions(perms, permission);
}

/**
 * Determines if the current user has the requested permissions
 *
 * @param permission The permission we wish to check
 */
export async function currentUserHasPermissions(this: SecurableQueryable, permission: PermissionKind): Promise<boolean> {

    const perms = await getCurrentUserEffectivePermissions.call(this);
    return this.hasPermissions(perms, permission);
}

/**
 * Taken from sp.js, checks the supplied permissions against the mask
 *
 * @param value The security principal's permissions on the given object
 * @param perm The permission checked against the value
 */
/* eslint-disable no-bitwise */
export function hasPermissions(value: IBasePermissions, perm: PermissionKind): boolean {

    if (!perm) {
        return true;
    }
    if (perm === PermissionKind.FullMask) {
        return (value.High & 32767) === 32767 && value.Low === 65535;
    }

    perm = perm - 1;
    let num = 1;

    if (perm >= 0 && perm < 32) {
        num = num << perm;
        return 0 !== (value.Low & num);
    } else if (perm >= 32 && perm < 64) {
        num = num << perm - 32;
        return 0 !== (value.High & num);
    }
    return false;
}
/* eslint-enable no-bitwise */
