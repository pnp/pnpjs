import { SecurableQueryable, IBasePermissions, PermissionKind } from "./types";
import { _SharePointQueryableInstance, _SharePointQueryable, SharePointQueryableInstance, SharePointQueryable } from "../sharepointqueryable";
import { hOP } from "@pnp/common";
import { spPost } from "../operations";

/**
* Gets the effective permissions for the user supplied
*
* @param loginName The claims username for the user (ex: i:0#.f|membership|user@domain.com)
*/
export async function getUserEffectivePermissions(this: SecurableQueryable, loginName: string): Promise<IBasePermissions> {

    const q = this.clone(SharePointQueryableInstance, "getUserEffectivePermissions(@user)");
    q.query.set("@user", `'${encodeURIComponent(loginName)}'`);
    const r = await q.get<any>();
    // handle verbose mode
    return hOP(r, "GetUserEffectivePermissions") ? r.GetUserEffectivePermissions : r;
}

/**
 * Gets the effective permissions for the current user
 */
export async function getCurrentUserEffectivePermissions(this: SecurableQueryable): Promise<IBasePermissions> {

    const q = this.clone(SharePointQueryable, "EffectiveBasePermissions");
    return q.get<any>().then(r => {
        // handle verbose mode
        return hOP(r, "EffectiveBasePermissions") ? r.EffectiveBasePermissions : r;
    });
}

/**
 * Breaks the security inheritance at this level optinally copying permissions and clearing subscopes
 *
 * @param copyRoleAssignments If true the permissions are copied from the current parent scope
 * @param clearSubscopes Optional. true to make all child securable objects inherit role assignments from the current object
 */
export async function breakRoleInheritance(this: SecurableQueryable, copyRoleAssignments = false, clearSubscopes = false): Promise<void> {
    await spPost(this.clone(SharePointQueryable, `breakroleinheritance(copyroleassignments=${copyRoleAssignments}, clearsubscopes=${clearSubscopes})`));
}

/**
 * Removes the local role assignments so that it re-inherit role assignments from the parent object.
 *
 */
export async function resetRoleInheritance(this: SecurableQueryable): Promise<void> {
    await spPost(this.clone(SharePointQueryable, "resetroleinheritance"));
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
/* tslint:disable:no-bitwise */
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
/* tslint:enable */
