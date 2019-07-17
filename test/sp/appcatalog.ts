
import { getRandomString, getGUID } from "@pnp/common";
import { expect } from "chai";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/appcatalog";
import { sp } from "@pnp/sp";
import { testSettings } from "../main";
import { IAppCatalog } from '@pnp/sp/src/appcatalog';

describe.only("AppCatalog2", function () {

    if (testSettings.enableWebTests) {
        let appCatalog: IAppCatalog;
        const createdAppNames: string[] = [];

        before(async function () {
            const appCatWeb = await sp.getTenantAppCatalogWeb();
            appCatalog = appCatWeb.getAppCatalog();
        });

        it("it gets all the apps", function () {
            return expect(appCatalog.get(), `all apps should've been fetched`).to.eventually.be.fulfilled;
        });

        it("it adds an app", function () {
            const appName: string = getRandomString(25);
            createdAppNames.push(appName);
            return expect(appCatalog.add(appName, null), `app '${appName}' should've been added`).to.eventually.be.fulfilled;
        });

        it("it gets an app by id", function () {
            const appId: string = getGUID();
            return expect(appCatalog.getAppById(appId), `app '${appId}' should've been fetched`).to.eventually.be.fulfilled;
        });

        after(async () => {
            const apps = await appCatalog.get();
            for (let i = 0; i < createdAppNames.length; i++) {
                const myAppID = apps.filter(x => x.Title === createdAppNames[i])[0].ID;
                await (appCatalog.getAppById(myAppID)).remove();
            }
        });
    }
});
