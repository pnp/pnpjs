import { addProp } from "@pnp/odata";
import { _List } from "../lists/types";
import { Items, IItems } from "./types";

declare module "../lists/types" {
    interface _List {
        readonly items: IItems;
    }
    interface IList {
        readonly items: IItems;
    }
}

addProp(_List, "items", Items);
