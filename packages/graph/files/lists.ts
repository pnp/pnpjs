import { addProp } from "@pnp/queryable";
import { _List } from "../lists/types.js";
import { IDrive, Drive, _DriveItem } from "./types.js";
import { checkIn, ICheckInOptions, checkOut } from "./funcs.js";

declare module "../sites/types" {
    interface _List {
        readonly drive: IDrive;
    }
    interface IList {
        readonly drive: IDrive;
    }
}

addProp(_List, "drive", Drive);

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
