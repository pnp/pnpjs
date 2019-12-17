import { SharePointQueryableInstance, SharePointQueryableCollection, defaultPath } from "./sharepointqueryable";
import { extend, TypedHash, jsS } from "@pnp/common";

/**
 * Describes a collection of user custom actions
 *
 */
@defaultPath("usercustomactions")
export class UserCustomActions extends SharePointQueryableCollection {

    /**	   
     * Returns the user custom action with the specified id	     
     *	    
     * @param id The GUID id of the user custom action to retrieve	     
     */
    public getById(id: string): UserCustomAction {
        const uca = new UserCustomAction(this);
        uca.concat(`('${id}')`);
        return uca;
    }

    /**
     * Creates a user custom action
     *
     * @param properties The information object of property names and values which define the new user custom action
     *
     */
    public add(properties: TypedHash<any>): Promise<UserCustomActionAddResult> {

        const postBody = jsS(extend({ __metadata: { "type": "SP.UserCustomAction" } }, properties));

        return this.postCore({ body: postBody }).then((data) => {
            return {
                action: this.getById(data.Id),
                data: data,
            };
        });
    }

    /**
     * Deletes all user custom actions in the collection
     *
     */
    public clear(): Promise<void> {
        return this.clone(UserCustomActions, "clear").postCore();
    }
}

/**
 * Describes a single user custom action
 *
 */
export class UserCustomAction extends SharePointQueryableInstance {

    /**
    * Updates this user custom action with the supplied properties
    *
    * @param properties An information object of property names and values to update for this user custom action
    */
    public update = this._update<UserCustomActionUpdateResult, TypedHash<any>>("SP.UserCustomAction", (data) => ({ data, action: this }));

    /**
    * Removes this user custom action
    *
    */
    public delete(): Promise<void> {
        return super.deleteCore();
    }
}

/**
 * Result from adding a user custom action
 *
 */
export interface UserCustomActionAddResult {
    data: any;
    action: UserCustomAction;
}

/**
 * Result from udating a user custom action
 *
 */
export interface UserCustomActionUpdateResult {
    data: any;
    action: UserCustomAction;
}
