import {
    _SharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
    deleteable,
    IDeleteable,
} from "../sharepointqueryable";
import { assign, TypedHash } from "@pnp/common";
import { body } from "@pnp/odata";
import { defaultPath } from "../decorators";
import { spPost } from "../operations";
import { tag } from "../telemetry";

@defaultPath("usercustomactions")
export class _UserCustomActions extends _SharePointQueryableCollection {

    /**	   
     * Returns the user custom action with the specified id	     
     *	    
     * @param id The GUID id of the user custom action to retrieve	     
     */
    public getById(id: string): IUserCustomAction {
        return tag.configure(UserCustomAction(this).concat(`('${id}')`), "ucas.getById");
    }

    /**
     * Creates a user custom action
     *
     * @param properties The information object of property names and values which define the new user custom action
     */
    @tag("ucas.add")
    public async add(properties: TypedHash<any>): Promise<IUserCustomActionAddResult> {
        const data = await spPost(this, body(assign({ __metadata: { "type": "SP.UserCustomAction" } }, properties)));
        return {
            action: this.getById(data.Id),
            data,
        };
    }

    /**
     * Deletes all user custom actions in the collection
     */
    @tag("ucas.clear")
    public clear(): Promise<void> {
        return spPost(this.clone(UserCustomActions, "clear"));
    }
}
export interface IUserCustomActions extends _UserCustomActions { }
export const UserCustomActions = spInvokableFactory<IUserCustomActions>(_UserCustomActions);

export class _UserCustomAction extends _SharePointQueryableInstance {

    public delete = deleteable("uca");

    /**
    * Updates this user custom action with the supplied properties
    *
    * @param properties An information object of property names and values to update for this user custom action
    */
    public update: any = this._update<IUserCustomActionUpdateResult, TypedHash<any>>("SP.UserCustomAction", (data) => ({ data, action: <any>this }));
}
export interface IUserCustomAction extends _UserCustomAction, IDeleteable { }
export const UserCustomAction = spInvokableFactory<IUserCustomAction>(_UserCustomAction);

/**
 * Result from adding a user custom action
 */
export interface IUserCustomActionAddResult {
    /*
     * The raw data returned from the add operation
     */
    data: any;

    /*
     * The added UserCustomAction
     */
    action: IUserCustomAction;
}

/**
 * Result from udating a user custom action
 */
export interface IUserCustomActionUpdateResult {
    /*
     * The raw data returned from the update operation
     */
    data: any;

    /*
     * The updated UserCustomAction
     */
    action: IUserCustomAction;
}
