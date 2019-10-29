import { addProp } from "@pnp/odata";
import { _Item } from "../items/types";
import { Folder, IFolder } from "./types";

declare module "../items/types" {
    interface _Item {
        readonly folder: IFolder;

    }
    interface IItem {
        readonly folder: IFolder;

    }
}

addProp(_Item, "folder", Folder, "folder");
