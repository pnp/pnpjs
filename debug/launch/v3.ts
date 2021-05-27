import { ITestingSettings } from "../../test/settings.js";
import { ConsoleListener, Logger, LogLevel } from "@pnp/logging";
import { Queryable2, InjectHeaders, Caching, HttpRequestError, createBatch, PnPLogging, get } from "@pnp/queryable";
import { NodeFetchWithRetry, MSAL, Proxy, NodeFetch } from "@pnp/nodejs";
import { combine, isFunc, getHashCode, PnPClientStorage, dateAdd } from "@pnp/common";
import { DefaultParse, JSONParse, TextParse } from "@pnp/queryable";
import { sp } from "@pnp/sp/rest.js";

declare var process: { exit(code?: number): void };

export async function Example(settings: ITestingSettings) {

    // TODO:: a way to wrap up different sets of configurations like below.
    // Need a lib default, plus others like Node default, etc.
    // Maybe a default with caching always on, etc.

    const testingRoot = new Queryable2(combine(settings.testing.sp.url, "_api/web"));

    testingRoot
        .using(MSAL(settings.testing.sp.msal.init, settings.testing.sp.msal.scopes))
        .using(InjectHeaders({
            "Accept": "application/json",
            "Content-Type": "application/json;odata=verbose;charset=utf-8",
            "User-Agent": "NONISV|SharePointPnP|PnPjs",
            "X-ClientService-ClientTag": "PnPCoreJS:3.0.0-exp",
        }))
        .using(NodeFetchWithRetry())
        // .using(NodeFetchWithRetry(2))
        // .using(NodeFetch())
        .using(DefaultParse())
        // .using(TextParse())
        // .using(JSONParse())
        // .using(Proxy("https://127.0.0.1:8888"))
        .on.error((err) => {
            console.error("caught it");
            console.error(err);
        });

    testingRoot.on.pre(async (url, init, result) => {

        init.cache = "no-cache";
        init.credentials = "same-origin";

        return [url, init, result];
    });

    // TODO:: make on.x chainable to y.on.x().on.z().on.u();
    // testingRoot.on.post(async (_url: URL, result: any) => {

    //     console.log(JSON.stringify(result));

    //     return [_url, result];
    // });

    testingRoot.on.log((message, level) => {

        if (level >= LogLevel.Verbose) {

            console.log(`Cheap log: ${message}.`);
        }
    });

    const t2 = new Queryable2(testingRoot, "lists");

    t2.on.pre(async function (this: Queryable2, url, init, result) {
        this.emit.log("Howdy, you shouldn't see me :)");
        return [url, init, result];
    });

    // TODO:: need to track if timeline is active and create a running clone of the timeline or how 
    // do we handle the case where a timeline modifies itself?
    // t2.resetObservers();

    // sending a request uses one of the helper methods get(), post(), put(), delete(), etc.
    try {

        const u = await get(t2);

        console.log("here");

    } catch (e) {

        console.error(e);
    }

    // TODO:: still need to fix up auth for batches. Can it get it from some central place?? DO we now run batch as a queryable with associated events for the core request? Yes for consistency.
    // const hackAuth = MSAL(settings.testing.sp.msal.init, settings.testing.sp.msal.scopes);
    // const [, init,] = await Reflect.apply(hackAuth, t, ["", { headers: {} }, undefined]);

    // const [batch, executeBatch] = createBatch(settings.testing.sp.url, NodeSend(), init.headers["Authorization"]);

    // t.using(batch);
    // t2.using(batch);

    // await executeBatch();


    // Logger.subscribe(new ConsoleListener());

    // // most basic implementation
    // t.on.log((message: string, level: LogLevel) => {
    //     console.log(`[${level}] ${message}`);
    // });

    // // super easy debug
    // t.on.error(console.error);
    // t2.on.error(console.error);

    // let notExist: boolean = false;
    // t3.on.error((err: HttpRequestError) => {
    //     if (err.status == 404) {
    //         notExist = true;
    //     }
    // });
    // // MSAL config via using?
    // // t.using(MSAL2(settings.testing.sp.msal.init, settings.testing.sp.msal.scopes));
    // t3.using(MSAL2(settings.testing.sp.msal.init, settings.testing.sp.msal.scopes));

    // // or directly into the event?
    // // t.on.pre(MSAL(settings.testing.sp.msal.init, settings.testing.sp.msal.scopes));

    // how to register your own pre-handler
    // t.on.pre(async function (url: string, init: RequestInit, result: any) {

    //     // example of setting up default values
    //     url = combine(url, "_api/web");

    //     init.headers["Accept"] = "application/json";
    //     init.headers["Content-Type"] = "application/json;odata=verbose;charset=utf-8";

    //     this.log(`Url: ${url}`);

    //     return [url, init, result];
    // });

    // t.using(InjectHeaders({
    //     "Accept": "application/json",
    //     "Content-Type": "application/json;odata=verbose;charset=utf-8",
    // }));

    // t2.using(InjectHeaders({
    //     "Accept": "application/json",
    //     "Content-Type": "application/json;odata=verbose;charset=utf-8",
    // }));

    // t3.using(Caching2());

    // use the basic caching that mimics v2
    // t.using(Caching());

    // we can replace
    // t.on.send(NodeSend());
    // t.on.send(NodeSend(), "replace");

    // t3.on.send(NodeSend());

    // we can register multiple parse handlers to run in sequence
    // here we are doing some error checking??
    // TODO:: do we want a specific response validation step? seems maybe too specialized?
    // t.on.parse(async function (url: string, response: Response, result: any) {

    //     if (!response.ok) {
    //         // within these observers we just throw to indicate an unrecoverable error within the pipeline
    //         throw await HttpRequestError.init(response);
    //     }

    //     return [url, response, result];
    // });

    // t2.on.parse(async function (url: string, response: Response, result: any) {

    //     if (!response.ok) {
    //         // within these observers we just throw to indicate an unrecoverable error within the pipeline
    //         throw await HttpRequestError.init(response);
    //     }

    //     return [url, response, result];
    // });

    // // we can register multiple parse handlers to run in sequence
    // t.on.parse(async function (url: string, response: Response, result: any) {

    //     // only update result if not done?
    //     if (typeof result === "undefined") {
    //         result = await response.text();
    //     }

    //     // only update result if not done?
    //     if (typeof result !== "undefined") {
    //         result = JSON.parse(result);
    //     }

    //     return [url, response, result];
    // });

    // // we can register multiple parse handlers to run in sequence
    // t2.on.parse(async function (url: string, response: Response, result: any) {

    //     // only update result if not done?
    //     if (typeof result === "undefined") {
    //         result = await response.text();
    //     }

    //     // only update result if not done?
    //     if (typeof result !== "undefined") {
    //         result = JSON.parse(result);
    //     }

    //     return [url, response, result];
    // });

    // const uu = t2.clear.parse();

    // console.log(uu);

    // a passthrough handler for each moment is no longer required
    // t.on.post(async (url, result) => [url, result]);
    // t2.on.post(async (url, result) => [url, result]);

    // try {

    //     t.start().then(d => {
    //         console.log(d)
    //     });

    //     t2.start().then(d => {
    //         console.log(d)
    //     });

    //     await executeBatch();

    // } catch (e) {
    //     console.error("fail");
    //     console.error(e);
    // }



    // process.exit(0);
}
