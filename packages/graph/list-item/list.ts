import { addProp } from "@pnp/queryable";
import { _List } from "../lists/types.js";
import { ListItems, IListItems } from "./types.js";

declare module "../lists/types" {
    interface _List {
        readonly items: IListItems;
    }
    interface IList {
        readonly items: IListItems;
    }
}

addProp(_List, "items", ListItems);
