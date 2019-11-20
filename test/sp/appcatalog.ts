
import { getRandomString } from "@pnp/common";
import { expect } from "chai";
import { testSettings } from "../main";
import { IAppCatalog } from "@pnp/sp/appcatalog";
import { IWeb, Web } from "@pnp/sp/webs";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/appcatalog";
import "@pnp/sp/lists";
import * as fs from "fs";
import * as path from "path";

const sleep = (ms: number) => new Promise(r => setTimeout(() => { r(); }, ms));

// currrently skipping due to permissions issues
describe.skip("AppCatalog", function () {

    if (testSettings.enableWebTests) {
        let appCatalog: IAppCatalog;
        let appCatWeb: IWeb;
        const dirname = path.join(__dirname, "assets", "helloworld.sppkg");
        const sppkgData: Uint8Array = new Uint8Array(fs.readFileSync(dirname));
        const appId = "b1403d3c-d4c4-41f7-8141-776ff1498100";

        before(async function () {
            appCatWeb = await sp.getTenantAppCatalogWeb();
            appCatalog = appCatWeb.getAppCatalog();
            // return Promise.resolve();
        });

        it("it gets all the apps", function () {
            return expect(appCatalog.get(), `all apps should've been fetched`).to.eventually.be.fulfilled;
        });

        it("it adds an app", function () {
            const appName: string = getRandomString(25);
            return expect(appCatalog.add(appName, sppkgData), `app '${appName}' should've been added`).to.eventually.be.fulfilled;
        });

        it("it gets an app by id", async function () {
            return expect(appCatalog.getAppById(appId).get(), `app '${appId}' should've been fetched`).to.eventually.be.fulfilled;
        });

        it("it deploys an app", async function () {
            const myApp = appCatalog.getAppById(appId);
            return expect(myApp.deploy(), `app '${appId}' should've been deployed`).to.eventually.be.fulfilled;
        });

        it("it synchronizes a solution to the Microsoft Teams App Catalog", async function () {
            return expect(appCatalog.syncSolutionToTeams(appId), `app '${appId}' should've been synchronized to the Microsoft Teams App Catalog`).to.eventually.be.fulfilled;
        });

        it("it fails to synchronize a solution to the Microsoft Teams App Catalog using a non existing app", async function () {
            const msg = `app 'random' should not have been synchronized to the Microsoft Teams App Catalog`;
            return expect(appCatalog.syncSolutionToTeams("random"), msg).to.not.eventually.be.fulfilled;
        });

        it("it installs an app on a web", async function () {
            const myApp = Web(testSettings.sp.webUrl).getAppCatalog().getAppById(appId);
            return expect(myApp.install(), `app '${appId}' should've been installed on web ${testSettings.sp.webUrl}`).to.eventually.be.fulfilled;
        });

        it("it uninstalls an app", async function () {
            // We have to make sure the app is installed before we can uninstall it otherwise we get the following error message:
            // Another job exists for this app instance. Please retry after that job is done.
            const myApp = Web(testSettings.sp.webUrl).getAppCatalog().getAppById(appId);
            let app = { InstalledVersion: "" };
            let retryCount = 0;

            do {
                if (retryCount === 5) {
                    break;
                }
                await sleep(10000); // Sleep for 10 seconds
                app = await myApp.get();
                retryCount++;
            } while (app.InstalledVersion === "");

            return expect(myApp.uninstall(), `app '${appId}' should've been uninstalled on web ${testSettings.sp.webUrl}`).to.eventually.be.fulfilled;
        });

        it("it upgrades an app", async function () {
            const myApp = Web(testSettings.sp.webUrl).getAppCatalog().getAppById(appId);
            return expect(myApp.upgrade(), `app '${appId}' should've been upgraded on web ${testSettings.sp.webUrl}`).to.eventually.be.fulfilled;
        });

        it("it retracts an app", async function () {
            const myApp = appCatalog.getAppById(appId);
            return expect(myApp.retract(), `app '${appId}' should've been retracted`).to.eventually.be.fulfilled;
        });

        it("it removes an app", async function () {
            const myApp = appCatalog.getAppById(appId);
            return expect(myApp.remove(), `app '${appId}' should've been removed`).to.eventually.be.fulfilled;
        });
    }
});
