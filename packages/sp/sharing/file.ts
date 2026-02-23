import { IFile, _File } from "../files/types.js";
import { emptyGuid } from "../types.js";
import {
    ISharingEmailData,
    ISharingResult,
    SharingRole,
    ISharedFuncs,
    ISharingInformationRequest,
    ISharingInformation,
    SharingLinkKind,
    IShareLinkResponse,
    ISharingRecipient,
    ISharingEntityPermission,
    IObjectSharingSettings,
} from "./types.js";

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

_File.prototype.shareWith = async function (
    this: _File,
    loginNames: string | string[],
    role: SharingRole = SharingRole.View,
    requireSignin = false,
    emailData?: ISharingEmailData): Promise<ISharingResult> {

    const item = await this.getItem();
    return item.shareWith(loginNames, role, requireSignin, emailData);
};

_File.prototype.getShareLink = async function (this: IFile, kind: SharingLinkKind, expiration: Date = null): Promise<IShareLinkResponse> {
    const item = await this.getItem();
    return item.getShareLink(kind, expiration);
};
_File.prototype.checkSharingPermissions = async function (this: IFile, recipients: ISharingRecipient[]): Promise<ISharingEntityPermission[]> {
    const item = await this.getItem();
    return item.checkSharingPermissions(recipients);
};
// TODO:: clean up this method signature for next major release
// eslint-disable-next-line max-len
_File.prototype.getSharingInformation = async function (this: IFile, request: ISharingInformationRequest = null, expands?: string[], selects?: string[]): Promise<ISharingInformation> {
    const item = await this.getItem();
    return item.getSharingInformation(request, expands, selects);
};
_File.prototype.getObjectSharingSettings = async function (this: IFile, useSimplifiedRoles = true): Promise<IObjectSharingSettings> {
    const item = await this.getItem();
    return item.getObjectSharingSettings(useSimplifiedRoles);
};
_File.prototype.unshare = async function (this: IFile): Promise<ISharingResult> {
    const item = await this.getItem();
    return item.unshare();
};
_File.prototype.deleteSharingLinkByKind = async function (this: IFile, linkKind: SharingLinkKind): Promise<void> {
    const item = await this.getItem();
    return item.deleteSharingLinkByKind(linkKind);
};
_File.prototype.unshareLink = async function unshareLink(this: IFile, linkKind: SharingLinkKind, shareId = emptyGuid): Promise<void> {
    const item = await this.getItem();
    return item.unshareLink(linkKind, shareId);
};
