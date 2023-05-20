import { GraphFI } from "../fi.js";
import "./users.js";
import "./groups.js";
import "./sites.js";
import { Drives, IDrives } from "./types.js";

export {
    SpecialFolder,
} from "./users.js";

export {
    ICheckInOptions,
} from "./funcs.js";

export {
    Drive,
    DriveItem,
    DriveItems,
    Drives,
    IDrive,
    IDriveItem,
    IDriveItemAddResult,
    IDriveItemVersionInfo,
    IDriveItems,
    IDrives,
    IRoot,
    Root,
    ISharingWithMeOptions,
    IItemOptions as IItemReferenceOptions,
    IDeltaItems,
    IPreviewOptions,
    IFileOptions,
    IAnalyticsOptions,
} from "./types.js";

declare module "../fi" {
    interface GraphFI {
        readonly drives: IDrives;
    }
}

Reflect.defineProperty(GraphFI.prototype, "drives", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(Drives);
    },
});
