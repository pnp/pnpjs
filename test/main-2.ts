import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { getGUID, combine } from "@pnp/core";
import { graph, IGraphConfigurationPart } from "@pnp/graph";
import { Queryable2, InjectHeaders, CachingPessimisticRefresh, DefaultParse } from "@pnp/queryable";
import { NodeFetchWithRetry, MSAL } from "@pnp/nodejs";
import { sp2 } from "@pnp/sp";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import "mocha";
import * as findup from "findup-sync";
import { ISettings, ITestingSettings } from "./settings.js";
import { SPRest2 } from "@pnp/sp/rest-2.js";
import "@pnp/sp/webs";

chai.use(chaiAsPromised);

declare let process: any;
const testStart = Date.now();

let _sp: SPRest2 = null;

// we need to load up the appropriate settings based on where we are running
let settings: ITestingSettings = null;
let mode = "cmd";
let site: string = null;
let skipWeb = false;
let deleteWeb = false;
let logging = false;
let spVerbose = false;
let deleteAllWebs = false;

for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (/^--mode/i.test(arg)) {
        switch (process.argv[++i]) {
            case "pr":
                mode = "online-noweb";
                break;
            case "push":
                mode = "online";
        }
    }
    if (/^--site/i.test(arg)) {
        site = process.argv[++i];
    }
    if (/^--skip-web/i.test(arg)) {
        skipWeb = true;
    }
    if (/^--cleanup/i.test(arg)) {
        deleteWeb = true;
    }
    if (/^--deleteAllWebs/i.test(arg)) {
        deleteAllWebs = true;
    }
    if (/^--logging/i.test(arg)) {
        logging = true;
        Logger.activeLogLevel = LogLevel.Info;
        Logger.subscribe(new ConsoleListener());
    }
    if (/^--spverbose/i.test(arg)) {
        spVerbose = true;
    }
}

console.log("*****************************");
console.log("Testing command args:");
console.log(`mode: ${mode}`);
console.log(`site: ${site}`);
console.log(`skipWeb: ${skipWeb}`);
console.log(`deleteWeb: ${deleteWeb}`);
console.log(`logging: ${logging}`);
console.log(`spVerbose: ${spVerbose}`);
console.log("useMSAL: true");
console.log("*****************************");

function readEnvVar(key: string, parse = false): any {

    const b = process.env[key];
    if (typeof b !== "string" || b.length < 1) {
        console.error(`Environment var ${key} not found.`);
    }

    if (!parse) {
        return b;
    }

    try {
        return JSON.parse(b);
    } catch (e) {
        console.error(`Error parsing env var ${key}. ${e.message}`);
    }
}

switch (mode) {

    case "online":

        settings = {
            testing: {
                enableWebTests: true,
                graph: {
                    msal: {
                        init: readEnvVar("PNPTESTING_MSAL_GRAPH_CONFIG", true),
                        scopes: readEnvVar("PNPTESTING_MSAL_GRAPH_SCOPES", true),
                    },
                },
                sp: {
                    msal: {
                        init: readEnvVar("PNPTESTING_MSAL_SP_CONFIG", true),
                        scopes: readEnvVar("PNPTESTING_MSAL_SP_SCOPES", true),
                    },
                    notificationUrl: readEnvVar("PNPTESTING_NOTIFICATIONURL") || null,
                    url: readEnvVar("PNPTESTING_SITEURL"),
                },
            },
        };

        break;
    case "online-noweb":

        settings = {
            testing: {
                enableWebTests: false,
            },
        };

        break;
    default:

        settings = require(findup("settings.js"));
        if (skipWeb) {
            settings.testing.enableWebTests = false;
        }

        break;
}


function spTestBehavior(ts: ISettings): (instance: Queryable2) => Queryable2 {
    return (instance) => {
        instance
            .using(MSAL(ts.sp.msal.init, ts.sp.msal.scopes))
            .using(InjectHeaders({
                "Accept": "application/json",
                "Content-Type": "application/json;odata=verbose;charset=utf-8",
                "User-Agent": "NONISV|SharePointPnP|PnPjs",
                "X-ClientService-ClientTag": "PnPCoreJS:3.0.0-exp",
            }))
            .using(NodeFetchWithRetry())
            .using(DefaultParse())
            .using(CachingPessimisticRefresh("session"))
            .on.error((err) => {
                console.error("caught it");
                console.error(`🛑 PnPjs Test Error Behaviors/Queryable - ${err.toString()}`);
            })
            .on.log(function (message, level) {

                if (level >= LogLevel.Verbose) {

                    console.log(`📃 PnPjs Log Level: ${level} - ${message}.`);
                }

            }).on.post(async (_url: URL, result: any) => {
                console.log("📨 RESULT:");
                console.log(JSON.stringify(result));

                return [_url, result];

            });

        return instance;
    };
}

async function spTestSetup(ts: ISettings): Promise<void> {
    let siteUsed = false;

    const tc = spTestBehavior(ts);
    ts.sp.webUrl = ts.sp.url;

    if (site && site.length > 0) {
        ts.sp.webUrl = site;
        siteUsed = true;
    }

    const mySP = sp2(ts.sp.webUrl).using(tc);
    const webTesta = await mySP.web();
    console.log(JSON.stringify(webTesta));
    _sp = mySP;

    if (siteUsed) { return; }

    const d = new Date();
    const g = getGUID();

    const testWebResult = await _sp.web.webs.add(`PnP-JS-Core Testing ${d.toDateString()}`, g);

    const url = combine(ts.sp.url, g);

    // set the testing web url so our tests have access if needed
    ts.sp.webUrl = testWebResult.data.Url;

    //TODO: Deal with verbose headers
    // if (spVerbose) {
    //     settingsPart.sp.headers = {
    //         "Accept": "application/json;odata=verbose",
    //     };
    // }

    _sp = sp2(ts.sp.webUrl).using(tc);
    const webTest = await _sp.web();

    console.log(JSON.stringify(webTest));
}

