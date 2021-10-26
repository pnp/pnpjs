import { ITestingSettings } from "../../test/settings.js";
import { GraphDefault, SPDefault } from "@pnp/nodejs";
import { LogLevel, PnPLogging } from "@pnp/logging";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/appcatalog";
import "@pnp/sp/navigation";
import { Web } from "@pnp/sp/webs";
import { AssignFrom, CopyFrom } from "@pnp/core";
import { RequestRecorderCache } from "../../test/test-recorder.js";
import { join } from "path";

declare var process: { exit(code?: number): void };

export async function Example(settings: ITestingSettings) {

    // global logging subscribe for messages, included in usings per instance with different levels available per instance
    // already done in ./main.ts ::> Logger.subscribe(ConsoleListener());

    // try {

    //     const graph2 = graph().using(GraphDefault({
    //         msal: {
    //             config: settings.testing.graph.msal.init,
    //             scopes: settings.testing.graph.msal.scopes,
    //         },
    //     })).using(PnPLogging(LogLevel.Verbose));

    //     const [batchedGraph, execute] = graph2.batched();

    //     let res = [];

    //     batchedGraph.users().then(r => res.push(r));

    //     batchedGraph.groups().then(r => res.push(r));

    //     await execute();

    //     console.log(res);

    // } catch (e) {

    //     console.error(e);
    // }

    try {

        const recordingPath = join("C:/github/@pnp-fork", ".test-recording");

        const sp2 = spfi("https://318studios.sharepoint.com/sites/dev").using(SPDefault({
            msal: {
                config: settings.testing.sp.msal.init,
                scopes: settings.testing.sp.msal.scopes,
            },
        })).using(PnPLogging(LogLevel.Verbose)); //.using(RequestRecorderCache(recordingPath, "record", () => false));

        // const nav = sp2.navigation;

        // console.log(JSON.stringify(v));

    } catch (e) {

        console.error(e);
    }

    // const [batchedSP, execute] = sp2.batched();

    // let res = [];

    // batchedSP.web().then(r => res.push(r));

    // batchedSP.web.lists().then(r => res.push(r));

    // await execute();

    // try {

    //     // https://318studios.sharepoint.com/sites/dev/1844b17e-9287-4b63-afa8-08b02f283b1f

    //     const sp2 = sp("https://318studios.sharepoint.com/sites/dev").using(SPDefault({
    //         msal: {
    //             config: settings.testing.sp.msal.init,
    //             scopes: settings.testing.sp.msal.scopes,
    //         },
    //     })).using(PnPLogging(LogLevel.Verbose));


    //     const w = sp2.web;
    //     w.on.init(function (this: Queryable) {

    //         this.on.post(async function (this: Queryable, url: URL, result: any) {

    //             console.log("I am being called!");

    //             return [url, result];
    //         });

    //         return this;

    //     });

    //     const w2 = await w.select("Title")<{ Title: string }>();

    //     // const q = await w.syncSolutionToTeams("asd");

    //     console.log(`here: ${JSON.stringify(w2)}`);

    // } catch (e) {

    //     console.error(e);
    // }


    // extendFactory(Web, {

    //     execute: () => {

    //         console.log("maybe?");
    //     },
    // });


    // TODO:: can this replace extend factory?? sorta
    // w.on.init(function (this: IWeb) {

    //     const o = extend(this, {

    //         async execute(): Promise<any> {
    //             console.log("HA HA");
    //         },
    //     });

    //     return o;
    // });


    // const yyy = await w();

    // console.log(`here: ${JSON.stringify(yyy)}`);


    // const [batch, execute] = sp.createBatch();

    // // this model removes the difficulty of knowing when to call usingBatch and instead you call it upfront each time
    // sp.using(batch).web();

    // sp.using(batch).web.features.getById("e3dc7334-cec0-4d2c-8b90-e4857698fc4e").deactivate();

    // await execute();

    // function TestInitBehavior(): (instance: Queryable2) => Queryable2 {

    //     return (instance: Queryable2) => {

    //         // instance.on.init(function (this: Queryable2) {

    //         //     const o = extend(this, {

    //         //         async execute(): Promise<any> {
    //         //             console.log("HA HA");
    //         //         },
    //         //     });

    //         //     return o;
    //         // });

    //         instance.on.dispose(function (this: Queryable2) {

    //             // TODO:: Need a way to remove extentions

    //            this.log("I am in dispose.", 1);

    //            return this;
    //         });

    //         instance.on.pre(async function (url, init, result) {

    //             this.log("PRE FROM TestInitBehavior", LogLevel.Warning);                        

    //             return [url, init, result];
    //         });

    //         instance.on.post.prepend(async function (url, result) {

    //             this.log("POST FROM TestInitBehavior", LogLevel.Warning);   

    //             return [url, result];
    //         });

    //         return instance;
    //     };
    // }

    // function testingConfig(settings: ITestingSettings): (instance: Queryable2) => Queryable2 {

    //     return (instance) => {

    //         instance
    //             .using(MSAL(settings.testing.sp.msal.init, settings.testing.sp.msal.scopes))
    //             .using(InjectHeaders({
    //                 "Accept": "application/json",
    //                 "Content-Type": "application/json;charset=utf-8",
    //                 "User-Agent": "NONISV|SharePointPnP|PnPjs",
    //                 "X-ClientService-ClientTag": "PnPCoreJS:3.0.0-exp",
    //             }))
    //             .using(NodeFetchWithRetry())
    //             // .using(NodeFetchWithRetry(2))
    //             // .using(NodeFetch())
    //             .using(DefaultParse())
    //             // .using(TextParse())
    //             // .using(JSONParse())
    //             // .using(Proxy("https://127.0.0.1:8888"))
    //             // .using(Caching("session", true))
    //             .using(TestInitBehavior())
    //             .on.pre(async function (url, init, result) {

    //                 // extend(this, {
    //                 //     execute: ""
    //                 // });

    //                 // TODO:: replacement for isAbsolute? SHould this be its own behavior?
    //                 if (!isUrlAbsolute(url)) {
    //                     url = (new URL(url, settings.testing.sp.url)).toString();
    //                 }

    //                 init.cache = "no-cache";
    //                 init.credentials = "same-origin";

    //                 return [url, init, result];
    //             })
    //             .on.error((err) => {
    //                 console.error("caught it");
    //                 console.error(err);
    //             })
    //             .on.log(function (message, level) {

    //                 if (level >= LogLevel.Verbose) {

    //                     console.log(`${Date.now()}: ${message}`);
    //                 }

    //             }).on.post(async (_url: URL, result: any) => {

    //                 console.log(JSON.stringify(result));

    //                 return [_url, result];

    //             });

    //         return instance;
    //     };
    // }

    // TODO:: need to work on the inheritance and ensuring the right events are fired for 
    // on data etc and that requests are really going out.
    // w.on.post(async (url: URL, result: any) => {

    //     console.log("I am here!");

    //     return [url, result];
    // });

    // const u = await w();

    // // TODO:: right now this request isn't sent because sp4 shares the data observers with sp3 due to inheritance so once the first
    // // request resolves the second also instantly resolves. In this case it is the same request, but later it wouldn't be
    // const uu = await sp4.web();


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
