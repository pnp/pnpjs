import { addProp } from "@pnp/queryable";
import { _Folder } from "../folders/types.js";
import { IFiles, Files } from "./types.js";

declare module "../folders/types" {
    interface _Folder {
        readonly files: IFiles;
    }
    interface IFolder {
        /**
         * Folder containing files
         */
        readonly files: IFiles;
    }
}

addProp(_Folder, "files", Files);
