import { getRandomString } from "@pnp/common";
import { expect } from "chai";
import { sp } from "@pnp/sp";
import "@pnp/sp/site-scripts";
import { testSettings } from "../main";
import { IList } from "@pnp/sp/lists";

describe("SiteScripts", function () {

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

        const createdSiteScriptIds: string[] = [];
        const createdLists: IList[] = [];

        it("creates a site script", function () {

            const title = `Test_create_sitescript_${getRandomString(8)}`;
            const description = `${getRandomString(100)}`;
            const p = sp.siteScripts.createSiteScript(title, description, defaultScriptSchema)
                .then(ss => createdSiteScriptIds.push(ss.Id));

            return expect(p, `site script '${title}' should've been created`).to.eventually.be.fulfilled;
        });

        it("fails to create a site script with a single-quote in the title argument", function () {

            const title = `Test_create_sitescript_${getRandomString(8)}'`;
            const description = `${getRandomString(100)}`;
            const p = sp.siteScripts.createSiteScript(title, description, defaultScriptSchema)
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

            return expect(sp.siteScripts.createSiteScript(title, description, schema),
                `site script '${title}' should not have been created`).to.eventually.be.rejected;
        });

        it("deletes a site script", async function () {

            const title = `Test_create_sitescript_to_be_deleted_${getRandomString(8)}`;
            const description = `${getRandomString(100)}`;
            const ss = await sp.siteScripts.createSiteScript(title, description, defaultScriptSchema);

            return expect(sp.siteScripts.deleteSiteScript(ss.Id),
                `site script '${title}' should've been deleted`).to.eventually.be.fulfilled;
        });

        it("fails to delete a site script with non-existing id", function () {

            return expect(sp.siteScripts.deleteSiteScript(null),
                `site script should NOT have been deleted`).to.eventually.be.rejected;
        });

        it("gets the site script metadata", async function () {

            const title = `Test_get_metadata_sitescript${getRandomString(8)}`;
            const description = `${getRandomString(100)}`;
            const ss = await sp.siteScripts.createSiteScript(title, description, defaultScriptSchema);

            createdSiteScriptIds.push(ss.Id);

            return expect(sp.siteScripts.getSiteScriptMetadata(ss.Id),
                `metadata of site script '${title}' should have been retrieved`).to.eventually.be.fulfilled;
        });


        it("updates a site script", async function () {

            const title = `Test_to_update_sitescript_${getRandomString(8)}`;
            const description = `${getRandomString(100)}`;
            const ss = await sp.siteScripts.createSiteScript(title, description, defaultScriptSchema);

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

            return expect(sp.siteScripts.updateSiteScript({
                Id: ss.Id,
                Title: updatedTitle,
            }, updatedScriptSchema), `site script '${title}' should've been updated`).to.eventually.be.fulfilled;
        });

        it("gets all the site scripts", async function () {

            return expect(sp.siteScripts.getSiteScripts(),
                `all the site scripts should've been fetched`).to.eventually.be.fulfilled;
        });

        it("gets a site script from a list", async function () {
            const listTitle = `sc_list_${getRandomString(8)}`;
            const listResult = await sp.web.lists.add(listTitle);
            createdLists.push(listResult.list);

            return expect(listResult.list.getSiteScript(),
                `the lists site script should've been fetched`).to.eventually.be.fulfilled;
        });

        // this is currently experimental so we skip it for testing, not enabled in all tenants
        it.skip("gets a site script from a web", async function () {
            return expect(sp.web.getSiteScript(),
                `the webs site script should've been fetched`).to.eventually.be.fulfilled;
        });

        after(() => {

            const promises: Promise<void>[] = [];

            createdSiteScriptIds.forEach((sdId) => {
                promises.push(sp.siteScripts.deleteSiteScript(sdId));
            });

            createdLists.forEach((list: IList) => {
                promises.push(list.delete());
            });

            return Promise.all(promises);
        });
    }
});
