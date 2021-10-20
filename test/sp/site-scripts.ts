import { getRandomString } from "@pnp/core";
import { expect } from "chai";
import "@pnp/sp/site-scripts";
import { testSettings } from "../main.js";
import { IList } from "@pnp/sp/lists";
import { spfi, SPFI } from "@pnp/sp";
import { SPDefault } from "@pnp/nodejs";

// TODO: None of these will execute in a reasonable time
describe.skip("SiteScripts", function () {
    // this may take some time, don't timeout early
    this.timeout(120000);

    const defaultScriptSchema = {
        "$schema": "schema.json",
        "actions": [
            {
                themeName: "Dummy Theme",
                verb: "applyTheme",
            },
        ],
        bindata: {},
        version: 1,
    };

    if (testSettings.enableWebTests) {
        let _spfi: SPFI = null;

        before(function () {
            _spfi = spfi(testSettings.sp.url).using(SPDefault({
                msal: {
                    config: testSettings.sp.msal.init,
                    scopes: testSettings.sp.msal.scopes,
                },
            }));
        });
        const createdSiteScriptIds: string[] = [];
        const createdLists: IList[] = [];

        it("creates a site script", function () {

            const title = `Test_create_sitescript_${getRandomString(8)}`;
            const description = `${getRandomString(100)}`;
            const p = _spfi.siteScripts.createSiteScript(title, description, defaultScriptSchema)
                .then(ss => createdSiteScriptIds.push(ss.Id));

            return expect(p, `site script '${title}' should've been created`).to.eventually.be.fulfilled;
        });

        it("fails to create a site script with a single-quote in the title argument", function () {

            const title = `Test_create_sitescript_${getRandomString(8)}'`;
            const description = `${getRandomString(100)}`;
            const p = _spfi.siteScripts.createSiteScript(title, description, defaultScriptSchema)
                .then(ss => createdSiteScriptIds.push(ss.Id));

            return expect(p, `site script '${title}' should not have been created`).to.eventually.be.fulfilled;
        });

        it("fails to create a site script with no actions in the schema", function () {

            const schema = {
                "$schema": "schema.json",
                "actions": [],
                "bindata": {},
                "version": 1,
            };

            const title = `Test_create_sitescript_no_actions_${getRandomString(8)}`;
            const description = `${getRandomString(100)}`;

            return expect(_spfi.siteScripts.createSiteScript(title, description, schema),
                `site script '${title}' should not have been created`).to.eventually.be.rejected;
        });

        it("deletes a site script", async function () {

            const title = `Test_create_sitescript_to_be_deleted_${getRandomString(8)}`;
            const description = `${getRandomString(100)}`;
            const ss = await _spfi.siteScripts.createSiteScript(title, description, defaultScriptSchema);

            return expect(_spfi.siteScripts.deleteSiteScript(ss.Id),
                `site script '${title}' should've been deleted`).to.eventually.be.fulfilled;
        });

        it("fails to delete a site script with non-existing id", function () {

            return expect(_spfi.siteScripts.deleteSiteScript(null),
                "site script should NOT have been deleted").to.eventually.be.rejected;
        });

        it("gets the site script metadata", async function () {

            const title = `Test_get_metadata_sitescript${getRandomString(8)}`;
            const description = `${getRandomString(100)}`;
            const ss = await _spfi.siteScripts.createSiteScript(title, description, defaultScriptSchema);

            createdSiteScriptIds.push(ss.Id);

            return expect(_spfi.siteScripts.getSiteScriptMetadata(ss.Id),
                `metadata of site script '${title}' should have been retrieved`).to.eventually.be.fulfilled;
        });


        it("updates a site script", async function () {

            const title = `Test_to_update_sitescript_${getRandomString(8)}`;
            const description = `${getRandomString(100)}`;
            const ss = await _spfi.siteScripts.createSiteScript(title, description, defaultScriptSchema);

            createdSiteScriptIds.push(ss.Id);

            const updatedTitle = `Test_updated_title_sitescript_${getRandomString(8)}`;

            const updatedScriptSchema = {
                "$schema": "schema.json",
                actions: [
                    {
                        themeName: "Dummy Theme 2",
                        verb: "applyTheme",
                    },
                ],
                bindata: {},
                version: 2,
            };

            return expect(_spfi.siteScripts.updateSiteScript({
                Id: ss.Id,
                Title: updatedTitle,
            }, updatedScriptSchema), `site script '${title}' should've been updated`).to.eventually.be.fulfilled;
        });

        it("gets all the site scripts", async function () {

            return expect(_spfi.siteScripts.getSiteScripts(),
                "all the site scripts should've been fetched").to.eventually.be.fulfilled;
        });

        it("gets a site script from a list", async function () {
            const listTitle = `sc_list_${getRandomString(8)}`;
            const listResult = await _spfi.web.lists.add(listTitle);
            createdLists.push(listResult.list);

            return expect(listResult.list.getSiteScript(),
                "the lists site script should've been fetched").to.eventually.be.fulfilled;
        });

        // this is currently experimental so we skip it for testing, not enabled in all tenants
        it.skip("gets a site script from a web", async function () {
            return expect(_spfi.web.getSiteScript(),
                "the webs site script should've been fetched").to.eventually.be.fulfilled;
        });

        after(function () {

            const promises: Promise<void>[] = [];

            createdSiteScriptIds.forEach((sdId) => {
                promises.push(_spfi.siteScripts.deleteSiteScript(sdId));
            });

            createdLists.forEach((list: IList) => {
                promises.push(list.delete());
            });

            return Promise.all(promises);
        });
    }
});
