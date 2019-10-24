import {
    _Folder,
} from "../folders/types";
import {
    ISharingEmailData,
    ISharingResult,
    SharingRole,
    ISharedFuncs,
    ISharingInformationRequest,
    SharingLinkKind,
    ISharingRecipient,
} from "./types";

declare module "../folders/types" {
    interface _Folder extends ISharedFuncs {
        shareWith(loginNames: string | string[], role?: SharingRole, requireSignin?: boolean, shareEverything?: boolean, emailData?: ISharingEmailData): Promise<ISharingResult>;
    }
    interface IFolder extends ISharedFuncs {
        shareWith(loginNames: string | string[], role?: SharingRole, requireSignin?: boolean, shareEverything?: boolean, emailData?: ISharingEmailData): Promise<ISharingResult>;
    }
}

_Folder.prototype.shareWith = async function (
    loginNames: string | string[],
    role: SharingRole = SharingRole.View,
    requireSignin = false,
    shareEverything = false,
    emailData?: ISharingEmailData): Promise<ISharingResult> {

    const dependency = this.addBatchDependency();

    const shareable = await this.getShareable();
    dependency();
    return shareable.shareWith(loginNames, role, requireSignin, shareEverything, emailData);
};

_Folder.prototype.getShareLink = async function (this: _Folder, kind: SharingLinkKind, expiration: Date = null): Promise<any> {
    const dependency = this.addBatchDependency();

    const shareable = await this.getShareable();
    dependency();
    return shareable.getShareLink(kind, expiration);
};

_Folder.prototype.checkSharingPermissions = async function (this: _Folder, recipients: ISharingRecipient[]): Promise<any> {
    const dependency = this.addBatchDependency();

    const shareable = await this.getShareable();
    dependency();
    return shareable.checkSharingPermissions(recipients);
};

_Folder.prototype.getSharingInformation = async function (this: _Folder, request?: ISharingInformationRequest, expands?: string[]): Promise<any> {
    const dependency = this.addBatchDependency();

    const shareable = await this.getShareable();
    dependency();
    return shareable.getSharingInformation(request, expands);
};

_Folder.prototype.getObjectSharingSettings = async function (this: _Folder, useSimplifiedRoles = true): Promise<any> {
    const dependency = this.addBatchDependency();

    const shareable = await this.getShareable();
    dependency();
    return shareable.getObjectSharingSettings(useSimplifiedRoles);
};

_Folder.prototype.unshare = async function (this: _Folder): Promise<any> {
    const dependency = this.addBatchDependency();

    const shareable = await this.getShareable();
    dependency();
    return shareable.unshare();
};

_Folder.prototype.deleteSharingLinkByKind = async function (this: _Folder, kind: SharingLinkKind): Promise<any> {
    const dependency = this.addBatchDependency();

    const shareable = await this.getShareable();
    dependency();
    return shareable.deleteSharingLinkByKind(kind);
};

_Folder.prototype.unshareLink = async function (this: _Folder, kind: SharingLinkKind, shareId?: string): Promise<any> {
    const dependency = this.addBatchDependency();

    const shareable = await this.getShareable();
    dependency();
    return shareable.unshareLink(kind, shareId);
};
