import { addProp } from "@pnp/queryable";
import { _List } from "../lists/types.js";
import { IOperations, Operations } from "./types.js";

declare module "../lists/types" {
    interface _List {
        readonly operations: IOperations;
    }
    interface IList {
        readonly operations: IOperations;
    }
}

addProp(_List, "operations", Operations);
