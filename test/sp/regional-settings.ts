import { expect } from "chai";
import { getSP, testSettings } from "../main.js";
import "@pnp/sp/webs";
import "@pnp/sp/regional-settings";
import { SPFI } from "@pnp/sp";

describe("Regional Settings", function () {

    if (testSettings.enableWebTests) {
        let _spfi: SPFI = null;

        before(function () {
            _spfi = getSP();
        });

        it(".regionalsettings()", function () {
            return expect(_spfi.web.regionalSettings()).to.eventually.be.fulfilled;
        });

        it(".regionalsettings.select()()", function () {
            return expect(_spfi.web.regionalSettings.select("DecimalSeparator", "ListSeparator", "IsUIRightToLeft")()).to.eventually.be.fulfilled;
        });

        it(".getInstalledLanguages", function () {
            return expect(_spfi.web.regionalSettings.getInstalledLanguages()).to.eventually.be.fulfilled;
        });

        it(".timeZones", function () {
            return expect(_spfi.web.regionalSettings.timeZones()).to.eventually.be.fulfilled;
        });

        it(".timeZones.getById", async function () {

            const tz = await _spfi.web.regionalSettings.timeZones.getById(23);

            return expect(tz).to.haveOwnProperty("Description");
        });

        it(".timeZone", function () {
            return expect(_spfi.web.regionalSettings.timeZone()).to.eventually.be.fulfilled;
        });

        it(".timeZone.localTimeToUTC", function () {
            return expect(_spfi.web.regionalSettings.timeZone.localTimeToUTC(new Date())).to.eventually.be.fulfilled;
        });

        it(".timeZone.utcToLocalTime", function () {
            return expect(_spfi.web.regionalSettings.timeZone.utcToLocalTime(new Date())).to.eventually.be.fulfilled;
        });

        it(".titleResource", function () {

            return expect(_spfi.web.titleResource("en-us")).to.eventually.be.fulfilled;
        });

        it(".descriptionResource", function () {

            return expect(_spfi.web.descriptionResource("en-us")).to.eventually.be.fulfilled;
        });
    }
});
