import { addProp } from "@pnp/queryable";
import { _Site } from "../sites/types.js";
import { Lists, ILists } from "./types.js";

declare module "../sites/types" {
    interface _Site {
        readonly lists: ILists;
    }
    interface ISite {
        /**
         * Read the attachment files data for an item
         */
        readonly lists: ILists;
    }
}
addProp(_Site, "lists", Lists);
