import { defaultPath, getById, IGetById } from "../decorators.js";
import { body, InjectHeaders } from "@pnp/queryable";
import { combine } from "@pnp/core";
import { graphInvokableFactory, _GraphCollection, _GraphInstance, graphPost, graphGet } from "../graphqueryable.js";
import { DriveItem, IDriveItem } from "../files/types.js";
import {
    Permission as IPermissionType,
    SharedDriveItem as ISharedDriveItemType,
    DriveRecipient as IDriveRecipientType,
} from "@microsoft/microsoft-graph-types";

/**
 * Describes a Share object
 */
export class _Share extends _GraphInstance<ISharedDriveItemType> {

    /**
     * Access the driveItem associated with this shared file
     */
    public get driveItem(): IDriveItem {
        return DriveItem(this, "driveitem");
    }
}
export interface IShare extends _Share { }
export const Share = graphInvokableFactory<IShare>(_Share);

/**
 * Describes a collection of Share objects
 *
 */
@defaultPath("shares")
@getById(Share)
export class _Shares extends _GraphCollection<IPermissionType[]> {
    /**
     * Creates a sharing link (id) from a given absolute url to a file
     * @param url Absolute file url such as "https://{tenant}.sharepoint.com/sites/dev/Shared%20Documents/new.pptx"
     * @returns An encoded sharing id which can be used in getById to access a file
     */
    public encodeSharingLink(url: string): string {
        return (`u!${Buffer.from(url).toString("base64").replace(/=$/, "").replace("/", "_").replace("+", "-")}`);
    }

    /**
     * Method for using a sharing link.
     * @param share: string - Share Id or Encoded Sharing Url
     * @returns Microsoft Graph - SharingLink
     */
    public async useSharingLink(shareLink: IShareLinkInfo): Promise<Pick<ISharedDriveItemType, "id"|"name">> {
        const q = Shares(this, shareLink.shareId || shareLink.encodedSharingUrl);
        if (shareLink.redeemSharingLink) {
            q.using(InjectHeaders({
                "Prefer": (shareLink.redeemSharingLink) ? "redeemSharingLink" : "redeemSharingLinkIfNecessary",
            }));
        }
        return graphGet(q);
    }

    public async grantSharingLinkAccess(shareLinkAccess: IShareLinkAccessInfo): Promise<IPermissionType> {
        const q = Shares(this, combine(shareLinkAccess.encodedSharingUrl, "permission", "grant"));
        return graphPost(q, body(shareLinkAccess));
    }
}
export interface IShares extends _Shares, IGetById<IShare> { }
export const Shares = graphInvokableFactory<IShares>(_Shares);


/**
 * IShareLinkInfo - for using a sharing link - either ShareId or EncodedSharingUrl must be included.
 * @param shareId: string - Optional - Share Id
 * @param encodedSharingUrl: string - Optional - Encoded Sharing Url
 * @param redeemSharingLink: boolean - Optional - True to Redeem the sharing link; False to redeem the sharing link if necessary
 */
export interface IShareLinkInfo {
    shareId?: string;
    encodedSharingUrl?: string;
    redeemSharingLink?: boolean;
}

/**
 * IShareLinkAccessInfo - update Sharing permissions.
 * @param encodedSharingUrl: string - Encoded Sharing Url
 * @param recipients: IDriveRecipientType[] - Array of recipients
 * @param roles: ["read" | "write" | "owner"] - Array of roles
 */
export interface IShareLinkAccessInfo {
    encodedSharingUrl: string;
    recipients: IDriveRecipientType[];
    roles: ["read" | "write" | "owner"];
}
