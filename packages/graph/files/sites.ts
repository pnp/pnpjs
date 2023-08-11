import { addProp } from "@pnp/queryable";
import { _Site } from "../sites/types.js";
import { IDrive, Drive, IDrives, Drives, _DriveItem } from "./types.js";
import { checkIn, ICheckInOptions, checkOut } from "./funcs.js";


declare module "../sites/types" {
    interface _Site {
        readonly drive: IDrive;
        readonly drives: IDrives;
    }
    interface ISite {
        readonly drive: IDrive;
        readonly drives: IDrives;
    }
}

addProp(_Site, "drive", Drive);
addProp(_Site, "drives", Drives);


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
