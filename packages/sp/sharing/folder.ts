import {
    _Folder,
} from "../folders/types.js";
import {
    ISharingEmailData,
    ISharingResult,
    SharingRole,
    ISharedFuncs,
    ISharingInformationRequest,
    SharingLinkKind,
    ISharingRecipient,
} from "./types.js";

declare module "../folders/types" {
    interface _Folder extends ISharedFuncs {
        shareWith(loginNames: string | string[], role?: SharingRole, requireSignin?: boolean, emailData?: ISharingEmailData): Promise<ISharingResult>;
    }
    interface IFolder extends ISharedFuncs {
        shareWith(loginNames: string | string[], role?: SharingRole, requireSignin?: boolean, emailData?: ISharingEmailData): Promise<ISharingResult>;
    }
}

const field = "odata.id";

_Folder.prototype.shareWith = async function (
    this: _Folder,
    loginNames: string | string[],
    role: SharingRole = SharingRole.View,
    requireSignin = false,
    emailData?: ISharingEmailData): Promise<ISharingResult> {

    const shareable = await this.getItem(field);
    return shareable.shareWith(loginNames, role, requireSignin, emailData);
};

_Folder.prototype.getShareLink = async function (this: _Folder, kind: SharingLinkKind, expiration: Date = null): Promise<any> {
    const shareable = await this.getItem(field);
    return shareable.getShareLink(kind, expiration);
};

_Folder.prototype.checkSharingPermissions = async function (this: _Folder, recipients: ISharingRecipient[]): Promise<any> {
    const shareable = await this.getItem(field);
    return shareable.checkSharingPermissions(recipients);
};

_Folder.prototype.getSharingInformation = async function (this: _Folder, request?: ISharingInformationRequest, expands?: string[], selects?: string[]): Promise<any> {
    const shareable = await this.getItem(field);
    return shareable.getSharingInformation(request, expands, selects);
};

_Folder.prototype.getObjectSharingSettings = async function (this: _Folder, useSimplifiedRoles = true): Promise<any> {
    const shareable = await this.getItem(field);
    return shareable.getObjectSharingSettings(useSimplifiedRoles);
};

_Folder.prototype.unshare = async function (this: _Folder): Promise<any> {
    const shareable = await this.getItem(field);
    return shareable.unshare();
};

_Folder.prototype.deleteSharingLinkByKind = async function (this: _Folder, kind: SharingLinkKind): Promise<any> {
    const shareable = await this.getItem(field);
    return shareable.deleteSharingLinkByKind(kind);
};

_Folder.prototype.unshareLink = async function (this: _Folder, kind: SharingLinkKind, shareId?: string): Promise<any> {
    const shareable = await this.getItem(field);
    return shareable.unshareLink(kind, shareId);
};
