import { addProp } from "@pnp/odata";
import { _Group } from "../groups/types";
import { IMembers, Members } from "./types";

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

addProp(_Group, "owners", Members, "owners");
addProp(_Group, "members", Members);
