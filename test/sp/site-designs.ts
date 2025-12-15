
import { delay, getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/site-designs";
import "@pnp/sp/site-users/web";
import { ISiteDesignRun, ISiteDesignTask } from "@pnp/sp/site-designs";
import { pnpTest } from  "../pnp-test.js";

describe.skip("SiteDesigns", function () {

    let testuser;

    before(pnpTest("a62bf89c-2598-48d4-a894-0551e7031d2c", function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        testuser = this.pnp.settings.testUser;
    }));

    const createdSiteDesignIds: string[] = [];

    it("createSiteDesign", pnpTest("e9689a8e-7aed-4c0c-a09e-2620b52e2152", async function () {
        const { title } = await this.props({
            title: `Test_create_sitedesign_${getRandomString(8)}`,
        });

        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });
        createdSiteDesignIds.push(sd.Id);

        return expect(sd.Title).to.be.equal(title);
    }));

    it("deleteSiteDesign", pnpTest("8b37f206-42e9-4200-9408-e8ec1c5cb783", async function () {
        const { title } = await this.props({
            title: `Test_to_be_deleted_sitedesign_${getRandomString(8)}`,
        });

        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        return expect(this.pnp.sp.siteDesigns.deleteSiteDesign(sd.Id),
            `site design '${title}' should've been deleted`).to.eventually.be.fulfilled;
    }));

    it("getSiteDesignMetadata", pnpTest("56071bda-675b-42d2-8799-73bee00a431d", async function () {
        const { title } = await this.props({
            title: `Test_get_metadata_sitedesign_${getRandomString(8)}`,
        });

        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);

        return expect(this.pnp.sp.siteDesigns.getSiteDesignMetadata(sd.Id),
            `metadata of site design '${title}' should have been retrieved`).to.eventually.be.fulfilled;
    }));

    it("applySiteDesign", pnpTest("3bf0c66c-10d8-405a-8c90-d99b4ebad69c", async function () {
        const { title } = await this.props({
            title: `Test_applying_sitedesign_${getRandomString(8)}`,
        });

        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);
        return expect(this.pnp.sp.siteDesigns.applySiteDesign(sd.Id, this.pnp.settings.sp.testWebUrl)).to.eventually.be.fulfilled;
    }));

    it("updateSiteDesign", pnpTest("79120ed7-036a-41a1-974b-740248ed02e3", async function () {

        const { title, updatedTitle } = await this.props({
            title: `Test_to_update_sitedesign_${getRandomString(8)}`,
            updatedTitle: `Test_updated_sitedesign_${getRandomString(8)}`,
        });
        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);

        return expect(this.pnp.sp.siteDesigns.updateSiteDesign({
            Id: sd.Id,
            Title: updatedTitle,
        }), `site design '${title}' should've been updated`).to.eventually.be.fulfilled;
    }));

    it("getSiteDesigns", pnpTest("73d792c2-d39b-430a-94b7-1c83b33d7945", async function () {

        return expect(this.pnp.sp.siteDesigns.getSiteDesigns(),
            "all the site designs should've been fetched").to.eventually.be.fulfilled;
    }));

    it("getSiteDesignRights", pnpTest("980cfe16-b15d-45c0-a0c7-c9dcafc67291", async function () {

        const { title } = await this.props({
            title: `Test_to_get_sitedesign_rights__${getRandomString(8)}`,
        });

        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);

        return expect(this.pnp.sp.siteDesigns.getSiteDesignRights(sd.Id),
            `rights for the site design '${title}' should've been fetched`).to.eventually.be.fulfilled;
    }));

    it("grantSiteDesignRights", pnpTest("7897d7a3-3981-44b3-92c1-474e3d703ec8", async function () {

        const { title } = await this.props({
            title: `Test_grant_rights_sitedesign_${getRandomString(8)}`,
        });

        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);

        return expect(this.pnp.sp.siteDesigns.grantSiteDesignRights(
            sd.Id,
            [testuser],
        ), `rights of site design '${title}' should have been granted to user '${testuser}'`).to.eventually.be.fulfilled;
    }));

    it("revokeSiteDesignRights", pnpTest("94a38c3a-e058-4f70-abeb-9a90b90f95b8", async function () {

        const { title } = await this.props({
            title: `Test_revoke_rights_sitedesign_${getRandomString(8)}`,
        });

        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);

        await this.pnp.sp.siteDesigns.grantSiteDesignRights(sd.Id, [testuser]);

        return expect(this.pnp.sp.siteDesigns.revokeSiteDesignRights(sd.Id, [testuser]),
            `rights of site design '${title}' should have been revoked from user '${testuser}'`).to.eventually.be.fulfilled;
    }));

    it("getSiteDesignRuns", pnpTest("420549ff-4514-4fab-8e55-4237651286b1", async function () {

        return expect(this.pnp.sp.web.getSiteDesignRuns(),
            "site design runs should've been fetched").to.eventually.be.fulfilled;
    }));

    it("addSiteDesignTask (Absolute Url)", pnpTest("416e7ead-a1c3-4c1d-b2c8-4708859418ce", async function () {

        const { title } = await this.props({
            title: `Test_add_task_sitedesign_${getRandomString(8)}`,
        });

        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);
        const siteDesignTask: ISiteDesignTask = await this.pnp.sp.siteDesigns.addSiteDesignTask(this.pnp.settings.sp.testWebUrl, sd.Id);
        return expect(siteDesignTask).to.be.equal(sd.Id);
    }));

    it("addSiteDesignTask", pnpTest("af04782e-f7d4-416a-8d6d-29a6bcee8718", async function () {

        const { title } = await this.props({
            title: `Test_add_task_sitedesign_${getRandomString(8)}`,
        });

        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);
        const siteDesignTask = await this.pnp.sp.web.addSiteDesignTask(sd.Id);

        return expect(siteDesignTask,
            "site design task should've been created").to.not.be.null;
    }));

    it("getSiteDesignTask", pnpTest("fac83666-ede6-452c-a60d-9fa6defb0298", async function () {

        const { title } = await this.props({
            title: `Test_get_task_run_sitedesign_${getRandomString(8)}`,
        });

        const sd = await this.pnp.sp.siteDesigns.createSiteDesign({
            Title: title,
            WebTemplate: "68",
        });

        createdSiteDesignIds.push(sd.Id);

        const originalTask = await this.pnp.sp.web.addSiteDesignTask(sd.Id);

        return expect(this.pnp.sp.siteDesigns.getSiteDesignTask(originalTask.ID),
            "site design task should've been fetched").to.eventually.be.fulfilled;
    }));

    it("getSiteDesignRunStatus", pnpTest("a3179cec-471c-4753-8d86-32dd7b3f4d4b", async function () {

        const { title } = await this.props({
            title: `Test_add_task_run_sitedesign_${getRandomString(8)}`,
        });

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
    }));

    after(pnpTest("11dc4b02-00cf-419b-8d2e-6c688352f40b", function () {
        if (this.pnp.settings.enableWebTests) {
            return Promise.all(createdSiteDesignIds.map((sdId) => {
                return this.pnp.sp.siteDesigns.deleteSiteDesign(sdId);
            }));
        }
    }));
});
