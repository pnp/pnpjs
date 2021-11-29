import { TimelinePipe } from "@pnp/core";
import { Queryable } from "@pnp/queryable";

export function Agent(agent: any): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async (url, init, result) => {

            (<any>init).agent = agent;

            return [url, init, result];
        });

        return instance;
    };
}
