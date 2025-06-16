
import { addProp, body } from "@pnp/queryable";
import { _Group } from "../groups/types.js";
import { IMembers, Members } from "./types.js";
import { graphPatch } from "../graphqueryable.js";

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

declare module "./types" {
    interface IMembers {
        addBulk(members: string[]): Promise<void>;
    }
    interface _Members {
        addBulk(members: string[]): Promise<void>;
    }
}
/**
     * Use this API to add a members to an Microsoft 365 group, a security group or a mail-enabled security group through
     * the members navigation property. You can add users or other groups.
     * Important: You can add only users to Microsoft 365 groups.
     *
     * @param members Array of full @odata.id of the directoryObject, user, or group object you want to add (ex: `https://graph.microsoft.com/v1.0/directoryObjects/${id}`)
     */
_Group.prototype.members.addBulk = function (members: string[]): Promise<void> {
    return graphPatch(Members(this), body({ "members@odata.bind": members }));
};
