import { Web } from "./webs";
import { RoleAssignments } from "./roles";
import { BasePermissions, PermissionKind } from "./types";
import { SharePointQueryable, SharePointQueryableInstance } from "./sharepointqueryable";

export class SharePointQueryableSecurable extends SharePointQueryableInstance {

    /**
     * Gets the set of role assignments for this item
     *
     */
    public get roleAssignments(): RoleAssignments {
        return new RoleAssignments(this);
    }

    /**
     * Gets the closest securable up the security hierarchy whose permissions are applied to this list item
     *
     */
    public get firstUniqueAncestorSecurableObject(): SharePointQueryableInstance {
        return new SharePointQueryableInstance(this, "FirstUniqueAncestorSecurableObject");
    }

    /**
     * Gets the effective permissions for the user supplied
     *
     * @param loginName The claims username for the user (ex: i:0#.f|membership|user@domain.com)
     */
    public getUserEffectivePermissions(loginName: string): Promise<BasePermissions> {
        const q = this.clone(SharePointQueryable, "getUserEffectivePermissions(@user)");
        q.query.add("@user", `'${encodeURIComponent(loginName)}'`);
        return q.get().then(r => {
            // handle verbose mode
            return r.hasOwnProperty("GetUserEffectivePermissions") ? r.GetUserEffectivePermissions : r;
        });
    }

    /**
     * Gets the effective permissions for the current user
     */
    public getCurrentUserEffectivePermissions(): Promise<BasePermissions> {

        const w = Web.fromUrl(this.toUrl());
        return w.currentUser.select("LoginName").getAs<{ LoginName: string }>().then(user => {

            return this.getUserEffectivePermissions(user.LoginName);
        });
    }

    /**
     * Breaks the security inheritance at this level optinally copying permissions and clearing subscopes
     *
     * @param copyRoleAssignments If true the permissions are copied from the current parent scope
     * @param clearSubscopes Optional. true to make all child securable objects inherit role assignments from the current object
     */
    public breakRoleInheritance(copyRoleAssignments = false, clearSubscopes = false): Promise<any> {

        return this.clone(SharePointQueryableSecurable, `breakroleinheritance(copyroleassignments=${copyRoleAssignments}, clearsubscopes=${clearSubscopes})`).postCore();
    }

    /**
     * Removes the local role assignments so that it re-inherit role assignments from the parent object.
     *
     */
    public resetRoleInheritance(): Promise<any> {

        return this.clone(SharePointQueryableSecurable, "resetroleinheritance").postCore();
    }

    /**
     * Determines if a given user has the appropriate permissions
     *
     * @param loginName The user to check
     * @param permission The permission being checked
     */
    public userHasPermissions(loginName: string, permission: PermissionKind): Promise<boolean> {

        return this.getUserEffectivePermissions(loginName).then(perms => {

            return this.hasPermissions(perms, permission);
        });
    }

    /**
     * Determines if the current user has the requested permissions
     *
     * @param permission The permission we wish to check
     */
    public currentUserHasPermissions(permission: PermissionKind): Promise<boolean> {

        return this.getCurrentUserEffectivePermissions().then(perms => {

            return this.hasPermissions(perms, permission);
        });
    }

    /**
     * Taken from sp.js, checks the supplied permissions against the mask
     *
     * @param value The security principal's permissions on the given object
     * @param perm The permission checked against the value
     */
    /* tslint:disable:no-bitwise */
    public hasPermissions(value: BasePermissions, perm: PermissionKind): boolean {

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
}
