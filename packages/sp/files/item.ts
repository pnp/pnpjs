import { addProp } from "@pnp/queryable";
import { _Item } from "../items/types.js";
import { File, IFile } from "./types.js";

declare module "../items/types" {
    interface _Item {
        readonly file: IFile;
    }
    interface IItem {
        /**
         * File in sharepoint site
         */
        readonly file: IFile;
    }
}

addProp(_Item, "file", File, "file");
