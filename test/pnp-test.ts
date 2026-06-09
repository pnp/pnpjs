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
    (this: Context): any;
}

export const PnPTestHeaderName = "X-PnP-TestId";

// we use this to identify tests with duplicate ids, which will cause problems
// really just a safety measure for us
const idDupeTracker: string[] = [];

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

    if (idDupeTracker.indexOf(id.toLowerCase()) > -1) {
        throw Error(`Test id ${id} is already in use.`);
    }

    idDupeTracker.push(id.toLowerCase());

    return (async function (this: Context) {

        const ctx = this as IPnPTestFuncThis;

        ctx.pnpid = id;
        ctx.props = ctx.pnp.testProps.get.bind(ctx.pnp.testProps, ctx.pnpid) as <T>(defaults: T) => Promise<T>;

        // clone our sp and graph for each request, include the test header
        ctx.pnp.sp = spfi(ctx.pnp._sp).using(PnPTestIdHeader(() => ctx.pnpid));
        ctx.pnp.graph = graphfi(ctx.pnp._graph).using(PnPTestIdHeader(() => ctx.pnpid));

        return testFunc.call(ctx);
    }) as IPnPTestFunc;
}
