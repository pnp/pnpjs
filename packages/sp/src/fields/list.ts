import { addProp } from "@pnp/odata";
import { _List } from "../lists/types";
import { Fields, IFields } from "./types";

/**
* Extend List
*/
declare module "../lists/types" {
    interface _List {
        readonly fields: IFields;
    }
    interface IList {
        readonly fields: IFields;
    }
}

addProp(_List, "fields", Fields);
