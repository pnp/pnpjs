import {
    _SharePointQueryableInstance,
    ISharePointQueryableInstance,
    ISharePointQueryableCollection,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { assign, TypedHash } from "@pnp/common";
import { IInvokable, body } from "@pnp/odata";
import { defaultPath, deleteable, IDeleteable } from "../decorators";
import { spPost } from "../operations";

/**
 * Describes a collection of user custom actions
 *
 */
@defaultPath("usercustomactions")
export class _UserCustomActions extends _SharePointQueryableCollection implements _IUserCustomActions {

    public getById(id: string): IUserCustomAction {
        return UserCustomAction(this).concat(`('${id}')`);
    }

    public async add(properties: TypedHash<any>): Promise<IUserCustomActionAddResult> {
        const data = await spPost(this, body(assign({ __metadata: { "type": "SP.UserCustomAction" } }, properties)));
        return {
            action: this.getById(data.Id),
            data,
        };
    }

    public clear(): Promise<void> {
        return spPost(this.clone(UserCustomActions, "clear"));
    }
}

export interface _IUserCustomActions {
    /**	   
     * Returns the user custom action with the specified id	     
     *	    
     * @param id The GUID id of the user custom action to retrieve	     
     */
    getById(id: string): IUserCustomAction;

    /**
     * Creates a user custom action
     *
     * @param properties The information object of property names and values which define the new user custom action
     */
    add(properties: TypedHash<any>): Promise<IUserCustomActionAddResult>;

    /**
     * Deletes all user custom actions in the collection
     */
    clear(): Promise<void>;
}

export interface IUserCustomActions extends _IUserCustomActions, IInvokable, ISharePointQueryableCollection { }

export const UserCustomActions = spInvokableFactory<IUserCustomActions>(_UserCustomActions);

/**
 * Describes a single user custom action
 */
@deleteable()
export class _UserCustomAction extends _SharePointQueryableInstance implements _IUserCustomAction {
    public update: any = this._update<IUserCustomActionUpdateResult, TypedHash<any>>("SP.UserCustomAction", (data) => ({ data, action: <any>this }));
}

export interface _IUserCustomAction {
    /**
    * Updates this user custom action with the supplied properties
    *
    * @param properties An information object of property names and values to update for this user custom action
    */
    update(props: TypedHash<any>): IUserCustomActionUpdateResult;
}

export interface IUserCustomAction extends _IUserCustomAction, IInvokable, ISharePointQueryableInstance, IDeleteable { }

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
