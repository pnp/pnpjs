
import { addProp, body } from "@pnp/queryable";
import { _Group, Group } from "../groups/types.js";
import { _Members, IMember, IMembers, Members } from "./types.js";
import { graphInvokableFactory, graphPatch } from "../graphqueryable.js";
import { getById, IGetById } from "../decorators.js";
import { Member } from "./types.js";

/**
 * Members of a group.
 * Specific subclass to expose additional methods only available on member objects for groups, such as the addBulk method.
 */
@getById(Member)
export class _GroupMembers extends _Members {
    /**
     * Use this API to add members to a Microsoft 365 group, a security group, or a mail-enabled security group through
     * the members navigation property. You can add users or other groups.
     * Important: You can add only users to Microsoft 365 groups.
     *
     * @param members Array of full @odata.id of the directoryObject, user, or group object you want to add (ex: `https://graph.microsoft.com/v1.0/directoryObjects/${id}`)
     */
    public addBulk(members: string[]): Promise<void> {
        return graphPatch(this.getParent(Group), body({ "members@odata.bind": members }));
    }
}
export interface IGroupMembers extends _GroupMembers, IGetById<IMember> { }
export const GroupMembers = graphInvokableFactory<IGroupMembers>(_GroupMembers);

declare module "../groups/types" {
    interface _Group {
        readonly owners: IMembers;
        readonly members: IGroupMembers;
    }
    interface IGroup {
        readonly owners: IMembers;
        readonly members: IGroupMembers;
    }
}

addProp(_Group, "owners", Members, "owners");
addProp(_Group, "members", GroupMembers);
