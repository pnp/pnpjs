import { getRandomString, delay } from "@pnp/core";
import { expect } from "chai";
import { IAppCatalog } from "@pnp/sp/appcatalog";
import "@pnp/sp/webs";
import "@pnp/sp/appcatalog";
import "@pnp/sp/lists";
import * as fs from "fs";
import * as path from "path";
import findupSync from "findup-sync";
import { pnpTest } from  "../pnp-test.js";

// give ourselves a single reference to the projectRoot
const projectRoot = path.resolve(path.dirname(findupSync("package.json")));

describe.skip("AppCatalog", function () {

    let appCatalog: IAppCatalog;
    const dirname = path.join(projectRoot, "test/sp/assets", "helloworld.sppkg");
    const buffer = fs.readFileSync(dirname);
    const sppkgData = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
    const appId = "b1403d3c-d4c4-41f7-8141-776ff1498100";

    before(pnpTest("1a21b796-fe8d-46d6-b9ac-a83d26062ce3", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const appCatWeb = await this.pnp.sp.getTenantAppCatalogWeb();
        appCatalog = appCatWeb.appcatalog;
    }));

    it("appCatalog", pnpTest("8cb4d51b-9d03-42aa-b0da-b57f8ca9bc77", function () {
        return expect(appCatalog(), "all apps should've been fetched").to.eventually.be.fulfilled;
    }));

    it("add", pnpTest("d0c2ab4a-cfe3-46f3-9554-73202e3b5f33", async function () {
        const props = await this.props({
            appName: getRandomString(25),
        });

        const app = await appCatalog.add(props.appName, sppkgData);

        after(async function () {
            return app.file.delete();
        });

        return expect(app.Name).to.eq(props.appName);
    }));

    it("getAppById", pnpTest("8e538515-1a86-4661-949f-8eca04974db0", async function () {
        return expect(appCatalog.getAppById(appId)(), `app '${appId}' should've been fetched`).to.eventually.be.fulfilled;
    }));

    // skip due to permissions in various testing environments
    it.skip(".setStorageEntity (1)", pnpTest("b308de0e-872f-4c3d-a4ad-d9c4796f06df", async function () {

        const props = await this.props({
            key: `testingkey_${getRandomString(4)}`,
            value: "Test Value",
        });

        const web = await this.pnp.sp.getTenantAppCatalogWeb();

        after(async function () {
            return web.removeStorageEntity(props.key);
        });

        await web.setStorageEntity(props.key, props.value);
        const v = await web.getStorageEntity(props.key);
        return expect(v.Value).to.equal(props.value);
    }));

    // skip due to permissions in various testing environments
    it.skip(".setStorageEntity (2)", pnpTest("4cadb88a-3c68-4af1-82dd-3e5582dc54d6", async function () {

        const props = await this.props({
            key: `testingkey_${getRandomString(4)}`,
            value: "Test Value",
        });

        const web = await this.pnp.sp.getTenantAppCatalogWeb();

        after(async function () {
            return web.removeStorageEntity(props.key);
        });

        await web.setStorageEntity(props.key, props.value);
        const v = await web.getStorageEntity(props.key);
        return expect(v.Value).to.equal(props.value);
    }));

    describe("App", function () {
        it("deploy", pnpTest("2e44549c-d1c0-4a38-b379-62159c8d51bc", async function () {
            const myApp = appCatalog.getAppById(appId);
            return expect(myApp.deploy(), `app '${appId}' should've been deployed`).to.eventually.be.fulfilled;
        }));

        // skipping due to permissions required
        it.skip(".syncSolutionToTeams", pnpTest("86c09101-81e2-4d82-87fd-a18964a7a47c", async function () {
            return expect(appCatalog.syncSolutionToTeams(appId), `app '${appId}' should've been synchronized to the Microsoft Teams App Catalog`).to.eventually.be.fulfilled;
        }));

        it("syncSolutionToTeams (fail)", pnpTest("1b31d665-e6e3-4d22-82e3-d5d35e512301", async function () {
            const msg = "app 'random' should not have been synchronized to the Microsoft Teams App Catalog";
            return expect(appCatalog.syncSolutionToTeams("random"), msg).to.not.eventually.be.fulfilled;
        }));

        it("install",  pnpTest("fd33272b-54d3-4759-a7a9-8e8e8cb9504f", async function () {
            const myApp = this.pnp.sp.web.appcatalog.getAppById(appId);
            return expect(myApp.install(), `app '${appId}' should've been installed on web ${this.pnp.settings.sp.testWebUrl}`).to.eventually.be.fulfilled;
        }));

        it("uninstall", pnpTest("5d0bd94e-7f3e-4e63-98b6-73406d3e43e1", async function () {
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
        }));

        it("upgrade", pnpTest("d3085480-0dee-4ea5-a325-ea4adb1b1e00", async function () {
            const myApp = this.pnp.sp.web.appcatalog.getAppById(appId);
            return expect(myApp.upgrade(), `app '${appId}' should've been upgraded on web ${this.pnp.settings.sp.testWebUrl}`).to.eventually.be.fulfilled;
        }));

        it("retract", pnpTest("d6c98832-4e8f-4166-957c-7ef72dddcd87", async function () {
            const myApp = appCatalog.getAppById(appId);
            return expect(myApp.retract(), `app '${appId}' should've been retracted`).to.eventually.be.fulfilled;
        }));

        it("remove", pnpTest("3d196688-bfe7-4834-a0d7-ffb46c7b8a88", async function () {
            const myApp = appCatalog.getAppById(appId);
            return expect(myApp.remove(), `app '${appId}' should've been removed`).to.eventually.be.fulfilled;
        }));
    });
});
