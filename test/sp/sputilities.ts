import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/sputilities";
// import { IEmailProperties } from "@pnp/sp/sputilities";
import { sp } from "@pnp/sp";
import { testSettings } from "../main";
import { PrincipalType, PrincipalSource } from "@pnp/sp";
import { combine, getRandomString } from "@pnp/common";
import { Web } from "@pnp/sp/webs";

describe("SPUtilities", function () {
    if (testSettings.enableWebTests) {

        // commenting out as not every test account has an email associated with it.
        // this method is unchanged for years, so likely OK to no test
        // it("sendEmail", async function () {
        //     const currentUserEmailAddress = await sp.utility.getCurrentUserEmailAddresses();

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

        //     return expect(sp.utility.sendEmail(emailProps)).to.eventually.be.fulfilled;
        // });

        it("getCurrentUserEmailAddresses", function () {
            return expect(sp.utility.getCurrentUserEmailAddresses()).to.eventually.be.fulfilled;
        });

        it("resolvePrincipal", async function () {
            const currentUserEmailAddress = await sp.utility.getCurrentUserEmailAddresses();

            return expect(sp.utility.resolvePrincipal(currentUserEmailAddress, PrincipalType.User, PrincipalSource.All, true, false, true)).to.be.eventually.fulfilled;
        });

        it("searchPrincipals", async function () {

            const users = await sp.web.siteUsers.top(1).select("Title")();

            return expect(sp.utility.searchPrincipals(users[0].Title, PrincipalType.User, PrincipalSource.All, "", 1)).to.eventually.be.an.instanceOf(Array).and.not.be.empty;
        });

        it("createEmailBodyForInvitation", async function () {
            const homePageAddress = combine(testSettings.sp.webUrl, "/SitePages/Home.aspx");
            return expect(sp.utility.createEmailBodyForInvitation(homePageAddress)).to.be.eventually.fulfilled;
        });

        it("expandGroupsToPrincipals", async function () {
            return expect(sp.utility.expandGroupsToPrincipals(["Everyone"], 10)).to.eventually.be.an.instanceOf(Array).and.not.be.empty;
        });

        it("createWikiPage", async function () {
            const currentWeb = await Web(testSettings.sp.webUrl).select("ServerRelativeUrl").get();
            const wikiPageName = `Test_WikiPage_${getRandomString(5)}.aspx`;
            const newWikiPageAddress = combine("/", currentWeb.ServerRelativeUrl, "/SitePages/", wikiPageName);

            const newPage = await sp.utility.createWikiPage({
                ServerRelativeUrl: newWikiPageAddress,
                WikiHtmlContent: "This is my <b>page</b> content. It supports rich html.",
            });

            return expect(newPage.data.Exists).to.be.true;
        });
    }
});
