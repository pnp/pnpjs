import { addProp } from "@pnp/odata";
import { _Item } from "../items/types";
import { File, IFile } from "./types";

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
