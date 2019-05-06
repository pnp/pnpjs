import { addProp } from "@pnp/odata";
import { _Item } from "../items/types";
import { ContentType, IContentType } from "./types";

/**
* Extend Item
*/
declare module "../items/types" {
    interface _Item {
        readonly contentType: IContentType;
    }
    interface IItem {
        readonly contentType: IContentType;
    }
}

addProp(_Item, "contentType", ContentType, "ContentType");
