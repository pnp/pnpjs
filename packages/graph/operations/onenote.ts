import { addProp } from "@pnp/queryable";
import { _OneNote } from "../onenote/types.js";
import { IOperations, Operations } from "./types.js";

declare module "../onenote/types" {
    interface _OneNote {
        readonly operations: IOperations;
    }
    interface IOneNote {
        readonly operations: IOperations;
    }
}

addProp(_OneNote, "operations", Operations);
