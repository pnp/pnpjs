import { addProp } from "@pnp/queryable";
import { _List } from "../lists/types.js";
import { Items, IItems } from "./types.js";

declare module "../lists/types" {
    interface _List {
        readonly items: IItems;
    }
    interface IList {
        readonly items: IItems;
    }
}

addProp(_List, "items", Items);
