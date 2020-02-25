
import { getRandomString } from "@pnp/common";
import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/site-designs";
import "@pnp/sp/site-users/web";
import { ISiteDesignRun } from "@pnp/sp/site-designs";
import { sp } from "@pnp/sp";
import { testSettings } from "../main";

const sleep = (ms: number) => new Promise(r => setTimeout(() => { r(); }, ms));

describe("SiteDesigns", function () {

    let testuser = "";

    before(async function () {

        const users = await sp.web.siteUsers.top(1).select("LoginName")<{ LoginName: string }[]>();
        testuser = users[0].LoginName;
    });

    if (testSettings.enableWebTests) {

        const createdSiteDesignIds: string[] = [];

        it("creates a site design", function () {

            const title = `Test_create_sitedesign_${getRandomString(8)}`;
            const p = sp.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            }).then(sd => createdSiteDesignIds.push(sd.Id));

            return expect(p, `site design '${title}' should've been created`).to.eventually.be.fulfilled;
        });

        it("deletes a site design", async function () {

            const title = `Test_to_be_deleted_sitedesign_${getRandomString(8)}`;
            const sd = await sp.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            return expect(sp.siteDesigns.deleteSiteDesign(sd.Id),
                `site design '${title}' should've been deleted`).to.eventually.be.fulfilled;
        });

        it("fails to delete a site design with non-existing id", function () {

            return expect(sp.siteDesigns.deleteSiteDesign(null),
                `site design should NOT have been deleted`).to.eventually.be.rejected;
        });

        it("gets the site design metadata", async function () {

            const title = `Test_get_metadata_sitedesign_${getRandomString(8)}`;
            const sd = await sp.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);

            return expect(sp.siteDesigns.getSiteDesignMetadata(sd.Id),
                `metadata of site design '${title}' should have been retrieved`).to.eventually.be.fulfilled;
        });

        it("applies a site designs", async function () {

            const title = `Test_applying_sitedesign_${getRandomString(8)}`;
            const sd = await sp.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);

            return expect(sp.siteDesigns.applySiteDesign(sd.Id, testSettings.sp.webUrl),
                `site design '${title}' should've been applied to site '${testSettings.sp.webUrl}'`).to.eventually.be.fulfilled;
        });

        it("updates a site designs", async function () {

            const title = `Test_to_update_sitedesign_${getRandomString(8)}`;
            const sd = await sp.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);

            const updatedTitle = `Test_updated_sitedesign_${getRandomString(8)}`;
            return expect(sp.siteDesigns.updateSiteDesign({
                Id: sd.Id,
                Title: updatedTitle,
            }), `site design '${title}' should've been updated`).to.eventually.be.fulfilled;
        });

        it("gets all the site designs", async function () {

            return expect(sp.siteDesigns.getSiteDesigns(),
                `all the site designs should've been fetched`).to.eventually.be.fulfilled;
        });

        it("gets the site designs rights", async function () {

            const title = `Test_to_get_sitedesign_rights__${getRandomString(8)}`;
            const sd = await sp.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);

            return expect(sp.siteDesigns.getSiteDesignRights(sd.Id),
                `rights for the site design '${title}' should've been fetched`).to.eventually.be.fulfilled;
        });

        it("grants the site design rights", async function () {

            const title = `Test_grant_rights_sitedesign_${getRandomString(8)}`;
            const sd = await sp.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);

            return expect(sp.siteDesigns.grantSiteDesignRights(
                sd.Id,
                [testuser],
            ), `rights of site design '${title}' should have been granted to user '${testuser}'`).to.eventually.be.fulfilled;
        });

        it("revokes the site design rights", async function () {

            const title = `Test_revoke_rights_sitedesign_${getRandomString(8)}`;
            const sd = await sp.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);

            await sp.siteDesigns.grantSiteDesignRights(sd.Id, [testuser]);

            return expect(sp.siteDesigns.revokeSiteDesignRights(sd.Id, [testuser]),
                `rights of site design '${title}' should have been revoked from user '${testuser}'`).to.eventually.be.fulfilled;
        });

        it("gets the site design runs", async function () {

            return expect(sp.web.getSiteDesignRuns(),
                `site design runs should've been fetched`).to.eventually.be.fulfilled;
        });

        it("adds a site design task with absolute web url", async function () {

            const title = `Test_add_task_sitedesign_${getRandomString(8)}`;
            const sd = await sp.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);

            return expect(sp.siteDesigns.addSiteDesignTask(testSettings.sp.webUrl, sd.Id),
                `site design task should've been created with absolute web url`).to.eventually.be.fulfilled;
        });

        it("adds a site design task", async function () {

            const title = `Test_add_task_sitedesign_${getRandomString(8)}`;
            const sd = await sp.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);

            return expect(sp.web.addSiteDesignTask(sd.Id),
                `site design task should've been created`).to.eventually.be.fulfilled;
        });

        it("gets a site design task", async function () {

            const title = `Test_get_task_run_sitedesign_${getRandomString(8)}`;
            const sd = await sp.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);

            const originalTask = await sp.web.addSiteDesignTask(sd.Id);

            return expect(sp.siteDesigns.getSiteDesignTask(originalTask.ID),
                `site design task should've been fetched`).to.eventually.be.fulfilled;
        });

        it("gets a site design run status", async function () {
            this.enableTimeouts(false);

            const title = `Test_add_task_run_sitedesign_${getRandomString(8)}`;
            const sd = await sp.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68",
            });

            createdSiteDesignIds.push(sd.Id);

            const originalTask = await sp.web.addSiteDesignTask(sd.Id);

            let task = null;
            do {
                await sleep(10000);
                task = await sp.siteDesigns.getSiteDesignTask(originalTask.ID);
            }
            while (task != null);

            const siteDesignRuns: ISiteDesignRun[] = await sp.web.getSiteDesignRuns();

            return expect(sp.web.getSiteDesignRunStatus(siteDesignRuns[0].ID),
                `site design task should've been created`).to.eventually.be.fulfilled;
        });

        after(() => {
            return Promise.all(createdSiteDesignIds.map((sdId) => {
                return sp.siteDesigns.deleteSiteDesign(sdId);
            }));
        });
    }
});
