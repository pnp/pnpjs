import { TimelinePipe } from "@pnp/core";
import { Queryable } from "@pnp/queryable";

export function Agent(agent: any): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async (url, init, result) => {

            // we add the proxy to the request
            (<any>init).agent = agent;

            return [url, init, result];
        });

        return instance;
    };
}
