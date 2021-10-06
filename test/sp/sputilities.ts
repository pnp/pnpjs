import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/sputilities";
import { getSP, testSettings } from "../main.js";
import { PrincipalType, PrincipalSource } from "@pnp/sp";
import { combine } from "@pnp/core";
import { SPRest } from "@pnp/sp";

describe("SPUtilities", function () {
    if (testSettings.enableWebTests) {
        let _spRest: SPRest = null;

        before(function () {
            _spRest = getSP();
        });
        // commenting out as not every test account has an email associated with it.
        // this method is unchanged for years, so likely OK to no test
        // it("sendEmail", async function () {
        //     const currentUserEmailAddress = await _spRest.utility.getCurrentUserEmailAddresses();

        //     const headers: TypedHash<string> = {
        //         "content-type": "text/html",
        //     };

        //     const emailProps: IEmailProperties = {
        //         AdditionalHeaders: headers,
        //         BCC: [currentUserEmailAddress],
        //         Body: "Here is the body. <b>It supports html</b>",
        //         CC: [currentUserEmailAddress],
        //         Subject: "This email is about...",
        //         To: [currentUserEmailAddress],
        //     };

        //     return expect(_spRest.utility.sendEmail(emailProps)).to.eventually.be.fulfilled;
        // });

        it("getCurrentUserEmailAddresses", function () {
            return expect(_spRest.utility.getCurrentUserEmailAddresses()).to.eventually.be.fulfilled;
        });

        it("resolvePrincipal", async function () {
            const currentUserEmailAddress = await _spRest.utility.getCurrentUserEmailAddresses();

            return expect(_spRest.utility.resolvePrincipal(currentUserEmailAddress, PrincipalType.User, PrincipalSource.All, true, false, true)).to.be.eventually.fulfilled;
        });

        if (testSettings.testUser?.length > 0) {
            it("searchPrincipals", async function () {
                const ensureTestUser = await _spRest.web.ensureUser(testSettings.testUser);
                const userId = ensureTestUser.data.Id;
                const user = await _spRest.web.siteUsers.getById(userId)();

                return expect(_spRest.utility.searchPrincipals(user.Title, PrincipalType.User, PrincipalSource.All, "", 1)).to.eventually.be.an.instanceOf(Array).and.not.be.empty;
            });
        }

        it("createEmailBodyForInvitation", async function () {
            const homePageAddress = combine(testSettings.sp.webUrl, "/SitePages/Home.aspx");
            return expect(_spRest.utility.createEmailBodyForInvitation(homePageAddress)).to.be.eventually.fulfilled;
        });

        it("expandGroupsToPrincipals", async function () {
            return expect(_spRest.utility.expandGroupsToPrincipals(["Everyone"], 10)).to.eventually.be.an.instanceOf(Array).and.not.be.empty;
        });

        // Removed
        // it("createWikiPage", async function () {
        //     const currentWeb = await _spRest.web.select("ServerRelativeUrl")();
        //     const wikiPageName = `Test_WikiPage_${getRandomString(5)}.aspx`;
        //     const newWikiPageAddress = combine("/", currentWeb.ServerRelativeUrl, "/SitePages/", wikiPageName);

        //     const newPage = await _spRest.utility.createWikiPage({
        //         ServerRelativeUrl: newWikiPageAddress,
        //         WikiHtmlContent: "This is my <b>page</b> content. It supports rich html.",
        //     });

        //     return expect(newPage.data.Exists).to.be.true;
        // });
    }
});
