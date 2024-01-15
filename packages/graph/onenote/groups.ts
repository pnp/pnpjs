import { addProp } from "@pnp/queryable";
import { _Group } from "../groups/types.js";
import { IOneNote, OneNote } from "./types.js";

declare module "../groups/types" {
    interface _Group {
        readonly onenote: IOneNote;
    }
    interface IGroup {
        readonly onenote: IOneNote;
    }
}

addProp(_Group, "onenote", OneNote);
