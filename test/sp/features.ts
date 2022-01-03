import { expect } from "chai";
import { getSP } from "../main.js";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/features";
import { SPFI } from "@pnp/sp";

describe("Features", function () {

    let _spfi: SPFI = null;

    before(function () {

        if (!this.settings.enableWebTests) {
            this.skip();
        }

        _spfi = getSP();
    });

    describe("Web", function () {
        // Web feature - Following Content
        const webFeatureId = "a7a2793e-67cd-4dc1-9fd0-43f61581207a";

        it("getbyid", function () {
            return expect(_spfi.web.features.getById(webFeatureId)());
        });

        it("add", async function () {

            // Check if feature is already active.
            const res = await _spfi.web.features.getById(webFeatureId)();

            if (res["odata.null"]) {

                // Feature not active already
                return expect(_spfi.web.features.add(webFeatureId)).to.be.eventually.fulfilled;
            } else {

                // Feature already active. Call should fail
                return expect(_spfi.web.features.add(webFeatureId)).to.be.eventually.rejected;
            }
        });

        it("add (force)", function () {

            return expect(_spfi.web.features.add(webFeatureId, true)).to.be.eventually.fulfilled;
        });

        it("remove", async function () {

            // Check if feature is active.
            const res = await _spfi.web.features.getById(webFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to remove should fail
                return expect(_spfi.web.features.remove(webFeatureId)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(_spfi.web.features.remove(webFeatureId)).to.be.eventually.fulfilled;
            }
        });

        it("remove (force)", async function () {

            // Check if feature is active.
            const res = await _spfi.web.features.getById(webFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to remove should fail
                return expect(_spfi.web.features.remove(webFeatureId, true)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(_spfi.web.features.remove(webFeatureId, true)).to.be.eventually.fulfilled;
            }
        });

        it("deactivate", async function () {

            // Check if feature is active.
            const res = await _spfi.web.features.getById(webFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to deactivate should fail
                return expect(_spfi.web.features.remove(webFeatureId, true)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(_spfi.web.features.remove(webFeatureId, true)).to.be.eventually.fulfilled;
            }
        });

        it("deactivate (force)", async function () {

            // Check if feature is active.
            const res = await _spfi.web.features.getById(webFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to deactivate should fail
                return expect(_spfi.web.features.remove(webFeatureId, true)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(_spfi.web.features.remove(webFeatureId, true)).to.be.eventually.fulfilled;
            }
        });
    });

    describe("Site", function () {
        // Site feature - SharePoint Lists and Libraries experience
        const siteFeatureId = "e3540c7d-6bea-403c-a224-1a12eafee4c4";

        it("getbyid", function () {
            return expect(_spfi.site.features.getById(siteFeatureId)());
        });

        it("add", async function () {

            // Check if feature is already active.
            const res = await _spfi.site.features.getById(siteFeatureId)();

            if (res["odata.null"]) {

                // Feature not active already
                return expect(_spfi.site.features.add(siteFeatureId)).to.be.eventually.fulfilled;
            } else {

                // Feature already active. Call should fail
                return expect(_spfi.site.features.add(siteFeatureId)).to.be.eventually.rejected;
            }
        });

        it("add (force)", function () {
            return expect(_spfi.site.features.add(siteFeatureId, true)).to.be.eventually.fulfilled;
        });

        it("remove", async function () {

            // Check if feature is active.
            const res = await _spfi.site.features.getById(siteFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to remove should fail
                return expect(_spfi.site.features.remove(siteFeatureId)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(_spfi.site.features.remove(siteFeatureId)).to.be.eventually.fulfilled;
            }
        });

        it("remove (force)", async function () {

            // Check if feature is active.
            const res = await _spfi.site.features.getById(siteFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to remove should fail
                return expect(_spfi.site.features.remove(siteFeatureId, true)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(_spfi.site.features.remove(siteFeatureId, true)).to.be.eventually.fulfilled;
            }
        });

        it("deactivate", async function () {

            // Check if feature is active.
            const res = await _spfi.site.features.getById(siteFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to deactivate should fail
                return expect(_spfi.site.features.remove(siteFeatureId, true)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(_spfi.site.features.remove(siteFeatureId, true)).to.be.eventually.fulfilled;
            }
        });

        it("deactivate (force)", async function () {

            // Check if feature is active.
            const res = await _spfi.site.features.getById(siteFeatureId)();

            if (res["odata.null"]) {

                // Feature not active. Call to deactivate should fail
                return expect(_spfi.site.features.remove(siteFeatureId, true)).to.be.eventually.rejected;
            } else {

                // Feature active.
                return expect(_spfi.site.features.remove(siteFeatureId, true)).to.be.eventually.fulfilled;
            }
        });
    });
});
