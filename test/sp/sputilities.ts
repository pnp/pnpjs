import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/sputilities";
import { PrincipalType, PrincipalSource } from "@pnp/sp";
import { combine, stringIsNullOrEmpty } from "@pnp/core";
import { pnpTest } from  "../pnp-test.js";

// cannot test with app permissions
describe.skip("SPUtilities", function () {

    before(pnpTest("40ff279e-face-4030-b1cb-0c469b6cfc01", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        if (!stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            await this.pnp.sp.web.ensureUser(this.pnp.settings.testUser);
        }
    }));

    it("getCurrentUserEmailAddresses", pnpTest("5645106f-5ee3-4d03-acf7-aec9c087c09b", function () {
        return expect(this.pnp.sp.utility.getCurrentUserEmailAddresses()).to.eventually.be.fulfilled;
    }));

    it("resolvePrincipal", pnpTest("f21c764d-3239-4c41-a51a-3d4b164ee1f7", async function () {
        const currentUserEmailAddress = await this.pnp.sp.utility.getCurrentUserEmailAddresses();

        return expect(this.pnp.sp.utility.resolvePrincipal(currentUserEmailAddress, PrincipalType.User, PrincipalSource.All, true, false, true)).to.be.eventually.fulfilled;
    }));

    it("createEmailBodyForInvitation", pnpTest("66ecde5e-0b58-44f3-9ee6-59f61c509a55", async function () {
        const homePageAddress = combine(this.pnp.settings.sp.testWebUrl, "/SitePages/Home.aspx");
        return expect(this.pnp.sp.utility.createEmailBodyForInvitation(homePageAddress)).to.be.eventually.fulfilled;
    }));

    it("expandGroupsToPrincipals", pnpTest("8ad21c88-b7bf-486f-b704-ca312fc3c5ca", async function () {
        return expect(this.pnp.sp.utility.expandGroupsToPrincipals(["Everyone"], 10)).to.eventually.be.an.instanceOf(Array).and.not.be.empty;
    }));

    it("searchPrincipals", pnpTest("726e7377-5ecf-421c-afd3-06130830b757", async function () {

        if (stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const ensureTestUser = await this.pnp.sp.web.ensureUser(this.pnp.settings.testUser);
        const userId = ensureTestUser.Id;
        const user = await this.pnp.sp.web.siteUsers.getById(userId)();

        return expect(this.pnp.sp.utility.searchPrincipals(user.Title, PrincipalType.User, PrincipalSource.All, "", 1)).to.eventually.be.an.instanceOf(Array).and.not.be.empty;
    }));
});
