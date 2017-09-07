import { expect } from "chai";
import pnp from "../../src/pnp";
import { testSettings } from "../test-config.test";
import { Util } from "../../src/utils/util";

describe("Site", () => {

    if (testSettings.enableWebTests) {

        describe("rootWeb", () => {
            it("should return the root web", () => {
                return expect(pnp.sp.site.rootWeb.get()).to.eventually.have.property("Title");
            });
        });

        describe("userCustomActions", () => {
            it("should return the set of userCustomActions", () => {
                return expect(pnp.sp.site.userCustomActions.get()).to.eventually.be.fulfilled;
            });
        });

        describe("getContextInfo", () => {
            it("should get the site's context info", () => {
                return expect(pnp.sp.site.getContextInfo()).to.eventually.be.fulfilled;
            });
        });

        describe("getDocumentLibraries", () => {
            it("should get the site's document libraries", () => {
                return expect(pnp.sp.site.getDocumentLibraries(testSettings.siteUrl)).to.eventually.not.be.empty;
            });
        });

        describe("getWebUrlFromPageUrl", () => {
            it("should get the site's url from the pages url", () => {
                let pageUrl = Util.combinePaths(testSettings.webUrl, "/SitePages/Home.aspx");
                return expect(pnp.sp.site.getWebUrlFromPageUrl(pageUrl)).to.eventually.equal(testSettings.webUrl.replace(/\/$/, ""));
            });
        });

        describe("openWebById", () => {
            it("should get a web by id", () => {

                const chain = pnp.sp.web.select("Id").get().then(w => {

                    return pnp.sp.site.openWebById(w.Id).then(ww => {

                        // prove that we can successfully chain from the Web instance
                        return ww.web.select("Title").get();
                    });
                });

                return expect(chain).to.eventually.be.fulfilled;
            });
        });
    }
});
