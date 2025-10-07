import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/regional-settings";
import { pnpTest } from  "../pnp-test.js";

describe("Regional Settings", function () {

    before(pnpTest("1669fe9f-9129-4773-a2fd-91a246594983", function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    }));

    it("regionalsettings()", pnpTest("bd3f7793-1f13-42a2-b3bc-a7ee5c2566bc", function () {
        return expect(this.pnp.sp.web.regionalSettings()).to.eventually.be.fulfilled;
    }));

    it("regionalsettings.select()()", pnpTest("a6a9fcfb-f1f5-45a3-bfb3-dc8206d88826", function () {
        return expect(this.pnp.sp.web.regionalSettings.select("DecimalSeparator", "ListSeparator", "IsUIRightToLeft")()).to.eventually.be.fulfilled;
    }));

    it("getInstalledLanguages", pnpTest("a17ab462-91c4-4a44-b377-59c8aaec6c95", function () {
        return expect(this.pnp.sp.web.regionalSettings.getInstalledLanguages()).to.eventually.be.fulfilled;
    }));

    it("timeZones", pnpTest("353ebff5-0db8-418f-9de7-abd1b7b5a6cb", function () {
        return expect(this.pnp.sp.web.regionalSettings.timeZones()).to.eventually.be.fulfilled;
    }));

    it("timeZones.getById", pnpTest("10fde57a-598f-409e-b2cc-a825c1e0db4d", async function () {

        const tz = await this.pnp.sp.web.regionalSettings.timeZones.getById(23);

        return expect(tz).to.haveOwnProperty("Description");
    }));

    it("timeZone", pnpTest("f9c95b70-b123-4edf-8c21-8063d9606282", function () {
        return expect(this.pnp.sp.web.regionalSettings.timeZone()).to.eventually.be.fulfilled;
    }));

    it("timeZone.localTimeToUTC", pnpTest("5781b20c-8a75-48be-8cd5-ac12b1367641", function () {
        return expect(this.pnp.sp.web.regionalSettings.timeZone.localTimeToUTC(new Date())).to.eventually.be.fulfilled;
    }));

    it("timeZone.utcToLocalTime", pnpTest("493b9fb6-50e9-48ce-b09c-83b73d20f8e5", function () {
        return expect(this.pnp.sp.web.regionalSettings.timeZone.utcToLocalTime(new Date())).to.eventually.be.fulfilled;
    }));

    it("titleResource", pnpTest("c93bbdd8-7b76-414b-8cc3-20b12fdb3a90", function () {

        return expect(this.pnp.sp.web.titleResource("en-us")).to.eventually.be.fulfilled;
    }));

    it("descriptionResource", pnpTest("20d26c3f-0400-4193-b93f-38697399b6f9", function () {

        return expect(this.pnp.sp.web.descriptionResource("en-us")).to.eventually.be.fulfilled;
    }));
});
