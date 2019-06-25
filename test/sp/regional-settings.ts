import { expect } from "chai";
import { testSettings } from "../main";
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/regional-settings";

describe("Regional Settings", () => {

    if (testSettings.enableWebTests) {

        it("regionalsettings()", function () {
            return expect(sp.web.regionalSettings()).to.eventually.be.fulfilled;
        });

        it("regionalsettings.select()()", function () {
            return expect(sp.web.regionalSettings.select("DecimalSeparator", "ListSeparator", "IsUIRightToLeft")()).to.eventually.be.fulfilled;
        });

        it("installedLanguages", function () {
            return expect(sp.web.regionalSettings.installedLanguages()).to.eventually.be.fulfilled;
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
    }
});
