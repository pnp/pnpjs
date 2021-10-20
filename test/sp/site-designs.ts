
import { delay, getRandomString } from "@pnp/core";
import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/site-designs";
import "@pnp/sp/site-users/web";
import { ISiteDesignRun, ISiteDesignTask } from "@pnp/sp/site-designs";
import { getSP, testSettings } from "../main.js";
import { SPFI } from "@pnp/sp";

// Can only run on a new site collection
describe.skip("SiteDesigns", function () {
    this.timeout(120000);
    const testuser = testSettings.testUser;

    if (testSettings.enableWebTests) {
        let _spfi: SPFI = null;

        before(function () {
            _spfi = getSP();
        });

        const createdSiteDesignIds: string[] = [];

        it(".createSiteDesign", async function () {
            const title = `Test_create_sitedesign_${getRandomString(8)}`;
            const sd = await _spfi.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });
            createdSiteDesignIds.push(sd.Id)

            return expect(sd.Title).to.be.equal(title);
        });

        it(".deleteSiteDesign", async function () {

            const title = `Test_to_be_deleted_sitedesign_${getRandomString(8)}`;
            const sd = await _spfi.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            return expect(_spfi.siteDesigns.deleteSiteDesign(sd.Id),
                `site design '${title}' should've been deleted`).to.eventually.be.fulfilled;
        });

        it(".getSiteDesignMetadata", async function () {

            const title = `Test_get_metadata_sitedesign_${getRandomString(8)}`;
            const sd = await _spfi.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);

            return expect(_spfi.siteDesigns.getSiteDesignMetadata(sd.Id),
                `metadata of site design '${title}' should have been retrieved`).to.eventually.be.fulfilled;
        });

        it(".applySiteDesign", async function () {

            const title = `Test_applying_sitedesign_${getRandomString(8)}`;
            const sd = await _spfi.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);
            return expect(_spfi.siteDesigns.applySiteDesign(sd.Id, testSettings.sp.testWebUrl)).to.eventually.be.fulfilled;
        });

        it(".updateSiteDesign", async function () {

            const title = `Test_to_update_sitedesign_${getRandomString(8)}`;
            const sd = await _spfi.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);

            const updatedTitle = `Test_updated_sitedesign_${getRandomString(8)}`;
            return expect(_spfi.siteDesigns.updateSiteDesign({
                Id: sd.Id,
                Title: updatedTitle,
            }), `site design '${title}' should've been updated`).to.eventually.be.fulfilled;
        });

        it(".getSiteDesigns", async function () {

            return expect(_spfi.siteDesigns.getSiteDesigns(),
                "all the site designs should've been fetched").to.eventually.be.fulfilled;
        });

        it(".getSiteDesignRights", async function () {

            const title = `Test_to_get_sitedesign_rights__${getRandomString(8)}`;
            const sd = await _spfi.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);

            return expect(_spfi.siteDesigns.getSiteDesignRights(sd.Id),
                `rights for the site design '${title}' should've been fetched`).to.eventually.be.fulfilled;
        });

        it(".grantSiteDesignRights", async function () {

            const title = `Test_grant_rights_sitedesign_${getRandomString(8)}`;
            const sd = await _spfi.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);

            return expect(_spfi.siteDesigns.grantSiteDesignRights(
                sd.Id,
                [testuser],
            ), `rights of site design '${title}' should have been granted to user '${testuser}'`).to.eventually.be.fulfilled;
        });

        it(".revokeSiteDesignRights", async function () {

            const title = `Test_revoke_rights_sitedesign_${getRandomString(8)}`;
            const sd = await _spfi.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);

            await _spfi.siteDesigns.grantSiteDesignRights(sd.Id, [testuser]);

            return expect(_spfi.siteDesigns.revokeSiteDesignRights(sd.Id, [testuser]),
                `rights of site design '${title}' should have been revoked from user '${testuser}'`).to.eventually.be.fulfilled;
        });

        it(".getSiteDesignRuns", async function () {

            return expect(_spfi.web.getSiteDesignRuns(),
                "site design runs should've been fetched").to.eventually.be.fulfilled;
        });

        it(".addSiteDesignTask (Absolute Url)", async function () {

            const title = `Test_add_task_sitedesign_${getRandomString(8)}`;
            const sd = await _spfi.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);
            const siteDesignTask: ISiteDesignTask = await _spfi.siteDesigns.addSiteDesignTask(testSettings.sp.testWebUrl, sd.Id);
            return expect(siteDesignTask).to.be.equal(sd.Id);
        });

        it(".addSiteDesignTask", async function () {

            const title = `Test_add_task_sitedesign_${getRandomString(8)}`;
            const sd = await _spfi.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);
            const siteDesignTask = await _spfi.web.addSiteDesignTask(sd.Id);

            return expect(siteDesignTask,
                "site design task should've been created").to.not.be.null;
        });

        it(".getSiteDesignTask", async function () {

            const title = `Test_get_task_run_sitedesign_${getRandomString(8)}`;
            const sd = await _spfi.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);

            const originalTask = await _spfi.web.addSiteDesignTask(sd.Id);

            return expect(_spfi.siteDesigns.getSiteDesignTask(originalTask.ID),
                "site design task should've been fetched").to.eventually.be.fulfilled;
        });

        it(".getSiteDesignRunStatus", async function () {

            const title = `Test_add_task_run_sitedesign_${getRandomString(8)}`;
            const sd = await _spfi.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);

            const originalTask = await _spfi.web.addSiteDesignTask(sd.Id);

            let task = null;
            do {
                await delay(10000);
                task = await _spfi.siteDesigns.getSiteDesignTask(originalTask.ID);
            }
            while (task != null);

            const siteDesignRuns: ISiteDesignRun[] = await _spfi.web.getSiteDesignRuns();

            return expect(_spfi.web.getSiteDesignRunStatus(siteDesignRuns[0].ID),
                "site design task should've been created").to.eventually.be.fulfilled;
        });

        after(function () {
            return Promise.all(createdSiteDesignIds.map((sdId) => {
                return _spfi.siteDesigns.deleteSiteDesign(sdId);
            }));
        });
    }
});
