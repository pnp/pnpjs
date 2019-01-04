import { SharePointQueryableCollection, SharePointQueryableInstance, defaultPath } from "./sharepointqueryable";
import { jsS } from "@pnp/common";

/**
 * Describes a collection of webhook subscriptions
 *
 */
@defaultPath("subscriptions")
export class Subscriptions extends SharePointQueryableCollection {

    /**
     * Returns all the webhook subscriptions or the specified webhook subscription
     *
     * @param subscriptionId The id of a specific webhook subscription to retrieve, omit to retrieve all the webhook subscriptions
     */
    public getById(subscriptionId: string): Subscription {
        const s = new Subscription(this);
        s.concat(`('${subscriptionId}')`);
        return s;
    }

    /**
     * Creates a new webhook subscription
     *
     * @param notificationUrl The url to receive the notifications
     * @param expirationDate The date and time to expire the subscription in the form YYYY-MM-ddTHH:mm:ss+00:00 (maximum of 6 months)
     * @param clientState A client specific string (optional)
     */
    public add(notificationUrl: string, expirationDate: string, clientState?: string): Promise<SubscriptionAddResult> {

        const postBody: any = {
            "expirationDateTime": expirationDate,
            "notificationUrl": notificationUrl,
            "resource": this.toUrl(),
        };

        if (clientState) {
            postBody.clientState = clientState;
        }

        return this.postCore({ body: jsS(postBody), headers: { "Content-Type": "application/json" } }).then(result => {

            return { data: result, subscription: this.getById(result.id) };
        });
    }
}

/**
 * Describes a single webhook subscription instance
 *
 */
export class Subscription extends SharePointQueryableInstance {

    /**
     * Renews this webhook subscription
     *
     * @param expirationDate The date and time to expire the subscription in the form YYYY-MM-ddTHH:mm:ss+00:00 (maximum of 6 months, optional)
     * @param notificationUrl The url to receive the notifications (optional)
     * @param clientState A client specific string (optional)
     */
    public update(expirationDate?: string, notificationUrl?: string, clientState?: string): Promise<SubscriptionUpdateResult> {

      const postBody: any = {
      };

      if (expirationDate) {
        postBody.expirationDateTime = expirationDate;
      }

      if (notificationUrl) {
        postBody.notificationUrl = notificationUrl;
      }

      if (clientState) {
        postBody.clientState = clientState;
      }

      return this.patchCore({ body: jsS(postBody), headers: { "Content-Type": "application/json" } }).then(data => {
          return { data: data, subscription: this };
      });
  }

    /**
     * Removes this webhook subscription
     *
     */
    public delete(): Promise<void> {
        return super.deleteCore();
    }
}

export interface SubscriptionAddResult {
    subscription: Subscription;
    data: any;
}

export interface SubscriptionUpdateResult {
    subscription: Subscription;
    data: any;
}
