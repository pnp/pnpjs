import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { getGUID, combine } from "@pnp/common";
import { graph, IGraphConfigurationPart } from "@pnp/graph";
import { SPFetchClient, AdalFetchClient, MsalFetchClient } from "@pnp/nodejs";
import { ISPConfigurationPart, sp } from "@pnp/sp";
import "@pnp/sp/webs";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import "mocha";
import * as findup from "findup-sync";
import { Web } from "@pnp/sp/webs";
import { ISettings, ITestingSettings } from "./settings";

chai.use(chaiAsPromised);

declare var process: any;
const testStart = Date.now();

// we need to load up the appropriate settings based on where we are running
let settings: ITestingSettings = null;
let mode = "cmd";
let site: string = null;
let skipWeb = false;
let deleteWeb = false;
let logging = false;
let spVerbose = false;
let useMSAL = false;
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
    if (/^--msal/i.test(arg)) {
        useMSAL = true;
    }
}

console.log(`*****************************`);
console.log("Testing command args:");
console.log(`mode: ${mode}`);
console.log(`site: ${site}`);
console.log(`skipWeb: ${skipWeb}`);
console.log(`deleteWeb: ${deleteWeb}`);
console.log(`logging: ${logging}`);
console.log(`spVerbose: ${spVerbose}`);
console.log(`useMSAL: ${useMSAL}`);
console.log(`*****************************`);

switch (mode) {

    case "online":

        if (useMSAL) {

            settings = {
                testing: {
                    enableWebTests: true,
                    graph: {
                        msal: {
                            init: JSON.parse(process.env.PnPTesting_MSAL_Graph_Config),
                            scopes: JSON.parse(process.env.PnPTesting_MSAL_Graph_Scopes),
                        },
                    },
                    sp: {
                        msal: {
                            init: JSON.parse(process.env.PnPTesting_MSAL_SP_Config),
                            scopes: JSON.parse(process.env.PnPTesting_MSAL_SP_Scopes),
                        },
                        notificationUrl: process.env.PnPTesting_NotificationUrl || null,
                        url: process.env.PnPTesting_SiteUrl,
                    },
                },
            };

        } else {

            settings = {
                testing: {
                    enableWebTests: true,
                    graph: {
                        id: "",
                        secret: "",
                        tenant: "",
                    },
                    sp: {
                        id: process.env.PnPTesting_ClientId,
                        notificationUrl: process.env.PnPTesting_NotificationUrl || null,
                        secret: process.env.PnPTesting_ClientSecret,
                        url: process.env.PnPTesting_SiteUrl,
                    },
                },
            };
        }

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

async function spTestSetup(ts: ISettings): Promise<void> {

    // create skeleton settings
    const settingsPart: ISPConfigurationPart = {
        sp: {
            baseUrl: ts.sp.url,
        },
    };

    let siteUsed = false;

    if (useMSAL) {

        if (typeof ts.sp.msal === "undefined") {
            throw Error("No MSAL settings defined for sp but useMSAL flag set to true.");
        }

        settingsPart.sp.fetchClientFactory = () => {
            return new MsalFetchClient(ts.sp.msal.init, ts.sp.msal.scopes);
        };

    } else {

        if (site && site.length > 0) {

            settingsPart.sp.fetchClientFactory = () => {
                return new SPFetchClient(site, ts.sp.id, ts.sp.secret);
            };

            settingsPart.sp.baseUrl = site;

            // and we will just use this as the url
            ts.sp.webUrl = site;
            siteUsed = true;

        } else {

            settingsPart.sp.fetchClientFactory = () => {
                return new SPFetchClient(ts.sp.url, ts.sp.id, ts.sp.secret);
            };
        }
    }

    // do initial setup
    sp.setup(settingsPart);

    // if we had a site specified we don't need to create one for testing
    if (siteUsed) {
        return;
    }

    // create the web in which we will test
    const d = new Date();
    const g = getGUID();

    await sp.web.webs.add(`PnP-JS-Core Testing ${d.toDateString()}`, g);

    const url = combine(ts.sp.url, g);

    // set the testing web url so our tests have access if needed
    ts.sp.webUrl = url;
    settingsPart.sp.baseUrl = url;

    if (!useMSAL) {
        settingsPart.sp.fetchClientFactory = () => {
            return new SPFetchClient(url, ts.sp.id, ts.sp.secret);
        };
    }

    if (spVerbose) {
        settingsPart.sp.headers = {
            "Accept": "application/json;odata=verbose",
        };
        console.log("I think we set verbose.");
    }

    // re-setup the node client to use the new web
    sp.setup(settingsPart);
}

async function graphTestSetup(ts: ISettings): Promise<void> {

    const settingsPart: IGraphConfigurationPart = { graph: {} };

    if (useMSAL) {

        if (typeof ts.graph.msal === "undefined") {
            throw Error("No MSAL settings defined for graph but useMSAL flag set to true.");
        }

        settingsPart.graph.fetchClientFactory = () => {
            return new MsalFetchClient(ts.graph.msal.init, ts.graph.msal.scopes);
        };

    } else {

        settingsPart.graph.fetchClientFactory = () => {
            return new AdalFetchClient(ts.graph.tenant, ts.graph.id, ts.graph.secret);
        };
    }

    graph.setup(settingsPart);
}

export let testSettings: ISettings = settings.testing;
// if (testSettings.enableWebTests) {
//     testSettings.sp.webUrl = "";
// }

before(async function (): Promise<void> {

    // this may take some time, don't timeout early
    this.timeout(90000);

    // establish the connection to sharepoint
    if (testSettings.enableWebTests) {

        if (testSettings.sp) {
            console.log(`Setting up SharePoint tests...`);
            const s = Date.now();
            await spTestSetup(testSettings);
            const e = Date.now();
            console.log(`Setup SharePoint tests in ${((e - s) / 1000).toFixed(4)} seconds.`);
        }

        if (testSettings.graph) {
            console.log(`Setting up Graph tests...`);
            const s = Date.now();
            await graphTestSetup(testSettings);
            const e = Date.now();
            console.log(`Setup Graph tests in ${((e - s) / 1000).toFixed(4)} seconds.`);
        }
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

        console.log(`Deleting web ${testSettings.sp.webUrl} created during testing.`);
        const w = Web(testSettings.sp.webUrl);

        const children = await w.webs.select("Title")();

        await Promise.all(children.map((value) => {
            const web2 = Web(value["odata.id"], "");
            console.log(`Deleting: ${value["odata.id"]}`);
            return web2.delete();
        }));

        await w.delete();
        console.log(`Deleted web ${testSettings.sp.webUrl} created during testing.`);

    } else if (testSettings.enableWebTests) {

        console.log(`Leaving ${testSettings.sp.webUrl} alone.`);
    }

    console.log("All done. Have a nice day :)");
});

// Function deletes all test subsites
async function cleanUpAllSubsites(): Promise<void> {

    const w = await sp.site.rootWeb.webs.select("Title")();

    w.forEach(async (e: any) => {

        const web = Web(e["odata.id"], "");

        console.log(`Deleting: ${e["odata.id"]}`);

        const children = await web.webs.select("Title")();

        await Promise.all(children.map(async (value) => {
            const web2 = Web(value["odata.id"], "");
            console.log(`Deleting: ${value["odata.id"]}`);
            return web2.delete();
        }));

        await web.delete();

        console.log(`Deleted: ${e["odata.id"]}`);
    });
}
