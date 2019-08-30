import {
    _SharePointQueryableInstance,
    ISharePointQueryableCollection,
    ISharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { IInvokable, body, headers } from "@pnp/odata";
import { defaultPath } from "../decorators";
import { spPost, spDelete, spPatch } from "../operations";

@defaultPath("subscriptions")
export class _Subscriptions extends _SharePointQueryableCollection implements _ISubscriptions {

    public getById(subscriptionId: string): ISubscription {
        return Subscription(this).concat(`('${subscriptionId}')`);
    }

    public async add(notificationUrl: string, expirationDate: string, clientState?: string): Promise<ISubscriptionAddResult> {

        const postBody: any = {
            "expirationDateTime": expirationDate,
            "notificationUrl": notificationUrl,
            "resource": this.toUrl(),
        };

        if (clientState) {
            postBody.clientState = clientState;
        }

        const data = await spPost(this, body(postBody, headers({ "Content-Type": "application/json" })));
        return { data, subscription: this.getById(data.id) };
    }
}

/**
 * Describes a collection of webhook subscriptions
 *
 */
export interface _ISubscriptions {
     /**
     * Returns all the webhook subscriptions or the specified webhook subscription
     *
     * @param subscriptionId The id of a specific webhook subscription to retrieve, omit to retrieve all the webhook subscriptions
     */
    getById(subscriptionId: string): ISubscription;
    /**
     * Creates a new webhook subscription
     *
     * @param notificationUrl The url to receive the notifications
     * @param expirationDate The date and time to expire the subscription in the form YYYY-MM-ddTHH:mm:ss+00:00 (maximum of 6 months)
     * @param clientState A client specific string (optional)
     */
    add(notificationUrl: string, expirationDate: string, clientState?: string): Promise<ISubscriptionAddResult>;
}

export interface ISubscriptions extends _ISubscriptions, IInvokable, ISharePointQueryableCollection {}

export const Subscriptions = spInvokableFactory<ISubscriptions>(_Subscriptions);

export class _Subscription extends _SharePointQueryableInstance implements _ISubscription {

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

        const data = await spPatch(this, body(postBody, headers({ "Content-Type": "application/json" })));
        return { data, subscription: this };
    }

    public delete(): Promise<void> {
        return spDelete(this);
    }
}

/**
 * Describes a single webhook subscription instance
 *
 */
export interface _ISubscription {
    /**
     * Renews this webhook subscription
     *
     * @param expirationDate The date and time to expire the subscription in the form YYYY-MM-ddTHH:mm:ss+00:00 (maximum of 6 months, optional)
     * @param notificationUrl The url to receive the notifications (optional)
     * @param clientState A client specific string (optional)
     */
    update(expirationDate?: string, notificationUrl?: string, clientState?: string): Promise<ISubscriptionUpdateResult>;
    /**
     * Removes this webhook subscription
     *
     */
    delete(): Promise<void>;
}

export interface ISubscription extends _ISubscription, IInvokable, ISharePointQueryableInstance {}

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
