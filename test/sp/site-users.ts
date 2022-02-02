import { expect } from "chai";
import "@pnp/sp/site-users";
import { ISiteUserProps, IUserUpdateResult, ISiteUserInfo } from "@pnp/sp/site-users";
import { ISiteGroups } from "@pnp/sp/presets/all";
import { stringIsNullOrEmpty } from "@pnp/core";

function testISiteUserInfo(siteUser: ISiteUserInfo): boolean {
    return Reflect.has(siteUser, "Email") &&
        Reflect.has(siteUser, "Id") &&
        Reflect.has(siteUser, "IsHiddenInUI") &&
        Reflect.has(siteUser, "IsShareByEmailGuestUser") &&
        Reflect.has(siteUser, "IsSiteAdmin") &&
        Reflect.has(siteUser, "LoginName") &&
        Reflect.has(siteUser, "PrincipalType") &&
        Reflect.has(siteUser, "Title") &&
        Reflect.has(siteUser, "Expiration") &&
        Reflect.has(siteUser, "IsEmailAuthenticationGuestUser") &&
        Reflect.has(siteUser, "UserId") &&
        Reflect.has(siteUser, "UserPrincipalName");
}

describe("Site Users", function () {

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    describe(".web", function () {

        it("siteUsers", async function () {
            const siteUsers: ISiteUserInfo[] = await this.pnp.sp.web.siteUsers();
            const hasResults = siteUsers.length > 0;
            const siteUser = siteUsers[0];
            const hasProps = testISiteUserInfo(siteUser);
            return expect(hasResults && hasProps).to.be.true;
        });

        it("currentUser", async function () {
            const currentUser: ISiteUserInfo = await this.pnp.sp.web.currentUser();
            const hasProps = testISiteUserInfo(currentUser);
            return expect(hasProps).to.be.true;
        });

        it("ensureUser", async function () {
            const e: ISiteUserProps = await this.pnp.sp.web.currentUser();
            return expect(this.pnp.sp.web.ensureUser(e.LoginName)).to.eventually.fulfilled;
        });

        it("getUserById", async function () {
            const user: ISiteUserProps = await this.pnp.sp.web.currentUser();
            return expect(this.pnp.sp.web.getUserById(user.Id)()).to.eventually.fulfilled;
        });
    });

    describe(".siteUsers", function () {

        it("getById", async function () {
            const e: ISiteUserProps = await this.pnp.sp.web.currentUser();
            return expect(this.pnp.sp.web.siteUsers.getById(e.Id)()).to.eventually.fulfilled;
        });

        it("getByEmail", async function () {
            const e: ISiteUserProps = await this.pnp.sp.web.currentUser();
            if (!stringIsNullOrEmpty(e.Email)) {
                return expect(this.pnp.sp.web.siteUsers.getByEmail(e.Email)()).to.eventually.fulfilled;
            }
        });

        it("getByLoginName", async function () {
            const e: ISiteUserProps = await this.pnp.sp.web.currentUser();
            return expect(this.pnp.sp.web.siteUsers.getByLoginName(e.LoginName)()).to.eventually.fulfilled;
        });
    });

    describe(".currentUser", function () {

        it("groups", async function () {
            const e: ISiteGroups = await this.pnp.sp.web.currentUser.groups();
            return expect(e.length).to.be.gte(0);
        });

        it("update", async function () {
            const _props: ISiteUserProps = await this.pnp.sp.web.currentUser();
            _props.Title = "Changed Title";
            const e: IUserUpdateResult = await this.pnp.sp.web.currentUser.update(_props);
            const _newProps = await e.user();
            return expect(_newProps.Title).to.be.eq("Changed Title");
        });
    });
});
