import { addProp } from "@pnp/queryable";
import { _List } from "../lists/types.js";
import { ContentTypes, IContentTypes } from "./types.js";

declare module "../lists/types" {
    interface _List {
        readonly contentTypes: IContentTypes;
    }
    interface IList {
        /**
         * Content types available on this list
         */
        readonly contentTypes: IContentTypes;
    }
}

addProp(_List, "contentTypes", ContentTypes);
