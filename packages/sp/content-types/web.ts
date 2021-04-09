import { addProp } from "@pnp/queryable";
import { _Web } from "../webs/types.js";
import { ContentTypes, IContentTypes } from "./types.js";

declare module "../webs/types" {
    interface _Web {
        readonly contentTypes: IContentTypes;
    }
    interface IWeb {
        /**
         * Content types contained in this web
         */
        readonly contentTypes: IContentTypes;
    }
}

addProp(_Web, "contentTypes", ContentTypes);
