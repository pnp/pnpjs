import { addProp } from "@pnp/queryable";
import { _Site } from "../sites/types.js";
import { _Web } from "../webs/types.js";
import { RecycleBin, IRecycleBin } from "./types.js";

export {
    IRecycleBin,
    IRecycleBinItemObject as IRecycleBinItem,
    RecycleBin,
} from "./types.js";

declare module "../webs/types" {
    interface _Web {
        readonly recycleBin: IRecycleBin;
    }
    interface IWeb {
        /**
         * Read the attachment files data for an item
         */
        readonly recycleBin: IRecycleBin;
    }
}
addProp(_Web, "recycleBin", RecycleBin);

declare module "../sites/types" {
    interface _Site {
        readonly recycleBin: IRecycleBin;
    }
    interface ISite {
        /**
         * Read the attachment files data for an item
         */
        readonly recycleBin: IRecycleBin;
    }
}
addProp(_Site, "recycleBin", RecycleBin);
