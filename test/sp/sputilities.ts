import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/sputilities";
import { getSP } from "../main.js";
import { PrincipalType, PrincipalSource } from "@pnp/sp";
import { combine, stringIsNullOrEmpty } from "@pnp/core";
import { SPFI } from "@pnp/sp";
import { IEmailProperties } from "@pnp/sp/sputilities";

// cannot test with app permissions
describe.skip("SPUtilities", function () {

    let _spfi: SPFI = null;

    before(async function () {

        if (!this.settings.enableWebTests) {
            this.skip();
        }

        _spfi = getSP();

        if (!stringIsNullOrEmpty(this.settings.testUser)) {
            await _spfi.web.ensureUser(this.settings.testUser);
        }
    });

    it("getCurrentUserEmailAddresses", function () {
        return expect(_spfi.utility.getCurrentUserEmailAddresses()).to.eventually.be.fulfilled;
    });

    it("resolvePrincipal", async function () {
        const currentUserEmailAddress = await _spfi.utility.getCurrentUserEmailAddresses();

        return expect(_spfi.utility.resolvePrincipal(currentUserEmailAddress, PrincipalType.User, PrincipalSource.All, true, false, true)).to.be.eventually.fulfilled;
    });

    it("createEmailBodyForInvitation", async function () {
        const homePageAddress = combine(this.settings.sp.testWebUrl, "/SitePages/Home.aspx");
        return expect(_spfi.utility.createEmailBodyForInvitation(homePageAddress)).to.be.eventually.fulfilled;
    });

    it("expandGroupsToPrincipals", async function () {
        return expect(_spfi.utility.expandGroupsToPrincipals(["Everyone"], 10)).to.eventually.be.an.instanceOf(Array).and.not.be.empty;
    });

    it("sendEmail", async function () {

        if (stringIsNullOrEmpty(this.settings.testUser)) {
            this.skip();
        }

        const currentUserEmailAddress = await _spfi.utility.getCurrentUserEmailAddresses();

        const headers = {
            "content-type": "text/html",
        };

        const emailProps: IEmailProperties = {
            AdditionalHeaders: headers,
            BCC: [currentUserEmailAddress],
            Body: "Here is the body. <b>It supports html</b>",
            CC: [currentUserEmailAddress],
            Subject: "This email is about...",
            To: [currentUserEmailAddress],
        };

        return expect(_spfi.utility.sendEmail(emailProps)).to.eventually.be.fulfilled;
    });

    it("searchPrincipals", async function () {

        if (stringIsNullOrEmpty(this.settings.testUser)) {
            this.skip();
        }

        const ensureTestUser = await _spfi.web.ensureUser(this.settings.testUser);
        const userId = ensureTestUser.data.Id;
        const user = await _spfi.web.siteUsers.getById(userId)();

        return expect(_spfi.utility.searchPrincipals(user.Title, PrincipalType.User, PrincipalSource.All, "", 1)).to.eventually.be.an.instanceOf(Array).and.not.be.empty;
    });
});
