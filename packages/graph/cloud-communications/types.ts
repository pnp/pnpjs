
import { DateTimeTimeZone, Presence as IUserPresence, ItemBody  } from "@microsoft/microsoft-graph-types";
import { _GraphCollection, graphInvokableFactory, _GraphInstance, graphPost } from "../graphqueryable.js";
import { defaultPath } from "../decorators.js";
import { body } from "@pnp/queryable";

/**
 * Presence
 */

@defaultPath("presence")
export class _Presence extends _GraphInstance<IUserPresence> {
    /**
     * Sets presence information for a user
     *
     * @param presence Presence object to set the state of a user's presence session
     */
    public async setPresence(presence: ISetPresenceOptions): Promise<void> {
        const postBody = { ...presence };
        return graphPost(Presence(this, "setPresence"), body(postBody));
    }

    /**
     * Clear application presence session of a user. If it is the user's only presence session, the user's presence will change to Offline/Offline.
     *
     * @param sessionId Id of the application to clear presence
     */
    public async clearPresence(sessionId: string): Promise<void> {
        const postBody = { sessionId };
        return graphPost(Presence(this, "clearPresence"), body(postBody));
    }
    /**
     * Set the preferred availability and activity status for a user
     *
     * @param presence Presence object to set as preferred availbility and activity status of a user
     */
    public async setPreferredPresence(presence: IPresenceOptions): Promise<void> {

        const postBody = { ...presence };
        return graphPost(Presence(this, "setUserPreferredPresence"), body(postBody));
    }
    /**
     * Clears the preferred availability and activity status for a user
     *
     */
    public async clearPreferredPresence(): Promise<void> {
        return graphPost(Presence(this, "clearUserPreferredPresence"));
    }

    /**
     * Set a presence status message for a user
     *
     */
    public async setStatusMessage(message: IPresenceStatusMessage): Promise<void> {
        const postBody = { statusMessage: {...message} };
        return graphPost(Presence(this, "setStatusMessage"), body(postBody));
    }

}
export interface IPresence extends _Presence {}
export const Presence = graphInvokableFactory<IPresence>(_Presence);

@defaultPath("communications")
export class _Communications extends _GraphCollection<IUserPresence[]> {
    /**
     * Retrieve presence information for a group of users
     *
     * @param ids An array of user id's to retrieve presence for.
     */
    public async getPresencesByUserId(ids: string[]): Promise<IUserPresence[]> {
        const postBody = { ids };
        return graphPost(Communications(this, "getPresencesByUserId"), body(postBody));
    }
}
export interface ICommunications extends _Communications { }
export const Communications = graphInvokableFactory<ICommunications>(_Communications);

export interface IPresenceOptions extends IUserPresence{
    expirationDuration?: string;
}

export interface ISetPresenceOptions extends IPresenceOptions {
    sessionId: string;
}

export interface IPresenceStatusMessage {
    message: ItemBody;
    expiryDateTime: DateTimeTimeZone;
}
