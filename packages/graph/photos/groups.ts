import { addProp } from "@pnp/odata";
import { _Group } from "../groups/types";
import { Photo, IPhoto } from "./types";

declare module "../groups/types" {
    interface _Group {
        readonly photo: IPhoto;
    }
    interface IGroup {
        readonly photo: IPhoto;
    }
}

addProp(_Group, "photo", Photo);
