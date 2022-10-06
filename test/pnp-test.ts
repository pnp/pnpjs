import { spfi } from "@pnp/sp";
import { graphfi } from "@pnp/graph";
import { Queryable } from "@pnp/queryable";
import { Context } from "mocha";
import { TimelinePipe } from "@pnp/core";

interface IPnPTestFuncThis extends Context {
    pnpid: string;
    props<T>(defaults: T): Promise<T>;
}

interface IPnPTestFunc {
    (this: IPnPTestFuncThis): any;
}

export const PnPTestHeaderName = "X-PnP-TestId";

/**
 * Behavior used to inject the correct test id into the headers for each request
 *
 * @param id Function generating the id for the test
 * @returns A timeline pipe
 */
function PnPTestIdHeader(id: () => string): TimelinePipe {

    return (instance: Queryable) => {

        instance.on.pre.prepend(async function (url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

            init.headers = { ...init.headers, "X-PnP-TestId": id() };

            return [url, init, result];
        });

        return instance;
    };
}

/**
 * Wrapper function used to wrap our mocha test functions allowing us to inject/change behavior prior
 * to mocha executing
 *
 * @param id The test id, should be unique across the suite of tests (just use a GUID)
 * @param testFunc The function to be run as a test
 * @returns The test function bound to an augmented "this"
 */
export function pnpTest(id: string, testFunc: (this: IPnPTestFuncThis) => any): IPnPTestFunc {

    return async function (this: IPnPTestFuncThis, ...args: any[]) {

        this.pnpid = id;
        this.props = this.pnp.testProps.get.bind(this.pnp.testProps, this.pnpid);

        // clone our sp and graph for each request, include the test header
        this.pnp.sp = spfi(this.pnp._sp).using(PnPTestIdHeader(() => this.pnpid));
        this.pnp.graph = graphfi(this.pnp._graph).using(PnPTestIdHeader(() => this.pnpid));

        return testFunc.apply(this, args);
    };
}
