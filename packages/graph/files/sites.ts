import { addProp } from "@pnp/queryable";
import { _Site } from "../sites/types.js";
import { IDrive, Drive, IDrives, Drives, _Drive } from "./types.js";
import { IList, List } from "../lists/types.js";

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
addProp(_Drive, "list", List);


declare module "./types" {
    interface _Drive {
        list: IList;
    }
    interface IDrive {
        list: IList;
    }
}

