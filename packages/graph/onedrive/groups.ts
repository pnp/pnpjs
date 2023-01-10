import { addProp } from "@pnp/queryable";
import { _Group } from "../groups/types.js";
import { checkIn, ICheckInOptions, checkOut } from "./funcs.js";
import { IDrive, Drive, IDrives, Drives, _DriveItem } from "./types.js";

declare module "../groups/types" {
    interface _Group {
        readonly drive: IDrive;
        readonly drives: IDrives;
    }
    interface IGroup {
        readonly drive: IDrive;
        readonly drives: IDrives;
    }
}

addProp(_Group, "drive", Drive);
addProp(_Group, "drives", Drives);

declare module "./types" {
    interface _DriveItem {
        checkIn(checkInOptions?: ICheckInOptions): Promise<void>;
        checkOut(): Promise<void>;
    }

    interface DriveItem {
        checkIn(checkInOptions?: ICheckInOptions): Promise<void>;
        checkOut(): Promise<void>;
    }
}

_DriveItem.prototype.checkIn = checkIn;
_DriveItem.prototype.checkOut = checkOut;
