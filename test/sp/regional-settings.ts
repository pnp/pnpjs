import { expect } from "chai";
import { testSettings } from "../main";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/regional-settings";

describe("Regional Settings", () => {

    if (testSettings.enableWebTests) {

        it("regionalsettings()", function () {
            return expect(sp.web.regionalSettings()).to.eventually.be.fulfilled;
        });

        it("regionalsettings.select()()", function () {
            return expect(sp.web.regionalSettings.select("DecimalSeparator", "ListSeparator", "IsUIRightToLeft")()).to.eventually.be.fulfilled;
        });

        it("getInstalledLanguages", function () {
            return expect(sp.web.regionalSettings.getInstalledLanguages()).to.eventually.be.fulfilled;
        });

        it("timeZones", function () {
            return expect(sp.web.regionalSettings.timeZones()).to.eventually.be.fulfilled;
        });

        it("timeZones.getById", function () {
            return expect(sp.web.regionalSettings.timeZones.getById(23)).to.eventually.be.fulfilled;
        });

        it("timeZones.getById used", async function () {

            const tz = await sp.web.regionalSettings.timeZones.getById(23);

            expect(tz).to.haveOwnProperty("Description");

            return expect(tz.utcToLocalTime(new Date())).to.eventually.be.fulfilled;
        });

        it("timeZone", function () {
            return expect(sp.web.regionalSettings.timeZone()).to.eventually.be.fulfilled;
        });

        it("timeZone.localTimeToUTC", function () {
            return expect(sp.web.regionalSettings.timeZone.localTimeToUTC(new Date())).to.eventually.be.fulfilled;
        });

        it("timeZone.utcToLocalTime", function () {
            return expect(sp.web.regionalSettings.timeZone.utcToLocalTime(new Date())).to.eventually.be.fulfilled;
        });

        it("handle language based titleResource", function () {

            return expect(sp.web.titleResource("en-us")).to.eventually.be.fulfilled;
        });

        it("handle language based descriptionResource", function () {

            return expect(sp.web.descriptionResource("en-us")).to.eventually.be.fulfilled;
        });
    }
});
