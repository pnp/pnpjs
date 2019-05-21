import { IInvokable, body } from "@pnp/odata";
import { User as IMemberType } from "@microsoft/microsoft-graph-types";
import { _GraphQueryableCollection, IGraphQueryableInstance, _GraphQueryableInstance, IGraphQueryableCollection, graphInvokableFactory } from "../graphqueryable";
import { defaultPath, getById, IGetById } from "../decorators";
import { graphDelete, graphPost } from "../operations";

/**
 * Member
 */
export class _Member extends _GraphQueryableInstance<IMemberType> implements IMember {
    /**
     * Removes this Member
     */
    public remove(): Promise<void> {
        return graphDelete(this.clone(Member, "$ref"));
    }
}
export interface IMember extends IInvokable, IGraphQueryableInstance<IMemberType> { }
export interface _Member extends IInvokable { }
export const Member = graphInvokableFactory<IMember>(_Member);

/**
 * Members
 */
@defaultPath("members")
@getById(Member)
export class _Members extends _GraphQueryableCollection<IMemberType[]> implements IMembers {

    /**
     * Use this API to add a member to an Office 365 group, a security group or a mail-enabled security group through
     * the members navigation property. You can add users or other groups.
     * Important: You can add only users to Office 365 groups.
     * 
     * @param id Full @odata.id of the directoryObject, user, or group object you want to add (ex: https://graph.microsoft.com/v1.0/directoryObjects/${id})
     */
    public add(id: string): Promise<any> {
        return graphPost(this.clone(Members, "$ref"), body({ "@odata.id": id }));
    }
}
export interface IMembers extends IInvokable, IGetById<IMember>, IGraphQueryableCollection<IMemberType[]> { }
export interface _Members extends IInvokable, IGetById<IMember> { }
export const Members = graphInvokableFactory<IMembers>(_Members);
