
import { Presence as IUserPresence } from "@microsoft/microsoft-graph-types";
import { _GraphQueryableCollection, graphInvokableFactory, _GraphQueryableInstance } from "../graphqueryable.js";
import { defaultPath } from "../decorators.js";
import { graphPost } from "../operations.js";
import { body } from "@pnp/queryable";

/**
 * Presence
 */

@defaultPath("presence")
export class _Presence extends _GraphQueryableInstance<IUserPresence> { }
export interface IPresence extends _Presence { }
export const Presence = graphInvokableFactory<IPresence>(_Presence);

@defaultPath("communications")
export class _Communications extends _GraphQueryableCollection<IUserPresence[]> {
    /**
     * Retrieve presence information for a group of users.
     *
     * @param ids An array of user id's to retrieve presence for.
     */
    public async getPresencesByUserId(ids: string[]): Promise<IUserPresence[]> {

        const postBody = { ids };
        // return graphPost(<any>Search(this, "query"), body(request));
        return graphPost(Communications(this, "getPresencesByUserId"), body(postBody));
    }
}
export interface ICommunications extends _Communications { }
export const Communications = graphInvokableFactory<ICommunications>(_Communications);
