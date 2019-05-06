import { addProp } from "@pnp/odata";
import { _List } from "../lists/types";
import { ContentTypes, IContentTypes } from "./types";

/**
* Extend List
*/
declare module "../lists/types" {
    interface _List {
        readonly contentTypes: IContentTypes;
    }
    interface IList {
        readonly contentTypes: IContentTypes;
    }
}

addProp(_List, "contentTypes", ContentTypes);
