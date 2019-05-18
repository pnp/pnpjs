
import { getRandomString } from "@pnp/common";
import { expect } from "chai";
import { sp } from "@pnp/sp";
import { testSettings } from "../main";
// import { IInvokableTest } from "../types";

describe("SiteDesigns", function () {

    if (testSettings.enableWebTests) {

        it(".createSiteDesign", function () {

            const title = `Test_create_sitedesign_${getRandomString(8)}`;
            return expect(sp.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68"
            }), `site design '${title}' should've been created`).to.eventually.be.fulfilled;
        });

        it(".deleteSiteDesign", async function () {

            const title = `Test_to_be_deleted_sitedesign_${getRandomString(8)}`;

            const sd = await sp.siteDesigns.createSiteDesign({
                Title: title,
                WebTemplate: "68"
            });

            return expect(sp.siteDesigns.deleteSiteDesign(sd.Id), `site design '${title}' should've been deleted`).to.eventually.be.fulfilled;
        });
    }
});