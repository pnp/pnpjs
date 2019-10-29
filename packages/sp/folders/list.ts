import { addProp } from "@pnp/odata";
import { _List } from "../lists/types";
import { Folder, IFolder } from "./types";

declare module "../lists/types" {
    interface _List {
        readonly rootFolder: IFolder;
    }
    interface IList {
        readonly rootFolder: IFolder;
    }
}

addProp(_List, "rootFolder", Folder, "rootFolder");
