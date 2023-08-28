import { addProp } from "@pnp/queryable";
import { _Site } from "../sites/types.js";
import { IOperations, Operations } from "./types.js";

declare module "../sites/types" {
    interface _Site {
        readonly operations: IOperations;
    }
    interface ISite {
        readonly operations: IOperations;
    }
}

addProp(_Site, "operations", Operations);
