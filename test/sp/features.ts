import { expect } from "chai";
import { testSettings } from "../main";

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/features";

describe("Features", () => {

    if (testSettings.enableWebTests) {

        // Web feature - Following Content
        const webFeatureId = "a7a2793e-67cd-4dc1-9fd0-43f61581207a";

        // Site feature - SharePoint Lists and Libraries experience
        const siteFeatureId = "e3540c7d-6bea-403c-a224-1a12eafee4c4";

        it("web.features.getbyid", function () {
            return expect(sp.web.features.getById(webFeatureId)());
        });

        it("web.features.add", async function () {

            // Check if feature is already active.
            const res = await sp.web.features.getById(webFeatureId)();

            if (res["odata.null"]) {

                // Feature not active already
                return expect(sp.web.features.add(webFeatureId)).to.be.eventually.fulfilled;
            } else {

                // Feature already active. Call should fail
                return expect(sp.web.features.add(webFeatureId)).to.be.eventually.rejected;
            }
        });

        it("web.features.add force", function () {

            return expect(sp.web.features.add(webFeatureId, true)).to.be.eventually.fulfilled;
        });

        it("web.features.remove", async function () {

            // Check if feature is active.
            const res = await sp.web.features.getById(webFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to remove should fail
                return expect(sp.web.features.remove(webFeatureId)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(sp.web.features.remove(webFeatureId)).to.be.eventually.fulfilled;
            }
        });

        it("web.features.remove force", async function () {

            // Check if feature is active.
            const res = await sp.web.features.getById(webFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to remove should fail
                return expect(sp.web.features.remove(webFeatureId, true)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(sp.web.features.remove(webFeatureId, true)).to.be.eventually.fulfilled;
            }
        });

        it("Web Feature.deactivate", async function () {

            // Check if feature is active.
            const res = await sp.web.features.getById(webFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to deactivate should fail
                return expect(sp.web.features.getById(webFeatureId).deactivate()).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(sp.web.features.getById(webFeatureId).deactivate()).to.be.eventually.fulfilled;
            }
        });

        it("Web Feature.deactivate force", async function () {

            // Check if feature is active.
            const res = await sp.web.features.getById(webFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to deactivate should fail
                return expect(sp.web.features.getById(webFeatureId).deactivate(true)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(sp.web.features.getById(webFeatureId).deactivate(true)).to.be.eventually.fulfilled;
            }
        });

        it("site.features.getbyid", function () {
            return expect(sp.site.features.getById(siteFeatureId)());
        });

        it("site.features.add", async function () {

            // Check if feature is already active.
            const res = await sp.site.features.getById(siteFeatureId)();

            if (res["odata.null"]) {

                // Feature not active already
                return expect(sp.site.features.add(siteFeatureId)).to.be.eventually.fulfilled;
            } else {

                // Feature already active. Call should fail
                return expect(sp.site.features.add(siteFeatureId)).to.be.eventually.rejected;
            }
        });

        it("site.features.add force", function () {
            return expect(sp.site.features.add(siteFeatureId, true)).to.be.eventually.fulfilled;
        });

        it("site.features.remove", async function () {

            // Check if feature is active.
            const res = await sp.site.features.getById(siteFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to remove should fail
                return expect(sp.site.features.remove(siteFeatureId)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(sp.site.features.remove(siteFeatureId)).to.be.eventually.fulfilled;
            }
        });

        it("site.features.remove force", async function () {

            // Check if feature is active.
            const res = await sp.site.features.getById(siteFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to remove should fail
                return expect(sp.site.features.remove(siteFeatureId, true)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(sp.site.features.remove(siteFeatureId, true)).to.be.eventually.fulfilled;
            }
        });

        it("Site Feature.deactivate", async function () {

            // Check if feature is active.
            const res = await sp.site.features.getById(siteFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to deactivate should fail
                return expect(sp.site.features.getById(siteFeatureId).deactivate()).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(sp.site.features.getById(siteFeatureId).deactivate()).to.be.eventually.fulfilled;
            }
        });

        it("Site Feature.deactivate force", async function () {

            // Check if feature is active.
            const res = await sp.site.features.getById(webFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to deactivate should fail
                return expect(sp.site.features.getById(siteFeatureId).deactivate(true)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(sp.site.features.getById(siteFeatureId).deactivate(true)).to.be.eventually.fulfilled;
            }
        });
    }
});
