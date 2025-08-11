import { expect } from "chai";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/features";
import { pnpTest } from "../pnp-test.js";

describe("Features", function () {

    before(pnpTest("d9f8c3a7-4b2e-4c8a-9e3f-2a6b7d8e9f0c", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    }));

    describe("Web", function () {

        // Web feature - Following Content
        const webFeatureId = "a7a2793e-67cd-4dc1-9fd0-43f61581207a";

        it("getbyid", pnpTest("4b3edada-a2db-44f9-a4e5-dd4844e3fe3c", function () {
            return expect(this.pnp.sp.web.features.getById(webFeatureId)());
        }));

        it("add", pnpTest("6326f644-48ee-4aa6-bc6c-d03ee2fc27b0", async function () {

            // Check if feature is already active.
            const res = await this.pnp.sp.web.features.getById(webFeatureId)();

            if (res["odata.null"]) {

                // Feature not active already
                return expect(this.pnp.sp.web.features.add(webFeatureId)).to.be.eventually.fulfilled;
            } else {

                // Feature already active. Call should fail
                return expect(this.pnp.sp.web.features.add(webFeatureId)).to.be.eventually.rejected;
            }
        }));

        it("add (force)", pnpTest("49efbe85-ba79-4032-9b24-a558406351f8", function () {

            return expect(this.pnp.sp.web.features.add(webFeatureId, true)).to.be.eventually.fulfilled;
        }));

        it("remove", pnpTest("2b424714-f0af-44b6-a621-fcd920411b3d", async function () {

            // Check if feature is active.
            const res = await this.pnp.sp.web.features.getById(webFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to remove should fail
                return expect(this.pnp.sp.web.features.remove(webFeatureId)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(this.pnp.sp.web.features.remove(webFeatureId)).to.be.eventually.fulfilled;
            }
        }));

        it("remove (force)", pnpTest("6bbef24f-08bc-479b-b1e8-6d655d2fc0a0", async function () {

            // Check if feature is active.
            const res = await this.pnp.sp.web.features.getById(webFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to remove should fail
                return expect(this.pnp.sp.web.features.remove(webFeatureId, true)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(this.pnp.sp.web.features.remove(webFeatureId, true)).to.be.eventually.fulfilled;
            }
        }));

        it("deactivate", pnpTest("50004585-d1d4-4d0c-9513-bbbc80e126af", async function () {

            // Check if feature is active.
            const res = await this.pnp.sp.web.features.getById(webFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to deactivate should fail
                return expect(this.pnp.sp.web.features.remove(webFeatureId, true)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(this.pnp.sp.web.features.remove(webFeatureId, true)).to.be.eventually.fulfilled;
            }
        }));

        it("deactivate (force)", pnpTest("5ef504c5-b032-4c1c-ad28-481f0717caad", async function () {

            // Check if feature is active.
            const res = await this.pnp.sp.web.features.getById(webFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to deactivate should fail
                return expect(this.pnp.sp.web.features.remove(webFeatureId, true)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(this.pnp.sp.web.features.remove(webFeatureId, true)).to.be.eventually.fulfilled;
            }
        }));
    });

    describe("Site", function () {
        // Site feature - SharePoint Lists and Libraries experience
        const siteFeatureId = "e3540c7d-6bea-403c-a224-1a12eafee4c4";

        it("getbyid", pnpTest("39159cb5-e4b6-4a80-93fa-cbcb9cf1870f", function () {
            return expect(this.pnp.sp.site.features.getById(siteFeatureId)());
        }));

        it("add", pnpTest("c2dddd4a-d4fc-45b1-8cd7-7e32e135b295", async function () {

            // Check if feature is already active.
            const res = await this.pnp.sp.site.features.getById(siteFeatureId)();

            if (res["odata.null"]) {

                // Feature not active already
                return expect(this.pnp.sp.site.features.add(siteFeatureId)).to.be.eventually.fulfilled;
            } else {

                // Feature already active. Call should fail
                return expect(this.pnp.sp.site.features.add(siteFeatureId)).to.be.eventually.rejected;
            }
        }));

        it("add (force)", pnpTest("c1319dff-3d74-4fc2-a316-14b33857ae7c", function () {
            return expect(this.pnp.sp.site.features.add(siteFeatureId, true)).to.be.eventually.fulfilled;
        }));

        it("remove", pnpTest("01f804a3-72f5-4c44-8e0d-74d838e1ccb8", async function () {

            // Check if feature is active.
            const res = await this.pnp.sp.site.features.getById(siteFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to remove should fail
                return expect(this.pnp.sp.site.features.remove(siteFeatureId)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(this.pnp.sp.site.features.remove(siteFeatureId)).to.be.eventually.fulfilled;
            }
        }));

        it("remove (force)", pnpTest("70576732-ef2d-4cb1-aef6-1860ffc20242", async function () {

            // Check if feature is active.
            const res = await this.pnp.sp.site.features.getById(siteFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to remove should fail
                return expect(this.pnp.sp.site.features.remove(siteFeatureId, true)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(this.pnp.sp.site.features.remove(siteFeatureId, true)).to.be.eventually.fulfilled;
            }
        }));

        it("deactivate", pnpTest("eb35df79-d1e6-4c03-ad47-252ec7923995", async function () {

            // Check if feature is active.
            const res = await this.pnp.sp.site.features.getById(siteFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to deactivate should fail
                return expect(this.pnp.sp.site.features.remove(siteFeatureId, true)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(this.pnp.sp.site.features.remove(siteFeatureId, true)).to.be.eventually.fulfilled;
            }
        }));

        it("deactivate (force)", pnpTest("3bd0b10b-51ba-4180-9a2d-d36e0c527c9f", async function () {

            // Check if feature is active.
            const res = await this.pnp.sp.site.features.getById(siteFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to deactivate should fail
                return expect(this.pnp.sp.site.features.remove(siteFeatureId, true)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(this.pnp.sp.site.features.remove(siteFeatureId, true)).to.be.eventually.fulfilled;
            }
        }));
    });
});
