
import { delay, getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/site-designs";
import "@pnp/sp/site-users/web";
import { ISiteDesignRun, ISiteDesignTask } from "@pnp/sp/site-designs";

describe.skip("SiteDesigns", function () {

    let testuser;

    before(function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        testuser = this.pnp.settings.testUser;
    });

    const createdSiteDesignIds: string[] = [];

    it("createSiteDesign", async function () {
        const title = `Test_create_sitedesign_${getRandomString(8)}`;
        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });
        createdSiteDesignIds.push(sd.Id);

        return expect(sd.Title).to.be.equal(title);
    });

    it("deleteSiteDesign", async function () {

        const title = `Test_to_be_deleted_sitedesign_${getRandomString(8)}`;
        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        return expect(this.pnp.sp.siteDesigns.deleteSiteDesign(sd.Id),
            `site design '${title}' should've been deleted`).to.eventually.be.fulfilled;
    });

    it("getSiteDesignMetadata", async function () {

        const title = `Test_get_metadata_sitedesign_${getRandomString(8)}`;
        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);

        return expect(this.pnp.sp.siteDesigns.getSiteDesignMetadata(sd.Id),
            `metadata of site design '${title}' should have been retrieved`).to.eventually.be.fulfilled;
    });

    it("applySiteDesign", async function () {

        const title = `Test_applying_sitedesign_${getRandomString(8)}`;
        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);
        return expect(this.pnp.sp.siteDesigns.applySiteDesign(sd.Id, this.pnp.settings.sp.testWebUrl)).to.eventually.be.fulfilled;
    });

    it("updateSiteDesign", async function () {

        const title = `Test_to_update_sitedesign_${getRandomString(8)}`;
        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);

        const updatedTitle = `Test_updated_sitedesign_${getRandomString(8)}`;
        return expect(this.pnp.sp.siteDesigns.updateSiteDesign({
            Id: sd.Id,
            Title: updatedTitle,
        }), `site design '${title}' should've been updated`).to.eventually.be.fulfilled;
    });

    it("getSiteDesigns", async function () {

        return expect(this.pnp.sp.siteDesigns.getSiteDesigns(),
            "all the site designs should've been fetched").to.eventually.be.fulfilled;
    });

    it("getSiteDesignRights", async function () {

        const title = `Test_to_get_sitedesign_rights__${getRandomString(8)}`;
        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);

        return expect(this.pnp.sp.siteDesigns.getSiteDesignRights(sd.Id),
            `rights for the site design '${title}' should've been fetched`).to.eventually.be.fulfilled;
    });

    it("grantSiteDesignRights", async function () {

        const title = `Test_grant_rights_sitedesign_${getRandomString(8)}`;
        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);

        return expect(this.pnp.sp.siteDesigns.grantSiteDesignRights(
            sd.Id,
            [testuser],
        ), `rights of site design '${title}' should have been granted to user '${testuser}'`).to.eventually.be.fulfilled;
    });

    it("revokeSiteDesignRights", async function () {

        const title = `Test_revoke_rights_sitedesign_${getRandomString(8)}`;
        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);

        await this.pnp.sp.siteDesigns.grantSiteDesignRights(sd.Id, [testuser]);

        return expect(this.pnp.sp.siteDesigns.revokeSiteDesignRights(sd.Id, [testuser]),
            `rights of site design '${title}' should have been revoked from user '${testuser}'`).to.eventually.be.fulfilled;
    });

    it("getSiteDesignRuns", async function () {

        return expect(this.pnp.sp.web.getSiteDesignRuns(),
            "site design runs should've been fetched").to.eventually.be.fulfilled;
    });

    it("addSiteDesignTask (Absolute Url)", async function () {

        const title = `Test_add_task_sitedesign_${getRandomString(8)}`;
        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);
        const siteDesignTask: ISiteDesignTask = await this.pnp.sp.siteDesigns.addSiteDesignTask(this.pnp.settings.sp.testWebUrl, sd.Id);
        return expect(siteDesignTask).to.be.equal(sd.Id);
    });

    it("addSiteDesignTask", async function () {

        const title = `Test_add_task_sitedesign_${getRandomString(8)}`;
        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);
        const siteDesignTask = await this.pnp.sp.web.addSiteDesignTask(sd.Id);

        return expect(siteDesignTask,
            "site design task should've been created").to.not.be.null;
    });

    it("getSiteDesignTask", async function () {

        const title = `Test_get_task_run_sitedesign_${getRandomString(8)}`;
        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);

        const originalTask = await this.pnp.sp.web.addSiteDesignTask(sd.Id);

        return expect(this.pnp.sp.siteDesigns.getSiteDesignTask(originalTask.ID),
            "site design task should've been fetched").to.eventually.be.fulfilled;
    });

    it("getSiteDesignRunStatus", async function () {

        const title = `Test_add_task_run_sitedesign_${getRandomString(8)}`;
        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);

        const originalTask = await this.pnp.sp.web.addSiteDesignTask(sd.Id);

        let task = null;
        do {
            await delay(10000);
            task = await this.pnp.sp.siteDesigns.getSiteDesignTask(originalTask.ID);
        }
        while (task != null);

        const siteDesignRuns: ISiteDesignRun[] = await this.pnp.sp.web.getSiteDesignRuns();

        return expect(this.pnp.sp.web.getSiteDesignRunStatus(siteDesignRuns[0].ID),
            "site design task should've been created").to.eventually.be.fulfilled;
    });

    after(function () {
        if (this.pnp.settings.enableWebTests) {
            return Promise.all(createdSiteDesignIds.map((sdId) => {
                return this.pnp.sp.siteDesigns.deleteSiteDesign(sdId);
            }));
        }
    });
});
