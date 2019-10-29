import { addProp } from "@pnp/odata";
import { _List } from "../lists/types";
import { Fields, IFields } from "./types";

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