// async function spTestSetup(ts: ISettings): Promise<void> {

//     // create skeleton settings
//     const settingsPart: Partial<ISPConfigurationPart> = {
//         sp: {
//             baseUrl: ts.sp.url,
//             fetchClientFactory: null,
//             headers: {},
//         },
//     };

//     let siteUsed = false;

//     if (typeof ts.sp.msal === "undefined") {
//         throw Error("No MSAL settings defined for sp but useMSAL flag set to true.");
//     }

//     settingsPart.sp.fetchClientFactory = () => {
//         return new MsalFetchClient(ts.sp.msal.init, ts.sp.msal.scopes);
//     };

//     if (site && site.length > 0) {

//         settingsPart.sp.baseUrl = site;

//         // and we will just use this as the url
//         ts.sp.webUrl = site;
//         siteUsed = true;
//     }

//     // do initial setup
//     sp.setup(settingsPart);

//     // if we had a site specified we don't need to create one for testing
//     if (siteUsed) {
//         return;
//     }

//     // create the web in which we will test
//     const d = new Date();
//     const g = getGUID();

//     await sp.web.webs.add(`PnP-JS-Core Testing ${d.toDateString()}`, g);

//     const url = combine(ts.sp.url, g);

//     // set the testing web url so our tests have access if needed
//     ts.sp.webUrl = url;
//     settingsPart.sp.baseUrl = url;

//     if (spVerbose) {
//         settingsPart.sp.headers = {
//             "Accept": "application/json;odata=verbose",
//         };
//     }

//     // re-setup the node client to use the new web
//     sp.setup(settingsPart);
// }

// async function graphTestSetup(ts: ISettings): Promise<void> {

//     const settingsPart: IGraphConfigurationPart = {
//         graph: {
//             fetchClientFactory: null,
//         },
//     };

//     if (typeof ts.graph.msal === "undefined") {
//         throw Error("No MSAL settings defined for graph but useMSAL flag set to true.");
//     }

//     settingsPart.graph.fetchClientFactory = () => {
//         return new MsalFetchClient(ts.graph.msal.init, ts.graph.msal.scopes);
//     };

//     graph.setup(settingsPart);
// }

export const testSettings: ISettings = settings.testing;
// if (testSettings.enableWebTests) {
//     testSettings.sp.webUrl = "";
// }


export const getSP = () => {
    return _sp;
}

before(async function (): Promise<void> {

    // this may take some time, don't timeout early
    this.timeout(90000);

    // establish the connection to sharepoint
    if (testSettings.enableWebTests) {

        if (testSettings.sp) {
            console.log("Setting up SharePoint tests...");
            const s = Date.now();
            await spTestSetup(testSettings);
            const e = Date.now();
            console.log(`Setup SharePoint tests in ${((e - s) / 1000).toFixed(4)} seconds.`);
        }

        //TODO: Fix graph
        // if (testSettings.graph) {
        //     console.log("Setting up Graph tests...");
        //     const s = Date.now();
        //     await graphTestSetup(testSettings);
        //     const e = Date.now();
        //     console.log(`Setup Graph tests in ${((e - s) / 1000).toFixed(4)} seconds.`);
        // }
    }
});

after(async () => {

    console.log();
    console.log();
    console.log();
    console.log();
    console.log("Ending...");
    const testEnd = Date.now();
    console.log(`Testing completed in ${((testEnd - testStart) / 1000).toFixed(4)} seconds.`);
    console.log();

    if (deleteAllWebs) {

        //await cleanUpAllSubsites();

    } else if (deleteWeb && testSettings.enableWebTests) {

        //TODO: Clean up Delete function
        // console.log(`Deleting web ${testSettings.sp.webUrl} created during testing.`);
        // const w = Web(testSettings.sp.webUrl);

        // const children = await w.webs.select("Title")();

        // await Promise.all(children.map((value) => {
        //     const web2 = Web(value["odata.id"], "");
        //     console.log(`Deleting: ${value["odata.id"]}`);
        //     return web2.delete();
        // }));

        // await w.delete();
        // console.log(`Deleted web ${testSettings.sp.webUrl} created during testing.`);

    } else if (testSettings.enableWebTests) {

        console.log(`Leaving ${testSettings.sp.webUrl} alone.`);
    }

    console.log("All done. Have a nice day :)");
});

// Function deletes all test subsites
//TODO: Clean up subsites function
// async function cleanUpAllSubsites(): Promise<void> {

//     const w = await sp.site.rootWeb.webs.select("Title")();

//     w.forEach(async (e: any) => {

//         const web = Web(e["odata.id"], "");

//         console.log(`Deleting: ${e["odata.id"]}`);

//         const children = await web.webs.select("Title")();

//         await Promise.all(children.map(async (value) => {
//             const web2 = Web(value["odata.id"], "");
//             console.log(`Deleting: ${value["odata.id"]}`);
//             return web2.delete();
//         }));

//         await web.delete();

//         console.log(`Deleted: ${e["odata.id"]}`);
//     });
// }
