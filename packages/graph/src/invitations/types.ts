import { TypedHash, extend } from "@pnp/common";
import { body, IInvokable } from "@pnp/odata";
import { Invitation as IInvitationType } from "@microsoft/microsoft-graph-types";
import { _GraphQueryableCollection, IGraphQueryableCollection, graphInvokableFactory } from "../graphqueryable";
import { defaultPath } from "../decorators";
import { graphPost } from "../operations";

/**
 * Invitations
 */
@defaultPath("invitations")
export class _Invitations extends _GraphQueryableCollection<IInvitationType[]> implements IInvitations {

    /**
     * Create a new Invitation via invitation manager.
     * 
     * @param invitedUserEmailAddress The email address of the user being invited.
     * @param inviteRedirectUrl The URL user should be redirected to once the invitation is redeemed.
     * @param additionalProperties A plain object collection of additional properties you want to set in the invitation
     */
    public async create(invitedUserEmailAddress: string, inviteRedirectUrl: string, additionalProperties: TypedHash<any> = {}): Promise<IInvitationAddResult> {

        const postBody = extend({ inviteRedirectUrl, invitedUserEmailAddress }, additionalProperties);

        const data = await graphPost<IInvitationType>(this, body(postBody));

        return { data };
    }
}
export interface IInvitations extends IInvokable, IGraphQueryableCollection<IInvitationType[]> {
    create(invitedUserEmailAddress: string, inviteRedirectUrl: string, additionalProperties: TypedHash<any>): Promise<IInvitationAddResult>;
}
export interface _Invitations extends IInvokable { }
export const Invitations = graphInvokableFactory<IInvitations>(_Invitations);

/**
 * IInvitationAddResult
 */
export interface IInvitationAddResult {
    data: IInvitationType;
}
