import { addProp } from "@pnp/queryable";
import { _Item } from "../items/types.js";
import { ContentType, IContentType } from "./types.js";

declare module "../items/types" {
    interface _Item {
        readonly contentType: IContentType;
    }
    interface IItem {
        /**
         * The content type of this item
         */
        readonly contentType: IContentType;
    }
}

addProp(_Item, "contentType", ContentType);
