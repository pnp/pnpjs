declare var require: (s: string) => any;
import * as chai from "chai";
import "mocha";
import pnp from "../src/pnp";
import { Util } from "../src/utils/util";
import { Web } from "../src/sharepoint/webs";
import { NodeFetchClient } from "../src/net/nodefetchclient";
import * as chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

// we need to load up the appropriate settings based on where we are running
var settings = null;
var mode = "cmd";
process.argv.forEach(s => {
    if (/^--pnp-test-mode/.test(s)) {
        mode = s.split("=")[1];
    }
});

switch (mode) {

    case "travis":
        let webTests = process.env.PnPTesting_ClientId && process.env.PnPTesting_ClientSecret && process.env.PnPTesting_SiteUrl;

        settings = {
            testing: {
                clientId: process.env.PnPTesting_ClientId,
                clientSecret: process.env.PnPTesting_ClientSecret,
                enableWebTests: webTests,
                siteUrl: process.env.PnPTesting_SiteUrl,
                notificationUrl: process.env.PnPTesting_NotificationUrl || null,
            }
        };

        break;
    case "travis-noweb":

        settings = {
            testing: {
                enableWebTests: false,
            }
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

        pnp.setup({
            sp: {
                fetchClientFactory: () => {
                    return new NodeFetchClient(testSettings.siteUrl, testSettings.clientId, testSettings.clientSecret);
                }
            },
        });

        // comment this out to keep older subsites
        // cleanUpAllSubsites();

        // create the web in which we will test
        let d = new Date();
        let g = Util.getGUID();

        pnp.sp.web.webs.add(`PnP-JS-Core Testing ${d.toDateString()}`, g).then(() => {

            let url = Util.combinePaths(testSettings.siteUrl, g);

            // set the testing web url so our tests have access if needed
            testSettings.webUrl = url;

            // re-setup the node client to use the new web
            pnp.setup({
                // headers: {
                //     "Accept": "application/json;odata=verbose",
                // },
                sp: {
                    fetchClientFactory: () => {
                        return new NodeFetchClient(url, testSettings.clientId, testSettings.clientSecret);
                    }
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
    pnp.sp.site.rootWeb.webs.select("Title").get().then((w) => {
        w.forEach((element: any) => {
            let web = new Web(element["odata.id"], "");
            web.webs.select("Title").get().then((sw: any[]) => {
                return Promise.all(sw.map((value) => {
                    let web2 = new Web(value["odata.id"], "");
                    return web2.delete();
                }));
            }).then(() => { web.delete(); });
        });
    }).catch(e => console.log("Error: " + JSON.stringify(e)));
}
