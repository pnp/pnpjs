
import { getRandomString, delay } from "@pnp/core";
import { expect } from "chai";
import { IAppCatalog } from "@pnp/sp/appcatalog";
import "@pnp/sp/webs";
import "@pnp/sp/appcatalog";
import "@pnp/sp/lists";
import * as fs from "fs";
import * as path from "path";
import findupSync from "findup-sync";


// give ourselves a single reference to the projectRoot
const projectRoot = path.resolve(path.dirname(findupSync("package.json")));

describe.skip("AppCatalog", function () {

    let appCatalog: IAppCatalog;
    const dirname = path.join(projectRoot, "test/sp/assets", "helloworld.sppkg");
    const sppkgData: Uint8Array = new Uint8Array(fs.readFileSync(dirname));
    const appId = "b1403d3c-d4c4-41f7-8141-776ff1498100";

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const appCatWeb = await this.pnp.sp.getTenantAppCatalogWeb();
        appCatalog = appCatWeb.appcatalog;
    });

    it("appCatalog", function () {
        return expect(appCatalog(), "all apps should've been fetched").to.eventually.be.fulfilled;
    });

    it("add", async function () {
        const appName: string = getRandomString(25);

        const app = await appCatalog.add(appName, sppkgData);

        after(async function () {
            return app.file.delete();
        });

        return expect(app.data.Name).to.eq(appName);
    });

    it("getAppById", async function () {
        return expect(appCatalog.getAppById(appId)(), `app '${appId}' should've been fetched`).to.eventually.be.fulfilled;
    });

    // skip due to permissions in various testing environments
    it.skip(".setStorageEntity (1)", async function () {

        const key = `testingkey_${getRandomString(4)}`;
        const value = "Test Value";

        const web = await this.pnp.sp.getTenantAppCatalogWeb();

        after(async function () {
            return web.removeStorageEntity(key);
        });

        await web.setStorageEntity(key, value);
        const v = await web.getStorageEntity(key);
        return expect(v.Value).to.equal(value);
    });

    // skip due to permissions in various testing environments
    it.skip(".setStorageEntity (2)", async function () {

        const key = `testingkey'${getRandomString(4)}`;
        const value = "Test Value";

        const web = await this.pnp.sp.getTenantAppCatalogWeb();

        after(async function () {
            return web.removeStorageEntity(key);
        });

        await web.setStorageEntity(key, value);
        const v = await web.getStorageEntity(key);
        return expect(v.Value).to.equal(value);
    });

    describe("App", function () {
        it("deploy", async function () {
            const myApp = appCatalog.getAppById(appId);
            return expect(myApp.deploy(), `app '${appId}' should've been deployed`).to.eventually.be.fulfilled;
        });

        // skipping due to permissions required
        it.skip(".syncSolutionToTeams", async function () {
            return expect(appCatalog.syncSolutionToTeams(appId), `app '${appId}' should've been synchronized to the Microsoft Teams App Catalog`).to.eventually.be.fulfilled;
        });

        it("syncSolutionToTeams (fail)", async function () {
            const msg = "app 'random' should not have been synchronized to the Microsoft Teams App Catalog";
            return expect(appCatalog.syncSolutionToTeams("random"), msg).to.not.eventually.be.fulfilled;
        });

        it("install", async function () {
            const myApp = this.pnp.sp.web.appcatalog.getAppById(appId);
            return expect(myApp.install(), `app '${appId}' should've been installed on web ${this.pnp.settings.sp.testWebUrl}`).to.eventually.be.fulfilled;
        });

        it("uninstall", async function () {
            // We have to make sure the app is installed before we can uninstall it otherwise we get the following error message:
            // Another job exists for this app instance. Please retry after that job is done.
            const myApp = this.pnp.sp.web.appcatalog.getAppById(appId);
            let app = { InstalledVersion: "" };
            let retryCount = 0;

            do {
                if (retryCount === 5) {
                    break;
                }
                await delay(10000); // Sleep for 10 seconds
                app = await myApp();
                retryCount++;
            } while (app.InstalledVersion === "");

            return expect(myApp.uninstall(), `app '${appId}' should've been uninstalled on web ${this.pnp.settings.sp.testWebUrl}`).to.eventually.be.fulfilled;
        });

        it("upgrade", async function () {
            const myApp = this.pnp.sp.web.appcatalog.getAppById(appId);
            return expect(myApp.upgrade(), `app '${appId}' should've been upgraded on web ${this.pnp.settings.sp.testWebUrl}`).to.eventually.be.fulfilled;
        });

        it("retract", async function () {
            const myApp = appCatalog.getAppById(appId);
            return expect(myApp.retract(), `app '${appId}' should've been retracted`).to.eventually.be.fulfilled;
        });

        it("remove", async function () {
            const myApp = appCatalog.getAppById(appId);
            return expect(myApp.remove(), `app '${appId}' should've been removed`).to.eventually.be.fulfilled;
        });
    });
});
