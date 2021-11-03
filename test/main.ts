import { delay, getGUID, TimelinePipe } from "@pnp/core";
import { IInvokable, Queryable, ThrowErrors } from "@pnp/queryable";
import { GraphDefault, SPDefault } from "@pnp/nodejs";
import { spfi } from "@pnp/sp";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import "mocha";
import findup from "findup-sync";
import { ISettings, ITestingSettings } from "./settings.js";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import { IWeb, IWebInfo } from "@pnp/sp/webs";
import { graphfi, GraphFI } from "@pnp/graph";
import { LogLevel } from "@pnp/logging";

chai.use(chaiAsPromised);

declare let process: any;
const testStart = Date.now();

let _sp: SPFI = null;
let _spRoot: SPFI = null;
let _graph: GraphFI = null;

// we need to load up the appropriate settings based on where we are running
let settings: ITestingSettings = null;
let mode = "cmd";
let site: string = null;
let skipWeb = false;
let deleteWeb = false;
let logging = false;
let deleteAllWebs = false;

// TODO: Add a switch for slow tests and then flag to skip slow tests during "normal" run
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
    }
}

console.log("*****************************");
console.log("Testing command args:");
console.log(`mode: ${mode}`);
console.log(`site: ${site}`);
console.log(`skipWeb: ${skipWeb}`);
console.log(`deleteWeb: ${deleteWeb}`);
console.log(`logging: ${logging}`);
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

// ** A custom Behavior to push logging onto a string array that can be used within a specific test */
export function TestReporting(report: string[]): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.error((err) => {
            if (logging) {
                report.push(`🛑 PnPjs Testing Error - ${err.toString()}`);
            }
        });

        instance.on.log(function (message, level) {
            if (level === LogLevel.Warning && logging) {
                report.push(`📃 PnPjs Log Level: ${level} - ${message}.`);
            }
        });

        return instance;
    };
}


async function spTestSetup(ts: ISettings): Promise<void> {
    let siteUsed = false;
    ts.sp.testWebUrl = ts.sp.url;

    if (site && site.length > 0) {
        ts.sp.testWebUrl = site;
        siteUsed = true;
    }
    // TODO: Clean up the addition of the ThrowErrors behavior if it gets added to default.
    const rootSP = spfi(ts.sp.testWebUrl).using(SPDefault({
        msal: {
            config: settings.testing.sp.msal.init,
            scopes: settings.testing.sp.msal.scopes,
        },
    })).using(ThrowErrors());
    _spRoot = rootSP;

    if (siteUsed) {
        _sp = _spRoot;
        return;
    }

    const d = new Date();
    const g = getGUID();

    const testWebResult = await _spRoot.web.webs.add(`PnP-JS-Core Testing ${d.toDateString()}`, g);

    // set the testing web url so our tests have access if needed
    ts.sp.testWebUrl = testWebResult.data.Url;

    _sp = spfi(ts.sp.testWebUrl).using(SPDefault({
        msal: {
            config: settings.testing.sp.msal.init,
            scopes: settings.testing.sp.msal.scopes,
        },
    })).using(ThrowErrors()); // .using(RequestRecorderCache(join("C:/github/@pnp-fork", ".test-recording"), "record", () => false));
}

async function graphTestSetup(): Promise<void> {
    _graph = graphfi().using(GraphDefault({
        msal: {
            config: settings.testing.graph.msal.init,
            scopes: settings.testing.graph.msal.scopes,
        },
    })).using(ThrowErrors()); // .using(RequestRecorderCache(join("C:/github/@pnp-fork", ".test-recording"), "record", () => false));
}

export const testSettings: ISettings = settings.testing;

export const getSP = function (): SPFI {
    return _sp;
};

export const getGraph = function (): GraphFI {
    return _graph;
};

before("Setup Testing", async function () {

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

        if (testSettings.graph) {
            console.log("Setting up Graph tests...");
            const s = Date.now();
            await graphTestSetup();
            const e = Date.now();
            console.log(`Setup Graph tests in ${((e - s) / 1000).toFixed(4)} seconds.`);
        }
    }
});

after("Finalize Testing", async function () {
    // this may take some time, don't timeout early
    this.timeout(120000);

    const testEnd = Date.now();
    console.log(`\n\n\n\nEnding...\nTesting completed in ${((testEnd - testStart) / 1000).toFixed(4)} seconds. \n`);

    if (deleteAllWebs) {

        await cleanUpAllSubsites(_spRoot.web);

    } else if (deleteWeb && testSettings.enableWebTests) {
        console.log(`Deleting web ${_sp.web.toUrl()} created during testing.`);

        const web = await _sp.web;
        await cleanUpAllSubsites(web);

        console.log("All subsites have been removed.");

        // Delay so that web can be deleted
        await delay(500);

        await _sp.web.delete();

        console.log(`Deleted web ${testSettings.sp.testWebUrl} created during testing.`);

    } else if (testSettings.enableWebTests) {

        console.log(`Leaving ${testSettings.sp.testWebUrl} alone.`);
    }

    console.log("All done. Have a nice day :)");
});

// Function deletes all test subsites
async function cleanUpAllSubsites(spObj: IWeb & IInvokable<any>): Promise<void> {
    try {
        const w = await spObj.webs();
        if (w != null && w.length > 0) {
            console.log(`${w.length} subwebs were found.`);
            w.forEach(async (e: IWebInfo) => {

                const spObjSub = spfi(e["odata.id"]).using(SPDefault({
                    msal: {
                        config: settings.testing.sp.msal.init,
                        scopes: settings.testing.sp.msal.scopes,
                    },
                }));

                console.log(`Deleting: ${e["odata.id"]}`);

                await cleanUpAllSubsites(spObjSub.web);

                // Delay so that web can be deleted
                await delay(500);

                await spObjSub.web.delete();

                console.log(`Deleted: ${e["odata.id"]}`);
            });
        } else {
            console.log(`No subwebs found for site ${spObj.toUrl()}`);
        }
    } catch (err) {
        console.log(`Error cleaning up sub sites for ${spObj.toUrl()} - ${err.message}`);
    }
    return;
}
