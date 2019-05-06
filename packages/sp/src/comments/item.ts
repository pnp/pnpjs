import { addProp } from "@pnp/odata";
import { _Item } from "../items/types";
import { Comments, IComments } from "./types";

/**
* Extend Web
*/
declare module "../items/types" {
    interface _Item {
        readonly comments: IComments;
    }
    interface IItem {
        readonly comments: IComments;
    }
}

addProp(_Item, "comments", Comments);
