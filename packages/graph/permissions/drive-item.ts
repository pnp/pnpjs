import { addProp, body } from "@pnp/queryable";
import { graphPost } from "../graphqueryable.js";
import { _DriveItem, DriveItem } from "../files/types.js";
import { IPermissions, Permissions } from "./types.js";
import { Permission as IPermissionType, DriveRecipient as IDriveRecipientType } from "@microsoft/microsoft-graph-types";

declare module "../files/types" {
    interface _DriveItem {
        readonly permissions: IPermissions;
        addPermissions(permissionsInviteInfo: IPermissionsInviteInfo): Promise<IPermissionType[]>;
    }
    interface IDriveItem {
        readonly permissions: IPermissions;
        addPermissions(permissionsInviteInfo: IPermissionsInviteInfo): Promise<IPermissionType[]>;
    }
}

addProp(_DriveItem, "permissions", Permissions);

/**
 * Method for adding permissions to the drive item.
 * @param permissionsInviteInfo: IPermissionsInviteInfo
 * @returns Microsoft Graph - Permission[]
 */
_DriveItem.prototype.addPermissions = async function addPermissions(permissionsInviteInfo: IPermissionsInviteInfo): Promise<IPermissionType[]> {
    return graphPost(DriveItem(this, "invite"), body(permissionsInviteInfo));
};

/*
* IPermissionsInviteInfo - for adding permissions to a drive item
* @param recipients - IDriveRecipientType[] - A collection of recipients who will receive access and the sharing invitation.
* @param message - string - A plain text formatted message that is included in the sharing invitation. Maximum length 2000 characters.
* @param requireSignIn - boolean - Specifies whether the recipient of the invitation is required to sign-in to view the shared item.
* @param sendInvitation - boolean - If true, a sharing link is sent to the recipient. Otherwise, a permission is granted directly without sending a notification.
* @param roles - "read" | "write" | "owner"[] - Specifies the roles that are to be granted to the recipients of the sharing invitation.
* @param expirationDateTime - string - (Optional) A String with format of yyyy-MM-ddTHH:mm:ssZ of DateTime indicates the expiration time of the permission.
* For OneDrive for Business and SharePoint, expirationDateTime is only applicable for sharingLink permissions. Available on OneDrive for Business, SharePoint,
* and premium personal OneDrive accounts.
* @param password - string (Optional) - The password set on the invite by the creator. Optional and OneDrive Personal only.
* @param retainInheritedPermissions - boolean (Optional) - If true (default), any existing inherited permissions are retained on the shared item when sharing
* this item for the first time. If false, all existing permissions are removed when sharing for the first time.
}
*/
export interface IPermissionsInviteInfo {
    recipients: IDriveRecipientType[];
    requireSignIn: boolean;
    sendInvitation: boolean;
    roles: ["read" | "write" | "owner"];
    expirationDateTime?: string;
    password?: string;
    retainInheritedPermissions?: boolean;
}
