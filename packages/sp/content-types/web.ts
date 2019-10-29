import { addProp } from "@pnp/odata";
import { _Web } from "../webs/types";
import { ContentTypes, IContentTypes } from "./types";

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
