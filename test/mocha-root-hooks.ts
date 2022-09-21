import { getProcessArgs, IProcessArgs } from "./args.js";
import { getSettings, ISettings } from "./load-settings.js";
import { Context } from "mocha";
import { extractWebUrl, SPFI, spfi } from "@pnp/sp";
import { graphfi, GraphFI } from "@pnp/graph";
import { GraphDefault, SPDefault, NodeFetch } from "@pnp/nodejs";
import { getGUID, delay } from "@pnp/core";
import { cleanUpAllSubsites } from "./clean-subsite.js";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import "mocha";
import "@pnp/sp/webs";
import { Web } from "@pnp/sp/webs";
import { PnPLogging, ConsoleListener, Logger } from "@pnp/logging";

declare module "mocha" {
    interface Context {
        pnp: {
            args: IProcessArgs;
            settings: ISettings;
            sp?: SPFI;
            graph?: GraphFI;
        };
    }

    interface Suite {
        pnp: {
            args: IProcessArgs;
            settings: ISettings;
            sp?: SPFI;
            graph?: GraphFI;
        };
    }
}

let testStart: number;
let siteUsed = false;

export const mochaHooks = {
    beforeAll: [
        async function setup(this: Context) {

            chai.use(chaiAsPromised);

            Logger.subscribe(ConsoleListener());

            // start a timer
            testStart = Date.now();

            // establish the testing settings shared across the testing context
            const args = getProcessArgs();
            const settings = await getSettings(args);
            this.pnp = {
                args,
                settings,
            };
        },
        async function spSetup(this: Context) {

            const setupStart = Date.now();
            try {

                if (!this.pnp.settings.enableWebTests) {
                    return;
                }

                this.pnp.settings.sp.testWebUrl = this.pnp.settings.sp.url;

                if (this.pnp.args.site && this.pnp.args.site.length > 0) {
                    this.pnp.settings.sp.testWebUrl = this.pnp.args.site;
                    siteUsed = true;
                }

                const rootSP = spfi(this.pnp.settings.sp.testWebUrl).using(SPDefault({
                    msal: {
                        config: this.pnp.settings.sp.msal.init,
                        scopes: this.pnp.settings.sp.msal.scopes,
                    },
                }), NodeFetch({ replace: true }));

                if (siteUsed) {
                    // we were given a site, so we don't need to create one
                    this.pnp.sp = rootSP;
                    this.pnp.sp.using(PnPLogging(this.pnp.args.logging));
                    return;
                }

                const d = new Date();
                const g = getGUID();

                const testWebResult = await rootSP.web.webs.add(`PnP-JS-Core Testing ${d.toDateString()}`, g);

                // set the testing web url so our tests have access if needed
                this.pnp.settings.sp.testWebUrl = testWebResult.data.Url;

                // create a new testing site
                this.pnp.sp = spfi(this.pnp.settings.sp.testWebUrl).using(SPDefault({
                    msal: {
                        config: this.pnp.settings.sp.msal.init,
                        scopes: this.pnp.settings.sp.msal.scopes,
                    },
                }), NodeFetch({ replace: true }));

                this.pnp.sp.using(PnPLogging(this.pnp.args.logging));

            } finally {
                const setupEnd = Date.now();
                console.log(`SP Setup completed in ${((setupEnd - setupStart) / 1000).toFixed(4)} seconds.`);
            }
        },
        async function graphSetup(this: Context) {

            const setupStart = Date.now();
            try {

                if (!this.pnp.settings.enableWebTests) {
                    return;
                }

                this.pnp.graph = graphfi().using(GraphDefault({
                    msal: {
                        config: this.pnp.settings.graph.msal.init,
                        scopes: this.pnp.settings.graph.msal.scopes,
                    },
                }), NodeFetch({ replace: true }));

                this.pnp.graph.using(PnPLogging(this.pnp.args.logging));

            } finally {
                const setupEnd = Date.now();
                console.log(`Graph Setup completed in ${((setupEnd - setupStart) / 1000).toFixed(4)} seconds.`);
            }
        },
    ],
    afterAll: [
        function timing(this: Context) {
            const testEnd = Date.now();
            console.log(`Testing completed in ${((testEnd - testStart) / 1000).toFixed(4)} seconds.`);
        },
        async function spTeardown(this: Context) {
            const teardownStart = Date.now();
            try {

                if (this.pnp.args.deleteAllWebs) {

                    const rootCleanupWeb = siteUsed ? this.pnp.sp.web : Web([this.pnp.sp.web, this.pnp.settings.sp.url]);

                    await cleanUpAllSubsites(rootCleanupWeb);

                } else if (this.pnp.args.deleteWeb && this.pnp.settings.enableWebTests) {

                    console.log(`Deleting web ${extractWebUrl(this.pnp.sp.web.toUrl())} created during testing.`);

                    const web = await this.pnp.sp.web;

                    await cleanUpAllSubsites(web);

                    console.log("All subsites have been removed.");

                    // Delay so that web can be deleted
                    await delay(500);

                    await web.delete();

                    console.log(`Deleted web ${this.pnp.settings.sp.testWebUrl} created during testing.`);

                } else if (this.pnp.settings.enableWebTests) {

                    console.log(`Leaving ${this.pnp.settings.sp.testWebUrl} alone.`);

                } else {

                    console.log("No SP teardown");
                }

            } finally {
                const teardownEnd = Date.now();
                console.log(`SP Teardown completed in ${((teardownEnd - teardownStart) / 1000).toFixed(4)} seconds.`);
            }

            return Promise.resolve();
        },
        function graphTeardown(this: Context) {
            const teardownStart = Date.now();
            try {

                console.log("No Graph teardown");

            } finally {
                const teardownEnd = Date.now();
                console.log(`Graph Teardown completed in ${((teardownEnd - teardownStart) / 1000).toFixed(4)} seconds.`);
            }
        },
        function goodbye() {
            console.log("All done. Have a nice day :)");
        },
    ],
};





