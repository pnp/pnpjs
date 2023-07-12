import { defaultPath } from "../decorators.js";
import { graphInvokableFactory, _GraphQueryableCollection, _GraphQueryableInstance } from "../graphqueryable.js";
import { SharedDriveItem as ISharedDriveItem } from "@microsoft/microsoft-graph-types";
import { DriveItem, IDriveItem } from "../onedrive/types.js";

/**
 * Shares
 */
@defaultPath("shares")
export class _Shares extends _GraphQueryableCollection<ISharedDriveItem[]> {

    /**
     * Gets a share by share id or encoded url
     * @param id The share id
     * @returns An IShare instance
     */
    public getById(id: string): IShare {
        return Share(this, id);
    }

    /**
     * Creates a sharing link (id) from a given absolute url to a file
     * @param url Absolute file url such as "https://{tenant}.sharepoint.com/sites/dev/Shared%20Documents/new.pptx"
     * @returns An encoded sharing id which can be used in getById to access a file
     */
    public encodeSharingLink(url: string): string {
        return (`u!${Buffer.from(url).toString("base64").replace(/=$/, "").replace("/", "_").replace("+", "-")}`);
    }
}
export interface IShares extends _Shares { }
export const Shares = graphInvokableFactory<IShares>(_Shares);

/**
 * Share
 */
export class _Share extends _GraphQueryableInstance<ISharedDriveItem> {

    /**
     * Access the driveItem associated with this shared file
     */
    public get driveItem(): IDriveItem {
        return DriveItem(this, "driveitem");
    }
}
export interface IShare extends _Share { }
export const Share = graphInvokableFactory<IShare>(_Share);

