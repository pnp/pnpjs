declare var require: (s: string) => any;
import * as chai from "chai";
import "mocha";
import { Util } from "@pnp/common";
import { Web, sp } from "@pnp/sp";
import { SPFetchClient } from "@pnp/nodejs";
import * as chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

// we need to load up the appropriate settings based on where we are running
let settings = null;
let mode = "cmd";
process.argv.forEach(s => {
    if (/^--pnp-test-mode/.test(s)) {
        mode = s.split("=")[1];
    }
});

switch (mode) {

    case "travis":

        const webTests = process.env.PnPTesting_ClientId && process.env.PnPTesting_ClientSecret && process.env.PnPTesting_SiteUrl;

        settings = {
            testing: {
                clientId: process.env.PnPTesting_ClientId,
                clientSecret: process.env.PnPTesting_ClientSecret,
                enableWebTests: webTests,
                notificationUrl: process.env.PnPTesting_NotificationUrl || null,
                siteUrl: process.env.PnPTesting_SiteUrl,
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

        settings = require("../../settings");

        break;
}

export let testSettings = Util.extend(settings.testing, { webUrl: "" });

before(function (done: MochaDone) {

    // this may take some time, don't timeout early
    this.timeout(90000);

    // establish the connection to sharepoint
    if (testSettings.enableWebTests) {

        sp.setup({
            sp: {
                fetchClientFactory: () => {
                    return new SPFetchClient(testSettings.siteUrl, testSettings.clientId, testSettings.clientSecret);
                },
            },
        });

        // comment this out to keep older subsites
        // cleanUpAllSubsites();

        // create the web in which we will test
        const d = new Date();
        const g = Util.getGUID();

        sp.web.webs.add(`PnP-JS-Core Testing ${d.toDateString()}`, g).then(() => {

            const url = Util.combinePaths(testSettings.siteUrl, g);

            // set the testing web url so our tests have access if needed
            testSettings.webUrl = url;

            // re-setup the node client to use the new web
            sp.setup({

                sp: {
                    // headers: {
                    //     "Accept": "application/json;odata=verbose",
                    // },
                    fetchClientFactory: () => {
                        return new SPFetchClient(url, testSettings.clientId, testSettings.clientSecret);
                    },
                },
            });

            done();
        }).catch(e => {

            console.log("Error creating testing sub-site: " + JSON.stringify(e));
            done();
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
export function cleanUpAllSubsites() {
    sp.site.rootWeb.webs.select("Title").get().then((w) => {
        w.forEach((element: any) => {
            const web = new Web(element["odata.id"], "");
            web.webs.select("Title").get().then((sw: any[]) => {
                return Promise.all(sw.map((value) => {
                    const web2 = new Web(value["odata.id"], "");
                    return web2.delete();
                }));
            }).then(() => { web.delete(); });
        });
    }).catch(e => console.log("Error: " + JSON.stringify(e)));
}
