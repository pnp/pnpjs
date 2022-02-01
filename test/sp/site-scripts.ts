import { getRandomString } from "@pnp/core";
import { expect } from "chai";
import "@pnp/sp/site-scripts";
import { IList } from "@pnp/sp/lists";
import { spfi, SPFI } from "@pnp/sp";

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

    let _rootSite: SPFI = null;

    const createdSiteScriptIds: string[] = [];
    const createdLists: IList[] = [];

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        _rootSite = spfi([this.pnp.sp.site, this.pnp.settings.sp.url]);
    });

    it("createSiteScript", function () {

        const title = `Test_create_sitescript_${getRandomString(8)}`;
        const description = `${getRandomString(25)}`;
        const p = _rootSite.siteScripts.createSiteScript(title, description, defaultScriptSchema)
            .then(ss => createdSiteScriptIds.push(ss.Id));

        return expect(p, `site script '${title}' should've been created`).to.eventually.be.fulfilled;
    });

    it("createSiteScript (fail - bad title)", function () {

        const title = `Test_create_sitescript_${getRandomString(8)}'`;
        const description = `${getRandomString(25)}`;
        const p = _rootSite.siteScripts.createSiteScript(title, description, defaultScriptSchema)
            .then(ss => createdSiteScriptIds.push(ss.Id));

        return expect(p, `site script '${title}' should not have been created`).to.eventually.be.fulfilled;
    });

    it("createSiteScript (fail - no actions)", function () {

        const schema = {
            "$schema": "schema.json",
            "actions": [],
            "bindata": {},
            "version": 1,
        };

        const title = `Test_create_sitescript_no_actions_${getRandomString(8)}`;
        const description = `${getRandomString(25)}`;

        return expect(_rootSite.siteScripts.createSiteScript(title, description, schema),
            `site script '${title}' should not have been created`).to.eventually.be.rejected;
    });

    it("deleteSiteScript", async function () {

        const title = `Test_create_sitescript_to_be_deleted_${getRandomString(8)}`;
        const description = `${getRandomString(25)}`;
        const ss = await _rootSite.siteScripts.createSiteScript(title, description, defaultScriptSchema);

        return expect(_rootSite.siteScripts.deleteSiteScript(ss.Id),
            `site script '${title}' should've been deleted`).to.eventually.be.fulfilled;
    });

    it("deleteSiteScript (fail)", function () {

        return expect(_rootSite.siteScripts.deleteSiteScript(null),
            "site script should NOT have been deleted").to.eventually.be.rejected;
    });

    it("getSiteScriptMetadata", async function () {

        const title = `Test_get_metadata_sitescript${getRandomString(8)}`;
        const description = `${getRandomString(25)}`;
        const ss = await _rootSite.siteScripts.createSiteScript(title, description, defaultScriptSchema);

        createdSiteScriptIds.push(ss.Id);

        return expect(_rootSite.siteScripts.getSiteScriptMetadata(ss.Id),
            `metadata of site script '${title}' should have been retrieved`).to.eventually.be.fulfilled;
    });


    it("updateSiteScript", async function () {

        const title = `Test_to_update_sitescript_${getRandomString(8)}`;
        const description = `${getRandomString(25)}`;
        const ss = await _rootSite.siteScripts.createSiteScript(title, description, defaultScriptSchema);

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

        return expect(_rootSite.siteScripts.updateSiteScript({
            Id: ss.Id,
            Title: updatedTitle,
        }, updatedScriptSchema), `site script '${title}' should've been updated`).to.eventually.be.fulfilled;
    });

    it("getSiteScripts", async function () {

        return expect(_rootSite.siteScripts.getSiteScripts(),
            "all the site scripts should've been fetched").to.eventually.be.fulfilled;
    });

    it("getSiteScript (list)", async function () {
        const listTitle = `sc_list_${getRandomString(8)}`;
        const listResult = await _rootSite.web.lists.add(listTitle);
        createdLists.push(listResult.list);

        return expect(listResult.list.getSiteScript(),
            "the lists site script should've been fetched").to.eventually.be.fulfilled;
    });

    it.skip(".getSiteScript (web)", async function () {
        return expect(_rootSite.web.getSiteScript(),
            "the webs site script should've been fetched").to.eventually.be.fulfilled;
    });

    after(function () {

        const promises: Promise<void>[] = [];

        createdSiteScriptIds.forEach((sdId) => {
            promises.push(_rootSite.siteScripts.deleteSiteScript(sdId));
        });

        createdLists.forEach((list: IList) => {
            promises.push(list.delete());
        });

        return Promise.all(promises);
    });
});
