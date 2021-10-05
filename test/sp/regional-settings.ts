import { expect } from "chai";
import { getSP, testSettings } from "../main.js";
import "@pnp/sp/webs";
import "@pnp/sp/regional-settings";
import { SPRest } from "@pnp/sp";

describe("Regional Settings", function () {

    if (testSettings.enableWebTests) {
        let _spRest: SPRest = null;

        before(function () {
            _spRest = getSP();
        });

        it("regionalsettings()", function () {
            return expect(_spRest.web.regionalSettings()).to.eventually.be.fulfilled;
        });

        it("regionalsettings.select()()", function () {
            return expect(_spRest.web.regionalSettings.select("DecimalSeparator", "ListSeparator", "IsUIRightToLeft")()).to.eventually.be.fulfilled;
        });

        it("getInstalledLanguages", function () {
            return expect(_spRest.web.regionalSettings.getInstalledLanguages()).to.eventually.be.fulfilled;
        });

        it("timeZones", function () {
            return expect(_spRest.web.regionalSettings.timeZones()).to.eventually.be.fulfilled;
        });

        it("timeZones.getById", function () {
            return expect(_spRest.web.regionalSettings.timeZones.getById(23)).to.eventually.be.fulfilled;
        });

        it("timeZones.getById used", async function () {

            const tz = await _spRest.web.regionalSettings.timeZones.getById(23);

            return expect(tz).to.haveOwnProperty("Description");
        });

        it("timeZone", function () {
            return expect(_spRest.web.regionalSettings.timeZone()).to.eventually.be.fulfilled;
        });

        it("timeZone.localTimeToUTC", function () {
            return expect(_spRest.web.regionalSettings.timeZone.localTimeToUTC(new Date())).to.eventually.be.fulfilled;
        });

        it("timeZone.utcToLocalTime", function () {
            return expect(_spRest.web.regionalSettings.timeZone.utcToLocalTime(new Date())).to.eventually.be.fulfilled;
        });

        it("handle language based titleResource", function () {

            return expect(_spRest.web.titleResource("en-us")).to.eventually.be.fulfilled;
        });

        it("handle language based descriptionResource", function () {

            return expect(_spRest.web.descriptionResource("en-us")).to.eventually.be.fulfilled;
        });
    }
});
