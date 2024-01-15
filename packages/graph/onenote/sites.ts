import { addProp } from "@pnp/queryable";
import { _Site } from "../sites/types.js";
import { IOneNote, OneNote } from "./types.js";

declare module "../sites/types" {
    interface _Site {
        readonly onenote: IOneNote;
    }
    interface ISite {
        readonly onenote: IOneNote;
    }
}

addProp(_Site, "onenote", OneNote);
