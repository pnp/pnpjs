import { body } from "@pnp/queryable";
import { User as IMemberType } from "@microsoft/microsoft-graph-types";
import { _GraphQueryableCollection, _GraphQueryableInstance, graphInvokableFactory } from "../graphqueryable.js";
import { defaultPath, getById, IGetById } from "../decorators.js";
import { graphDelete, graphPost } from "../operations.js";

/**
 * Member
 */
export class _Member extends _GraphQueryableInstance<IMemberType> {
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
export class _Members extends _GraphQueryableCollection<IMemberType[]> {

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
