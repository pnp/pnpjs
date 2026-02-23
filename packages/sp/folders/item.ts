import { addProp } from "@pnp/queryable";
import { _Item } from "../items/types.js";
import { Folder, IFolder } from "./types.js";

declare module "../items/types" {
    interface _Item {
        readonly folder: IFolder;

    }
    interface IItem {
        readonly folder: IFolder;

    }
}

addProp(_Item, "folder", Folder);
