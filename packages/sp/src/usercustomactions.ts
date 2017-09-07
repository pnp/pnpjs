import { SharePointQueryable, SharePointQueryableInstance, SharePointQueryableCollection } from "./sharepointqueryable";
import { Util } from "../utils/util";
import { TypedHash } from "../collections/collections";

/**
 * Describes a collection of user custom actions
 *
 */
export class UserCustomActions extends SharePointQueryableCollection {

    /**
     * Creates a new instance of the UserCustomActions class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this user custom actions collection
     */
    constructor(baseUrl: string | SharePointQueryable, path = "usercustomactions") {
        super(baseUrl, path);
    }

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
    public add(properties: TypedHash<string | boolean | number>): Promise<UserCustomActionAddResult> {

        const postBody = JSON.stringify(Util.extend({ __metadata: { "type": "SP.UserCustomAction" } }, properties));

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
    public update(properties: TypedHash<string | boolean | number>): Promise<UserCustomActionUpdateResult> {

        const postBody = JSON.stringify(Util.extend({
            "__metadata": { "type": "SP.UserCustomAction" },
        }, properties));

        return this.postCore({
            body: postBody,
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then((data) => {
            return {
                action: this,
                data: data,
            };
        });
    }

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
