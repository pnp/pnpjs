import { _GraphQueryableInstance, IGraphQueryableInstance, _GraphQueryableCollection, IGraphQueryableCollection, graphInvokableFactory } from "../graphqueryable";
import { extend } from "@pnp/common";
import { IGetable, body } from "@pnp/odata";
import { Subscription as ISubscriptionType } from "@microsoft/microsoft-graph-types";
import { defaultPath, deleteable, IDeleteable, IUpdateable, updateable, getById, IGetById } from "../decorators";
import { graphPost } from "../operations";

/**
 * Subscription
 */
@deleteable()
@updateable()
export class _Subscription extends _GraphQueryableInstance<ISubscriptionType> implements ISubscription { }
export interface ISubscription extends IGetable, IDeleteable, IUpdateable<ISubscriptionType>, IGraphQueryableInstance<ISubscriptionType> { }
export interface _Subscription extends IGetable, IDeleteable, IUpdateable<ISubscriptionType> { }
export const Subscription = graphInvokableFactory<ISubscription>(_Subscription);

/**
 * Subscriptions
 */
@defaultPath("subscriptions")
@getById(Subscription)
export class _Subscriptions extends _GraphQueryableCollection<ISubscriptionType[]> {
    public async add(changeType: string, notificationUrl: string, resource: string, expirationDateTime: string, props: ISubscriptionType = {}): Promise<ISubAddResult> {

        const postBody = extend({
            changeType,
            expirationDateTime,
            notificationUrl,
            resource,
        }, props);

        const data = await graphPost(this, body(postBody));

        return {
            data,
            subscription: this.getById(data.id),
        };
    }
}
export interface ISubscriptions extends IGetable, IGetById<ISubscription>, IGraphQueryableCollection<ISubscriptionType[]> {
    /**
     * Create a new Subscription.
     * 
     * @param changeType Indicates the type of change in the subscribed resource that will raise a notification. The supported values are: created, updated, deleted.
     * @param notificationUrl The URL of the endpoint that will receive the notifications. This URL must make use of the HTTPS protocol.
     * @param resource Specifies the resource that will be monitored for changes. Do not include the base URL (https://graph.microsoft.com/v1.0/).
     * @param expirationDateTime Specifies the date and time when the webhook subscription expires. The time is in UTC.
     * @param props A plain object collection of additional properties you want to set on the new subscription
     * 
     */
    add(changeType: string, notificationUrl: string, resource: string, expirationDateTime: string, props: ISubscriptionType): Promise<ISubAddResult>;
}
export interface _Subscriptions extends IGetable, IGetById<ISubscription> { }
export const Subscriptions = graphInvokableFactory<ISubscriptions>(_Subscriptions);

/**
 * ISubAddResult
 */
export interface ISubAddResult {
    data: ISubscriptionType;
    subscription: ISubscription;
}
