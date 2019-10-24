import { addProp } from "@pnp/odata";
import { _List } from "../lists/types";
import { ContentTypes, IContentTypes } from "./types";

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
