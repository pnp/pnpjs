import { addProp } from "@pnp/odata";
import { _Folder } from "../folders/types";
import { IFiles, Files } from "./types";

declare module "../folders/types" {
    interface _Folder {
        readonly files: IFiles;
    }
    interface IFolder {
        readonly files: IFiles;
    }
}

addProp(_Folder, "files", Files);
