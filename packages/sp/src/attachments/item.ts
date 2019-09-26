import { addProp } from "@pnp/odata";
import { _Item } from "../items/types";
import { Attachments, IAttachments } from "./types";

declare module "../items/types" {
    interface _Item {
        readonly attachmentFiles: IAttachments;
    }
    interface IItem {
        /**
         * Read the attachment files data for an item
         */
        readonly attachmentFiles: IAttachments;
    }
}

addProp(_Item, "attachmentFiles", Attachments);
