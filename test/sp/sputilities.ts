import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/sputilities";
import { PrincipalType, PrincipalSource } from "@pnp/sp";
import { combine, stringIsNullOrEmpty } from "@pnp/core";
import { IEmailProperties } from "@pnp/sp/sputilities";

// cannot test with app permissions
describe.skip("SPUtilities", function () {

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        if (!stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            await this.pnp.sp.web.ensureUser(this.pnp.settings.testUser);
        }
    });

    it("getCurrentUserEmailAddresses", function () {
        return expect(this.pnp.sp.utility.getCurrentUserEmailAddresses()).to.eventually.be.fulfilled;
    });

    it("resolvePrincipal", async function () {
        const currentUserEmailAddress = await this.pnp.sp.utility.getCurrentUserEmailAddresses();

        return expect(this.pnp.sp.utility.resolvePrincipal(currentUserEmailAddress, PrincipalType.User, PrincipalSource.All, true, false, true)).to.be.eventually.fulfilled;
    });

    it("createEmailBodyForInvitation", async function () {
        const homePageAddress = combine(this.pnp.settings.sp.testWebUrl, "/SitePages/Home.aspx");
        return expect(this.pnp.sp.utility.createEmailBodyForInvitation(homePageAddress)).to.be.eventually.fulfilled;
    });

    it("expandGroupsToPrincipals", async function () {
        return expect(this.pnp.sp.utility.expandGroupsToPrincipals(["Everyone"], 10)).to.eventually.be.an.instanceOf(Array).and.not.be.empty;
    });

    it("sendEmail", async function () {

        if (stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const currentUserEmailAddress = await this.pnp.sp.utility.getCurrentUserEmailAddresses();

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

        return expect(this.pnp.sp.utility.sendEmail(emailProps)).to.eventually.be.fulfilled;
    });

    it("searchPrincipals", async function () {

        if (stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const ensureTestUser = await this.pnp.sp.web.ensureUser(this.pnp.settings.testUser);
        const userId = ensureTestUser.data.Id;
        const user = await this.pnp.sp.web.siteUsers.getById(userId)();

        return expect(this.pnp.sp.utility.searchPrincipals(user.Title, PrincipalType.User, PrincipalSource.All, "", 1)).to.eventually.be.an.instanceOf(Array).and.not.be.empty;
    });
});
