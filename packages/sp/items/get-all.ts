import { InjectHeaders } from "@pnp/queryable";
import { _Items, Items, PagedItemCollection } from "./types.js";

declare module "./types" {
    interface _Items {
        getAll<T = any>(requestSize?: number, acceptHeader?: string): Promise<T[]>;
    }
    /**
     * Gets all the items in a list, regardless of count. Does not support batching or caching
     *
     *  @param requestSize Number of items to return in each request (Default: 2000)
     *  @param acceptHeader Allows for setting the value of the Accept header for SP 2013 support
     */
    interface IItems {
        getAll<T = any>(requestSize?: number, acceptHeader?: string): Promise<T[]>;
    }
}

_Items.prototype.getAll = async function <T = any>(this: _Items, requestSize = 2000, acceptHeader = "application/json;odata=nometadata"): Promise<T[]> {

    // this will be used for the actual query
    // and we set no metadata here to try and reduce traffic
    const items = Items(this, "").top(requestSize).using(InjectHeaders({
        "Accept": acceptHeader,
    }));

    // let's copy over the odata query params that can be applied
    // $top - allow setting the page size this way (override what we did above)
    // $select - allow picking the return fields (good behavior)
    // $filter - allow setting a filter, though this may fail for large lists
    // $expand - allow expanding fields for filter/select support
    this.query.forEach((v: string, k: string) => {
        if (/^\$select|filter|top|expand$/i.test(k)) {
            items.query.set(k, v);
        }
    });

    // this will eventually hold the items we return
    const itemsCollector: T[] = [];

    // action that will gather up our results recursively
    const gatherer = (last: PagedItemCollection<any>) => {

        // collect that set of results
        itemsCollector.push(...last.results);

        // if we have more, repeat - otherwise resolve with the collected items
        return last.hasNext ? last.getNext().then(gatherer) : itemsCollector;
    };

    return items.getPaged().then(gatherer);
};
