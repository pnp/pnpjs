import { addProp } from "@pnp/queryable";
import { _List } from "../lists/types.js";
import { Folder, IFolder } from "./types.js";

declare module "../lists/types" {
    interface _List {
        readonly rootFolder: IFolder;
    }
    interface IList {
        /**
         * Root folder for this list/library
         */
        readonly rootFolder: IFolder;
    }
}

addProp(_List, "rootFolder", Folder);
