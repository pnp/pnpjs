// import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { getGUID, combine, assign } from "@pnp/common";
import { graph } from "@pnp/graph";
import { AdalFetchClient, SPFetchClient } from "@pnp/nodejs";
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import "mocha";
import * as findup from "findup-sync";

chai.use(chaiAsPromised);

declare var process: any;

// Logger.activeLogLevel = LogLevel.Verbose;
// Logger.subscribe(new ConsoleListener());

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
        sitedesigns?: { testuser: string }
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

for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (/^--pnp-test-mode/i.test(arg)) {
        mode = process.argv[++i];
    }
    if (/^--pnp-test-site/i.test(arg)) {
        site = process.argv[++i];
    }
    if (/^--skip-web/i.test(arg)) {
        skipWeb = true;
    }
}

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

before(function (done: MochaDone) {

    // this may take some time, don't timeout early
    this.timeout(90000);

    // establish the connection to sharepoint
    if (testSettings.enableWebTests) {

        Promise.all([
            // un comment this to delete older subsites
            // cleanUpAllSubsites(),
            spTestSetup(testSettings),
            graphTestSetup(testSettings),
        ]).then(_ => done()).catch(e => {

            console.log("Error creating testing sub-site: " + JSON.stringify(e));
            done(e);
        });
    } else {
        done();
    }
});

after(() => {

    // could remove the sub web here?
    // clean up other stuff?
    // write some logging?
});

// this can be used to clean up lots of test sub webs :)
// function cleanUpAllSubsites(): Promise<void> {
//     return sp.site.rootWeb.webs.select("Title").get().then((w) => {
//         w.forEach((element: any) => {
//             const web = Web(element["odata.id"], "");
//             web.webs.select("Title").get().then((sw: any[]) => {
//                 return Promise.all(sw.map((value) => {
//                     const web2 = Web(value["odata.id"], "");
//                     return web2.delete();
//                 }));
//             }).then(() => { web.delete(); });
//         });
//     });
// }
