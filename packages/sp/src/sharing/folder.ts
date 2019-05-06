import {
    _Folder,
} from "../folders/types";
import {
    ISharingEmailData,
    ISharingResult,
    SharingRole,
    ISharedFuncs,
} from "./types";
import {
    shareWith,
    getShareLink,
    checkPermissions,
    getSharingInformation,
    getObjectSharingSettings,
    unshareObject,
    deleteLinkByKind,
    unshareLink,
} from "./funcs";

/**
* Extend Folder
*/
declare module "../folders/types" {
    interface _Folder extends ISharedFuncs {
        shareWith(loginNames: string | string[], role?: SharingRole, requireSignin?: boolean, shareEverything?: boolean, emailData?: ISharingEmailData): Promise<ISharingResult>;
    }
    interface IFolder extends ISharedFuncs {
        shareWith(loginNames: string | string[], role?: SharingRole, requireSignin?: boolean, shareEverything?: boolean, emailData?: ISharingEmailData): Promise<ISharingResult>;
    }
}

/**
 * Shares this item with one or more users
 *
 * @param loginNames string or string[] of resolved login names to which this item will be shared
 * @param role The role (View | Edit) applied to the share
 * @param shareEverything Share everything in this folder, even items with unique permissions.
 * @param requireSignin If true the user must signin to view link, otherwise anyone with the link can access the resource
 * @param emailData Optional, if inlucded an email will be sent. Note subject currently has no effect.
 */
_Folder.prototype.shareWith = async function (
    loginNames: string | string[],
    role: SharingRole = SharingRole.View,
    requireSignin = false,
    shareEverything = false,
    emailData?: ISharingEmailData): Promise<ISharingResult> {

    return shareWith(this, loginNames, role, requireSignin, shareEverything, emailData);
};

/**
 * Gets a link suitable for sharing for this item
 *
 * @param kind The type of link to share
 * @param expiration The optional expiration date
 */
_Folder.prototype.getShareLink = getShareLink;

/**
 * Checks Permissions on the list of Users and returns back role the users have on the Item.
 *
 * @param recipients The array of Entities for which Permissions need to be checked.
 */
_Folder.prototype.checkSharingPermissions = checkPermissions;

/**
 * Get Sharing Information.
 *
 * @param request The SharingInformationRequest Object.
 * @param expands Expand more fields.
 * 
 */
_Folder.prototype.getSharingInformation = getSharingInformation;

/**
 * Gets the sharing settings of an item.
 *
 * @param useSimplifiedRoles Determines whether to use simplified roles.
 */
_Folder.prototype.getObjectSharingSettings = getObjectSharingSettings;

/**
 * Unshare this item
 */
_Folder.prototype.unshare = unshareObject;

/**
 * Deletes a sharing link by kind
 *
 * @param kind Deletes a sharing link by the kind of link
 */
_Folder.prototype.deleteSharingLinkByKind = deleteLinkByKind;

/**
 * Removes the specified link to the item.
 *
 * @param kind The kind of link to be deleted.
 * @param shareId
 */
_Folder.prototype.unshareLink = unshareLink;
