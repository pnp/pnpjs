import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { getGUID, combine, assign } from "@pnp/common";
import { graph } from "@pnp/graph";
import { SPFetchClient, AdalFetchClient } from "@pnp/nodejs";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import "mocha";
import * as findup from "findup-sync";
import { Web } from "@pnp/sp/webs";

chai.use(chaiAsPromised);

declare var process: any;
const testStart = Date.now();

export interface ISettingsTestingPart {
    enableWebTests: boolean;
    graph?: {
        id: string;
        secret: string;
        tenant: string;
    };
    sp?: {
        webUrl?: string;
        id: string;
        notificationUrl: string | null;
        secret: string;
        url: string;
    };
}

export interface ISettings {
    testing: ISettingsTestingPart;
}

// we need to load up the appropriate settings based on where we are running
let settings: ISettings = null;
let mode = "cmd";
let site: string = null;
let skipWeb = false;
let deleteWeb = false;
let logging = false;
let deleteAllWebs = false;

for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (/^--mode/i.test(arg)) {
        switch (process.argv[++i]) {
            case "pr":
                mode = "travis-noweb";
                break;
            case "push":
                mode = "travis";
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
}

console.log(`*****************************`);
console.log("Testing command args:");
console.log(`mode: ${mode}`);
console.log(`site: ${site}`);
console.log(`skipWeb: ${skipWeb}`);
console.log(`deleteWeb: ${deleteWeb}`);
console.log(`logging: ${logging}`);
console.log(`*****************************`);

switch (mode) {

    case "travis":

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

        break;
    case "travis-noweb":

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

function spTestSetup(ts: ISettingsTestingPart): Promise<void> {

    return new Promise((resolve, reject) => {
        if (site && site.length > 0) {
            // we have a site url provided, we'll use that
            sp.setup({
                sp: {
                    fetchClientFactory: () => {
                        return new SPFetchClient(site, ts.sp.id, ts.sp.secret);
                    },
                },
            });
            ts.sp.webUrl = site;
            return resolve();
        }

        sp.setup({
            sp: {
                fetchClientFactory: () => {
                    return new SPFetchClient(ts.sp.url, ts.sp.id, ts.sp.secret);
                },
            },
        });

        // create the web in which we will test
        const d = new Date();
        const g = getGUID();

        sp.web.webs.add(`PnP-JS-Core Testing ${d.toDateString()}`, g).then(() => {

            const url = combine(ts.sp.url, g);

            // set the testing web url so our tests have access if needed
            ts.sp.webUrl = url;

            // re-setup the node client to use the new web
            sp.setup({

                sp: {
                    // headers: {
                    //     "Accept": "application/json;odata=verbose",
                    // },
                    fetchClientFactory: () => {
                        return new SPFetchClient(url, ts.sp.id, ts.sp.secret);
                    },
                },
            });

            resolve();

        }).catch(e => reject(e));
    });
}

function graphTestSetup(ts: ISettingsTestingPart): Promise<void> {

    return new Promise((resolve) => {

        graph.setup({
            graph: {
                fetchClientFactory: () => {
                    return new AdalFetchClient(ts.graph.tenant, ts.graph.id, ts.graph.secret);
                },
            },
        });

        resolve();
    });
}

export let testSettings: ISettingsTestingPart = assign(settings.testing, { webUrl: "" });

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
