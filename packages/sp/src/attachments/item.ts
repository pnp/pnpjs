import { addProp } from "@pnp/odata";
import { _Item } from "../items/types";
import { Attachments, IAttachments } from "./types";

/**
* Extend Web
*/
declare module "../items/types" {
    interface _Item {
        readonly attachmentFiles: IAttachments;
    }
    interface IItem {
        readonly attachmentFiles: IAttachments;
    }
}

addProp(_Item, "attachmentFiles", Attachments);
