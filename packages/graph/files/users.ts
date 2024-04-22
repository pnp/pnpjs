import { addProp, body } from "@pnp/queryable";
import { graphPost } from "../graphqueryable.js";
import { _User } from "../users/types.js";
import { IDrive, Drive, IDrives, Drives, _Drive, DriveItem, IDriveItem, _DriveItem, IItemOptions, DriveItems } from "./types.js";

declare module "../users/types" {
    interface _User {
        readonly drive: IDrive;
        readonly drives: IDrives;
    }
    interface IUser {
        readonly drive: IDrive;
        readonly drives: IDrives;
    }
}

addProp(_User, "drive", Drive);
addProp(_User, "drives", Drives);
addProp(_Drive, "following", DriveItems);

declare module "./types" {
    interface _Drive {
        special(specialFolder: SpecialFolder): IDriveItem;
    }
    interface IDrive {
        special(specialFolder: SpecialFolder): IDriveItem;
    }
    interface _DriveItem {
        restore(restoreOptions: IItemOptions): Promise<IDriveItem>;
    }
    interface IDriveItem {
        restore(restoreOptions: IItemOptions): Promise<IDriveItem>;
    }
}

/**
 * Get special folder (as drive) for a user.
 */
_Drive.prototype.special = function special(specialFolder: SpecialFolder): IDriveItem {
    return DriveItem(this, `special/${specialFolder}`);
};

export enum SpecialFolder {
    "Documents" = "documents",
    "Photos" = "photos",
    "CameraRoll" = "cameraroll",
    "AppRoot" = "approot",
    "Music" = "music",
}

_DriveItem.prototype.restore = function restore(restoreOptions: IItemOptions): Promise<IDriveItem> {
    return graphPost(DriveItem(this, "restore"), body(restoreOptions));
};
