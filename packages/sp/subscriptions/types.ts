import {
    _SPCollection,
    spInvokableFactory,
    _SPInstance,
} from "../spqueryable.js";
import { body } from "@pnp/queryable";
import { defaultPath } from "../decorators.js";
import { spPost, spPatch, spDelete } from "../operations.js";

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
    public async add(notificationUrl: string, expirationDate: string, clientState?: string): Promise<ISubscriptionAddResult> {

        const postBody: any = {
            "expirationDateTime": expirationDate,
            "notificationUrl": notificationUrl,
            "resource": this.toUrl(),
        };

        if (clientState) {
            postBody.clientState = clientState;
        }

        const data = await spPost(this, body(postBody));

        return { data, subscription: this.getById(data.id) };
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
    public async update(expirationDate?: string, notificationUrl?: string, clientState?: string): Promise<ISubscriptionUpdateResult> {

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

        const data = await spPatch(this, body(postBody));

        return { data, subscription: this };
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

/**
 * Result from adding a new subscription
 *
 */
export interface ISubscriptionAddResult {
    subscription: ISubscription;
    data: any;
}

/**
 * Result from updating a subscription
 *
 */
export interface ISubscriptionUpdateResult {
    subscription: ISubscription;
    data: any;
}
