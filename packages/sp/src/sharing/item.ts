import { _Item } from "../items/types";
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
 * Extend _Web
 */
declare module "../items/types" {
    interface _Item extends ISharedFuncs {
        shareWith(loginNames: string | string[], role?: SharingRole, requireSignin?: boolean, emailData?: ISharingEmailData): Promise<ISharingResult>;
    }
    interface IItem extends ISharedFuncs {
        shareWith(loginNames: string | string[], role?: SharingRole, requireSignin?: boolean, emailData?: ISharingEmailData): Promise<ISharingResult>;
    }
}

/**
 * Gets a link suitable for sharing for this item
 *
 * @param kind The type of link to share
 * @param expiration The optional expiration date
 */
_Item.prototype.getShareLink = getShareLink;

/**
 * Shares this item with one or more users
 *
 * @param loginNames string or string[] of resolved login names to which this item will be shared
 * @param role The role (View | Edit) applied to the share
 * @param emailData Optional, if inlucded an email will be sent. Note subject currently has no effect.
 */
_Item.prototype.shareWith = function (
    this: _Item,
    loginNames: string | string[],
    role: SharingRole = SharingRole.View,
    requireSignin = false,
    emailData?: ISharingEmailData): Promise<ISharingResult> {

    return shareWith(this, loginNames, role, requireSignin, false, emailData);
};

/**
 * Checks Permissions on the list of Users and returns back role the users have on the Item.
 *
 * @param recipients The array of Entities for which Permissions need to be checked.
 */
_Item.prototype.checkSharingPermissions = checkPermissions;

/**
 * Get Sharing Information.
 *
 * @param request The SharingInformationRequest Object.
 * @param expands Expand more fields.
 * 
 */
_Item.prototype.getSharingInformation = getSharingInformation;

/**
 * Gets the sharing settings of an item.
 *
 * @param useSimplifiedRoles Determines whether to use simplified roles.
 */
_Item.prototype.getObjectSharingSettings = getObjectSharingSettings;

/**
 * Unshare this item
 */
_Item.prototype.unshare = unshareObject;

/**
 * Deletes a sharing link by kind
 *
 * @param kind Deletes a sharing link by the kind of link
 */
_Item.prototype.deleteSharingLinkByKind = deleteLinkByKind;

/**
 * Removes the specified link to the item.
 *
 * @param kind The kind of link to be deleted.
 * @param shareId
 */
_Item.prototype.unshareLink = unshareLink;
