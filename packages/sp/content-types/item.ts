import { addProp } from "@pnp/odata";
import { _Item } from "../items/types";
import { ContentType, IContentType } from "./types";

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

addProp(_Item, "contentType", ContentType, "ContentType");
