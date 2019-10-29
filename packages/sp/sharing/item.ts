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

declare module "../items/types" {
    interface _Item extends ISharedFuncs {
        shareWith(loginNames: string | string[], role?: SharingRole, requireSignin?: boolean, emailData?: ISharingEmailData): Promise<ISharingResult>;
    }
    interface IItem extends ISharedFuncs {
        /**
         * Shares this item with one or more users
         *
         * @param loginNames string or string[] of resolved login names to which this item will be shared
         * @param role The role (View | Edit) applied to the share
         * @param emailData Optional, if inlucded an email will be sent. Note subject currently has no effect.
         */
        shareWith(loginNames: string | string[], role?: SharingRole, requireSignin?: boolean, emailData?: ISharingEmailData): Promise<ISharingResult>;
    }
}


_Item.prototype.shareWith = function (
    this: _Item,
    loginNames: string | string[],
    role: SharingRole = SharingRole.View,
    requireSignin = false,
    emailData?: ISharingEmailData): Promise<ISharingResult> {

    return shareWith(this, loginNames, role, requireSignin, false, emailData);
};

_Item.prototype.getShareLink = getShareLink;
_Item.prototype.checkSharingPermissions = checkPermissions;
_Item.prototype.getSharingInformation = getSharingInformation;
_Item.prototype.getObjectSharingSettings = getObjectSharingSettings;
_Item.prototype.unshare = unshareObject;
_Item.prototype.deleteSharingLinkByKind = deleteLinkByKind;
_Item.prototype.unshareLink = unshareLink;
