import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { getGUID, combine, TimelinePipe } from "@pnp/core";
import { graph, IGraphConfigurationPart } from "@pnp/graph";
import { Queryable2, InjectHeaders, CachingPessimisticRefresh, DefaultParse } from "@pnp/queryable";
import { NodeFetchWithRetry, MSAL } from "@pnp/nodejs";
import { DefaultHeaders, DefaultInit, sp2, SPTagging } from "@pnp/sp";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import "mocha";
import * as findup from "findup-sync";
import { ISettings, ITestingSettings } from "./settings.js";
import { SPRest2 } from "@pnp/sp/rest-2.js";
import "@pnp/sp/webs";
import { IWebInfo } from "@pnp/sp/webs";

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

export function TestDefault(props: ISettings): TimelinePipe<Queryable2> {
    return (instance: Queryable2) => {

        instance.using(
            MSAL(props.sp.msal.init, props.sp.msal.scopes),
            DefaultHeaders(),
            DefaultInit(),
            NodeFetchWithRetry(),
            DefaultParse());

        instance.on.error((err) => {
            console.error(`🛑 PnPjs Testing Error - ${err.toString()}`);
        });

        instance.on.log(function (message, level) {
            if (level >= LogLevel.Warning) {
                console.log(`📃 PnPjs Log Level: ${level} - ${message}.`);
            }
        })

        return instance;
    };
}


async function spTestSetup(ts: ISettings): Promise<void> {
    let siteUsed = false;

    const tc = TestDefault(ts);
    ts.sp.webUrl = ts.sp.url;

    if (site && site.length > 0) {
        ts.sp.webUrl = site;
        siteUsed = true;
    }

    const mySP = sp2(ts.sp.webUrl).using(tc);
    _sp = mySP;

    if (siteUsed) { return; }

    const d = new Date();
    const g = getGUID();

    const testWebResult = await _sp.web.webs.add(`PnP-JS-Core Testing ${d.toDateString()}`, g);

    // set the testing web url so our tests have access if needed
    ts.sp.webUrl = testWebResult.data.Url;

    //TODO: Deal with verbose headers
    // if (spVerbose) {
    //     settingsPart.sp.headers = {
    //         "Accept": "application/json;odata=verbose",
    //     };
    // }

    _sp = sp2(ts.sp.webUrl).using(tc);
}

export const testSettings: ISettings = settings.testing;

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

        await cleanUpAllSubsites();

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
async function cleanUpAllSubsites(): Promise<void> {

    const w = await _sp.web.webs.select("Title")();

    w.forEach(async (e: IWebInfo) => {

        // const web = Web(e["odata.id"], "");

        // console.log(`Deleting: ${e["odata.id"]}`);

        // const children = await web.webs.select("Title")();

        // await Promise.all(children.map(async (value) => {
        //     const web2 = Web(value["odata.id"], "");
        //     console.log(`Deleting: ${value["odata.id"]}`);
        //     return web2.delete();
        // }));

        // await web.delete();

        // console.log(`Deleted: ${e["odata.id"]}`);
    });
}
