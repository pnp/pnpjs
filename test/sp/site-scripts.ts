import { getRandomString } from "@pnp/core";
import { expect } from "chai";
import "@pnp/sp/site-scripts";
import { IList } from "@pnp/sp/lists";
import { spfi, SPFI } from "@pnp/sp";
import { pnpTest } from  "../pnp-test.js";

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

    before(pnpTest("63d499cf-8b16-406e-98f9-f991c94baa61", function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        _rootSite = spfi([this.pnp.sp.site, this.pnp.settings.sp.url]);
    }));

    it("createSiteScript", pnpTest("ae1110d5-fcbd-483d-8240-d4f2aa27c802", async function () {
        const { title, description } = await this.props({
            title: `Test_create_sitescript_${getRandomString(8)}`,
            description: `${getRandomString(25)}`,
        });
        const p = _rootSite.siteScripts.createSiteScript(title, description, defaultScriptSchema)
            .then(ss => createdSiteScriptIds.push(ss.Id));

        return expect(p, `site script '${title}' should've been created`).to.eventually.be.fulfilled;
    }));

    it("createSiteScript (fail - bad title)", pnpTest("6ea4c969-778d-4e98-8b35-7fa8b686bd96", async function () {
        const { title, description } = await this.props({
            title: `Test_create_sitescript_${getRandomString(8)}`,
            description: `${getRandomString(25)}`,
        });
        const p = _rootSite.siteScripts.createSiteScript(title, description, defaultScriptSchema)
            .then(ss => createdSiteScriptIds.push(ss.Id));

        return expect(p, `site script '${title}' should not have been created`).to.eventually.be.fulfilled;
    }));

    it("createSiteScript (fail - no actions)", pnpTest("e9d920d5-5c7e-43b4-8f92-5b9afde8f346", async function () {

        const schema = {
            "$schema": "schema.json",
            "actions": [],
            "bindata": {},
            "version": 1,
        };

        const { title, description } = await this.props({
            title: `Test_create_sitescript_no_actions_${getRandomString(8)}`,
            description: `${getRandomString(25)}`,
        });
        return expect(_rootSite.siteScripts.createSiteScript(title, description, schema),
            `site script '${title}' should not have been created`).to.eventually.be.rejected;
    }));

    it("deleteSiteScript", pnpTest("8398386b-425c-4804-9791-852039ea7447", async function () {
        const { title, description } = await this.props({
            title: `Test_create_sitescript_to_be_deleted_${getRandomString(8)}`,
            description: `${getRandomString(25)}`,
        });
        const ss = await _rootSite.siteScripts.createSiteScript(title, description, defaultScriptSchema);

        return expect(_rootSite.siteScripts.deleteSiteScript(ss.Id),
            `site script '${title}' should've been deleted`).to.eventually.be.fulfilled;
    }));

    it("deleteSiteScript (fail)", pnpTest("6dc5ffa8-852a-4b93-a619-245113a4f4f9", function () {

        return expect(_rootSite.siteScripts.deleteSiteScript(null),
            "site script should NOT have been deleted").to.eventually.be.rejected;
    }));

    it("getSiteScriptMetadata", pnpTest("c0413ad3-0cd1-437f-99c3-81fd2edea854", async function () {
        const { title, description } = await this.props({
            title: `Test_get_metadata_sitescript${getRandomString(8)}`,
            description: `${getRandomString(25)}`,
        });
        const ss = await _rootSite.siteScripts.createSiteScript(title, description, defaultScriptSchema);

        createdSiteScriptIds.push(ss.Id);

        return expect(_rootSite.siteScripts.getSiteScriptMetadata(ss.Id),
            `metadata of site script '${title}' should have been retrieved`).to.eventually.be.fulfilled;
    }));


    it("updateSiteScript", pnpTest("818c48d0-70da-4618-9c01-2410f1e084f0", async function () {
        const { title, description } = await this.props({
            title: `Test_to_update_sitescript_${getRandomString(8)}`,
            description: `${getRandomString(25)}`,
        });
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
    }));

    it("getSiteScripts", pnpTest("504f1793-11b2-4bf8-a844-e318974919b4", async function () {

        return expect(_rootSite.siteScripts.getSiteScripts(),
            "all the site scripts should've been fetched").to.eventually.be.fulfilled;
    }));

    it("getSiteScript (list)", pnpTest("85e9088d-cd08-41fa-9753-11c0e034d022", async function () {
        const { listTitle } = await this.props({
            listTitle: `sc_list_${getRandomString(8)}`,
        });
        const listResult = await _rootSite.web.lists.add(listTitle);
        const list = _rootSite.web.lists.getById(listResult.Id);
        createdLists.push(list);

        return expect(list.getSiteScript(),
            "the lists site script should've been fetched").to.eventually.be.fulfilled;
    }));

    it.skip(".getSiteScript (web)", pnpTest("66e73c50-6541-4f6c-8799-79ca06a4e16e", async function () {
        return expect(_rootSite.web.getSiteScript(),
            "the webs site script should've been fetched").to.eventually.be.fulfilled;
    }));

    after(pnpTest("8a7207e9-8af0-467f-b812-c4a52a79ba6f", function () {

        const promises: Promise<void>[] = [];

        createdSiteScriptIds.forEach((sdId) => {
            promises.push(_rootSite.siteScripts.deleteSiteScript(sdId));
        });

        createdLists.forEach((list: IList) => {
            promises.push(list.delete());
        });

        return Promise.all(promises);
    }));
});
