import { body } from "@pnp/queryable";
import { graphPost } from "../graphqueryable.js";
import { _DriveItem, DriveItem } from "../files/types.js";
import { SharingLink as ISharingLinkType } from "@microsoft/microsoft-graph-types";

declare module "../files/types" {
    interface _DriveItem {
        createSharingLink(sharingLinkInfo: ICreateShareLinkInfo): Promise<ISharingLinkType>;
    }
    interface IDriveItem {
        createSharingLink(sharingLinkInfo: ICreateShareLinkInfo): Promise<ISharingLinkType>;
    }
}

/**
 * Method for creating a sharing link for the drive item.
 * @param sharingLinkInfo - ISharingLinkInfo
 * @returns Microsoft Graph - SharingLink
 */
_DriveItem.prototype.createSharingLink = async function createSharingLink(sharingLinkInfo: ICreateShareLinkInfo): Promise<ISharingLinkType> {
    return graphPost(DriveItem(this, "createLink"), body(sharingLinkInfo));
};

/**
 * ISharingLinkInfo - for creating a sharing link
 * @param type - "view" | "edit" | "embed" - The type of sharing link to create.
 * @param scope - "anonymous" | "organization" | "users" - The scope of link to create.
 * @param expirationDateTime - string - (Optional) A String with format of yyyy-MM-ddTHH:mm:ssZ of DateTime indicates the expiration time of the permission.
 * @param password - string (Optional) - password for the link
 * @param retainInheritedPermissions - boolean (Optional) - If true (default), any existing inherited permissions are retained on the shared
 * item when sharing this item for the first time. If false, all existing permissions are removed when sharing for the first time.
 */
export interface ICreateShareLinkInfo {
    type: "view" | "edit" | "embed";
    scope: "anonymous" | "organization" | "users";
    expirationDateTime?: string;
    password?: string;
    retainInheritedPermissions?: boolean;
}
