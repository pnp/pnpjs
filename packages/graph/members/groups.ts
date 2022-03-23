import { addProp } from "@pnp/queryable";
import { _Group } from "../groups/types.js";
import { IMembers, Members } from "./types.js";

declare module "../groups/types" {
    interface _Group {
        readonly owners: IMembers;
        readonly members: IMembers;
    }
    interface IGroup {
        readonly owners: IMembers;
        readonly members: IMembers;
    }
}

addProp(_Group, "owners", Members);
addProp(_Group, "members", Members);
