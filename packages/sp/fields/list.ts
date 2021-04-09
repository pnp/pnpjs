import { addProp } from "@pnp/queryable";
import { _List } from "../lists/types.js";
import { Fields, IFields } from "./types.js";

declare module "../lists/types" {
    interface _List {
        readonly fields: IFields;
    }
    interface IList {
    /**
     * This list's collection of fields
     */
        readonly fields: IFields;
    }
}

addProp(_List, "fields", Fields);
