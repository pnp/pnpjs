import { body } from "@pnp/queryable";
import { User as IMemberType } from "@microsoft/microsoft-graph-types";
import { _GraphCollection, _GraphInstance, graphInvokableFactory, graphDelete, graphPost } from "../graphqueryable.js";
import { defaultPath, getById, IGetById } from "../decorators.js";

/**
 * Member
 */
export class _Member extends _GraphInstance<IMemberType> {
    /**
     * Removes this Member
     */
    public remove(): Promise<void> {
        return graphDelete(Member(this, "$ref"));
    }
}
export interface IMember extends _Member { }
export const Member = graphInvokableFactory<IMember>(_Member);

/**
 * Members
 */
@defaultPath("members")
@getById(Member)
export class _Members extends _GraphCollection<IMemberType[]> {

    /**
     * Use this API to add a member to an Office 365 group, a security group or a mail-enabled security group through
     * the members navigation property. You can add users or other groups.
     * Important: You can add only users to Office 365 groups.
     *
     * @param id Full @odata.id of the directoryObject, user, or group object you want to add (ex: `https://graph.microsoft.com/v1.0/directoryObjects/${id}`)
     */
    public add(id: string): Promise<any> {
        return graphPost(Members(this, "$ref"), body({ "@odata.id": id }));
    }
}
export interface IMembers extends _Members, IGetById<IMember> { }
export const Members = graphInvokableFactory<IMembers>(_Members);
