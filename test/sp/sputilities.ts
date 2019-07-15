import { expect } from "chai";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/sputilities";
import { IEmailProperties } from '@pnp/sp/src/sputilities';
import { sp } from "@pnp/sp";
import { testSettings } from "../main";
import { PrincipalType, PrincipalSource } from '@pnp/sp'
import { combine, getRandomString, TypedHash  } from '@pnp/common';
import { Web } from '@pnp/sp/src/webs';

describe("SPUtilities", function () {
    if (testSettings.enableWebTests) {
        it("sendEmail", async function() {
            let currentUserEmailAddress = await sp.utility.getCurrentUserEmailAddresses();

            const headers : TypedHash<string> = {
                "content-type": "text/html"
            } ;

            const emailProps: IEmailProperties = {
                To: [currentUserEmailAddress],
                CC: [currentUserEmailAddress],
                BCC: [currentUserEmailAddress],
                AdditionalHeaders: headers,
                Subject: "This email is about...",
                Body: "Here is the body. <b>It supports html</b>",
            };

            return expect(sp.utility.sendEmail(emailProps)).to.eventually.be.fulfilled;
        });

        it("getCurrentUserEmailAddresses", function () {
            return expect(sp.utility.getCurrentUserEmailAddresses()).to.eventually.be.fulfilled;
        });

        it("resolvePrincipal", async function() {
            let currentUserEmailAddress = await sp.utility.getCurrentUserEmailAddresses();

            return expect(sp.utility.resolvePrincipal(currentUserEmailAddress, PrincipalType.User, PrincipalSource.All, true, false, true)).to.be.eventually.fulfilled;
        });

        it("searchPrincipals", async function()
        {
            return expect(sp.utility.searchPrincipals("admin", PrincipalType.User, PrincipalSource.All, "", 1)).to.eventually.be.an.instanceOf(Array).and.not.be.empty;
        });

        it("createEmailBodyForInvitation", async function()
        {
            let homePageAddress = combine(testSettings.sp.webUrl, "/SitePages/Home.aspx");
            return expect(sp.utility.createEmailBodyForInvitation(homePageAddress)).to.be.eventually.fulfilled;
        });

        it("expandGroupsToPrincipals", async function() {
            return expect(sp.utility.expandGroupsToPrincipals(["Everyone"], 10)).to.eventually.be.an.instanceOf(Array).and.not.be.empty;
        });

        it("createWikiPage", async function()
        {
            let currentWeb = await Web(testSettings.sp.webUrl).select("ServerRelativeUrl").get();
            const wikiPageName = `Test_WikiPage_${getRandomString(5)}.aspx`;
            let newWikiPageAddress = combine("/", currentWeb.ServerRelativeUrl, '/SitePages/', wikiPageName);            
            
            let newPage = await sp.utility.createWikiPage({
                ServerRelativeUrl: newWikiPageAddress,
                WikiHtmlContent: "This is my <b>page</b> content. It supports rich html.",
            });

            expect(newPage.data.Exists).to.be.true;
        });
    }
});
