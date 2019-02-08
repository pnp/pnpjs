import { GraphQueryableInstance, GraphQueryableCollection, defaultPath } from "./graphqueryable";
import { jsS, TypedHash, extend } from "@pnp/common";
import { Subscription as ISubscription } from "@microsoft/microsoft-graph-types";

@defaultPath("subscriptions")
export class Subscriptions extends GraphQueryableCollection<ISubscription[]> {

    public getById(id: string): Subscription {
        return new Subscription(this, id);
    }

    /**
     * Create a new Subscription.
     * 
     * @param changeType Indicates the type of change in the subscribed resource that will raise a notification. The supported values are: created, updated, deleted.
     * @param notificationUrl The URL of the endpoint that will receive the notifications. This URL must make use of the HTTPS protocol.
     * @param resource Specifies the resource that will be monitored for changes. Do not include the base URL (https://graph.microsoft.com/v1.0/).
     * @param expirationDateTime Specifies the date and time when the webhook subscription expires. The time is in UTC.
     * @param additionalProperties A plain object collection of additional properties you want to set on the new subscription
     * 
     */
    public add(changeType: string, notificationUrl: string, resource: string, expirationDateTime: string,
        additionalProperties: TypedHash<any> = {}): Promise<SubAddResult> {

        const postBody = extend({
            changeType: changeType,
            expirationDateTime: expirationDateTime,
            notificationUrl: notificationUrl,
            resource: resource,
        }, additionalProperties);

        return this.postCore({
            body: jsS(postBody),
        }).then(r => {
            return {
                data: r,
                subscription: this.getById(r.id),
            };
        });
    }
}

export class Subscription extends GraphQueryableInstance<ISubscription> {

    /**
     * Deletes this Subscription
     */
    public delete(): Promise<void> {
        return this.deleteCore();
    }

    /**
     * Update the properties of a Subscription
     * 
     * @param properties Set of properties of this Subscription to update
     */
    public update(properties: ISubscription): Promise<void> {

        return this.patchCore({
            body: jsS(properties),
        });
    }
}

export interface SubAddResult {
    data: ISubscription;
    subscription: Subscription;
}
