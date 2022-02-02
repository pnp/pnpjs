import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/regional-settings";

describe("Regional Settings", function () {

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("regionalsettings()", function () {
        return expect(this.pnp.sp.web.regionalSettings()).to.eventually.be.fulfilled;
    });

    it("regionalsettings.select()()", function () {
        return expect(this.pnp.sp.web.regionalSettings.select("DecimalSeparator", "ListSeparator", "IsUIRightToLeft")()).to.eventually.be.fulfilled;
    });

    it("getInstalledLanguages", function () {
        return expect(this.pnp.sp.web.regionalSettings.getInstalledLanguages()).to.eventually.be.fulfilled;
    });

    it("timeZones", function () {
        return expect(this.pnp.sp.web.regionalSettings.timeZones()).to.eventually.be.fulfilled;
    });

    it("timeZones.getById", async function () {

        const tz = await this.pnp.sp.web.regionalSettings.timeZones.getById(23);

        return expect(tz).to.haveOwnProperty("Description");
    });

    it("timeZone", function () {
        return expect(this.pnp.sp.web.regionalSettings.timeZone()).to.eventually.be.fulfilled;
    });

    it("timeZone.localTimeToUTC", function () {
        return expect(this.pnp.sp.web.regionalSettings.timeZone.localTimeToUTC(new Date())).to.eventually.be.fulfilled;
    });

    it("timeZone.utcToLocalTime", function () {
        return expect(this.pnp.sp.web.regionalSettings.timeZone.utcToLocalTime(new Date())).to.eventually.be.fulfilled;
    });

    it("titleResource", function () {

        return expect(this.pnp.sp.web.titleResource("en-us")).to.eventually.be.fulfilled;
    });

    it("descriptionResource", function () {

        return expect(this.pnp.sp.web.descriptionResource("en-us")).to.eventually.be.fulfilled;
    });
});
