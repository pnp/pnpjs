import { ITestingSettings } from "../../test/settings.js";
import { ConsoleListener, Logger, LogLevel } from "@pnp/logging";
import { Queryable2, InjectHeaders, Caching, HttpRequestError, createBatch, PnPLogging, get, extendObj } from "@pnp/queryable";
import { NodeFetchWithRetry, MSAL, Proxy, NodeFetch } from "@pnp/nodejs";
import { combine, isFunc, getHashCode, PnPClientStorage, dateAdd, isUrlAbsolute } from "@pnp/common";
import { DefaultParse, JSONParse, TextParse } from "@pnp/queryable";
import { sp2 } from "@pnp/sp";
import "@pnp/sp/webs";
import { WebPartDefinition } from "@pnp/sp/webparts/types.js";

declare var process: { exit(code?: number): void };

function testingConfig(settings: ITestingSettings): (instance: Queryable2) => Queryable2 {

    return (instance) => {

        instance
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
            .using(Caching("session", true))
            .on.pre(async function (url, init, result) {

                extendObj(this, {
                    execute: ""
                });

                // TODO:: replacement for isAbsolute? SHould this be its own behavior?
                if (!isUrlAbsolute(url)) {
                    url = (new URL(url, settings.testing.sp.url)).toString();
                }

                init.cache = "no-cache";
                init.credentials = "same-origin";

                return [url, init, result];
            })
            .on.error((err) => {
                console.error("caught it");
                console.error(err);
            })
            .on.log(function (message, level) {

                if (level >= LogLevel.Info) {

                    console.log(`Cheap log: ${message}.`);
                }


            }).on.post(async (_url: URL, result: any) => {

                console.log(JSON.stringify(result));

                return [_url, result];

            });

        return instance;
    };
}


export async function Example(settings: ITestingSettings) {

    // TODO:: a way to wrap up different sets of configurations like below.
    // Need a lib default, plus others like Node default, etc.
    // Maybe a default with caching always on, etc.

    // sp2.using(testingConfig(settings));

    const sp3 = sp2(settings.testing.sp.url);

    sp3.using(testingConfig(settings));

    const sp4 = sp2(sp3.web);

    // const testingRoot = new Queryable2(settings.testing.sp.url, "_api/web");

    // testingRoot.using();


    // const t2 = new Queryable2(testingRoot, "lists");

    // t2.query.set("$select", "title,description");



    // t2.query.set("Test429", "true");

    // TODO:: need to track if timeline is active and create a running clone of the timeline or how 
    // do we handle the case where a timeline modifies itself?
    // t2.resetObservers();

    // sending a request uses one of the helper methods get(), post(), put(), delete(), etc.
    try {

        const w = sp3.web;

        // TODO:: need to work on the inheritance and ensuring the right events are fired for 
        // on data etc and that requests are really going out.
        w.on.post(async (url: URL, result: any) => {

            console.log("I am here!");

            return [url, result];
        });

        const u = await w();

        // TODO:: right now this request isn't sent because sp4 shares the data observers with sp3 due to inheritance so once the first
        // request resolves the second also instantly resolves. In this case it is the same request, but later it wouldn't be
        const uu = await sp4.web();

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
