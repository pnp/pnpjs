import { addProp } from "@pnp/queryable";
import { _Group } from "../groups/types.js";
import { ISites, Sites } from "./types.js";

declare module "../groups/types" {
    interface _Group {
        readonly sites: ISites;
    }
    interface IGroup {
        readonly sites: ISites;
    }
}

addProp(_Group, "sites", Sites);
