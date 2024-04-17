import {
    _SPCollection,
    spInvokableFactory,
    _SPInstance,
    spPost,
    spPatch,
    spDelete,
} from "../spqueryable.js";
import { body } from "@pnp/queryable";
import { defaultPath } from "../decorators.js";

@defaultPath("subscriptions")
export class _Subscriptions extends _SPCollection {

    /**
    * Returns all the webhook subscriptions or the specified webhook subscription
    *
    * @param subscriptionId The id of a specific webhook subscription to retrieve, omit to retrieve all the webhook subscriptions
    */
    public getById(subscriptionId: string): ISubscription {

        return Subscription(this).concat(`('${subscriptionId}')`);
    }

    /**
     * Creates a new webhook subscription
     *
     * @param notificationUrl The url to receive the notifications
     * @param expirationDate The date and time to expire the subscription in the form YYYY-MM-ddTHH:mm:ss+00:00 (maximum of 6 months)
     * @param clientState A client specific string (optional)
     */
    public async add(notificationUrl: string, expirationDate: string, clientState?: string): Promise<any> {

        const postBody: any = {
            "expirationDateTime": expirationDate,
            "notificationUrl": notificationUrl,
            "resource": this.toUrl(),
        };

        if (clientState) {
            postBody.clientState = clientState;
        }

        return spPost(this, body(postBody));
    }
}
export interface ISubscriptions extends _Subscriptions { }
export const Subscriptions = spInvokableFactory<ISubscriptions>(_Subscriptions);

export class _Subscription extends _SPInstance {

    /**
     * Renews this webhook subscription
     *
     * @param expirationDate The date and time to expire the subscription in the form YYYY-MM-ddTHH:mm:ss+00:00 (maximum of 6 months, optional)
     * @param notificationUrl The url to receive the notifications (optional)
     * @param clientState A client specific string (optional)
     */
    public async update(expirationDate?: string, notificationUrl?: string, clientState?: string): Promise<any> {

        const postBody: any = {};

        if (expirationDate) {
            postBody.expirationDateTime = expirationDate;
        }

        if (notificationUrl) {
            postBody.notificationUrl = notificationUrl;
        }

        if (clientState) {
            postBody.clientState = clientState;
        }

        return spPatch(this, body(postBody));
    }

    /**
     * Removes this webhook subscription
     *
     */
    public delete(): Promise<void> {
        return spDelete(this);
    }
}
export interface ISubscription extends _Subscription { }
export const Subscription = spInvokableFactory<ISubscription>(_Subscription);
