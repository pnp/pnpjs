import { _File } from "../files/types";
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

declare module "../files/types" {
    interface _File extends ISharedFuncs {
        shareWith(loginNames: string | string[], role?: SharingRole, requireSignin?: boolean, emailData?: ISharingEmailData): Promise<ISharingResult>;
    }
    interface IFile extends ISharedFuncs {
        /**
         * Shares this item with one or more users
         *
         * @param loginNames string or string[] of resolved login names to which this item will be shared
         * @param role The role (View | Edit) applied to the share
         * @param shareEverything Share everything in this folder, even items with unique permissions.
         * @param requireSignin If true the user must signin to view link, otherwise anyone with the link can access the resource
         * @param emailData Optional, if inlucded an email will be sent. Note subject currently has no effect.
         */
        shareWith(loginNames: string | string[], role?: SharingRole, requireSignin?: boolean, emailData?: ISharingEmailData): Promise<ISharingResult>;
    }
}

_File.prototype.shareWith = function (
    this: _File,
    loginNames: string | string[],
    role: SharingRole = SharingRole.View,
    requireSignin = false,
    emailData?: ISharingEmailData): Promise<ISharingResult> {

    return shareWith(this, loginNames, role, requireSignin, false, emailData);
};

_File.prototype.getShareLink = getShareLink;
_File.prototype.checkSharingPermissions = checkPermissions;
_File.prototype.getSharingInformation = getSharingInformation;
_File.prototype.getObjectSharingSettings = getObjectSharingSettings;
_File.prototype.unshare = unshareObject;
_File.prototype.deleteSharingLinkByKind = deleteLinkByKind;
_File.prototype.unshareLink = unshareLink;
