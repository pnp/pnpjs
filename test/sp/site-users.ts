import { expect } from "chai";
import "@pnp/sp/site-users";
import { ISiteUserProps, ISiteUserInfo } from "@pnp/sp/site-users";
import { ISiteGroups } from "@pnp/sp/presets/all";
import { stringIsNullOrEmpty } from "@pnp/core";
import { pnpTest } from  "../pnp-test.js";

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

    before(pnpTest("d8ebb9db-0053-456a-8899-96aeff6e5dd6", function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    }));

    describe(".web", function () {

        it("siteUsers", pnpTest("156c8e99-b0c2-42e4-b609-d707d6292902",  async function () {
            const siteUsers: ISiteUserInfo[] = await this.pnp.sp.web.siteUsers();
            const hasResults = siteUsers.length > 0;
            const siteUser = siteUsers[0];
            const hasProps = testISiteUserInfo(siteUser);
            return expect(hasResults && hasProps).to.be.true;
        }));

        it("currentUser", pnpTest("3ba4c60f-df20-4ba2-8aa3-6aaf558d884b",  async function () {
            const currentUser: ISiteUserInfo = await this.pnp.sp.web.currentUser();
            const hasProps = testISiteUserInfo(currentUser);
            return expect(hasProps).to.be.true;
        }));

        it("ensureUser", pnpTest("f86503a8-2c92-4b0a-a0e0-b7bc3f910ca0",  async function () {
            const e: ISiteUserProps = await this.pnp.sp.web.currentUser();
            return expect(this.pnp.sp.web.ensureUser(e.LoginName)).to.eventually.fulfilled;
        }));

        it("getUserById", pnpTest("1b8f24f0-1cd6-4836-9730-a45be94f18cf",  async function () {
            const user: ISiteUserProps = await this.pnp.sp.web.currentUser();
            return expect(this.pnp.sp.web.getUserById(user.Id)()).to.eventually.fulfilled;
        }));
    });

    describe(".siteUsers", function () {

        it("getById",pnpTest("fa7cf482-25e1-446e-a89b-f8b8077b2c5a", async function () {
            const e: ISiteUserProps = await this.pnp.sp.web.currentUser();
            return expect(this.pnp.sp.web.siteUsers.getById(e.Id)()).to.eventually.fulfilled;
        }));

        it("getByEmail",pnpTest("c16948f7-5ac4-4325-bd42-6ebb0a7630f2", async function () {
            const e: ISiteUserProps = await this.pnp.sp.web.currentUser();
            if (!stringIsNullOrEmpty(e.Email)) {
                return expect(this.pnp.sp.web.siteUsers.getByEmail(e.Email)()).to.eventually.fulfilled;
            }
        }));

        it("getByLoginName",pnpTest("3c679746-3464-41ad-95e8-2c734598aaa4", async function () {
            const e: ISiteUserProps = await this.pnp.sp.web.currentUser();
            return expect(this.pnp.sp.web.siteUsers.getByLoginName(e.LoginName)()).to.eventually.fulfilled;
        }));
    });

    describe(".currentUser", function () {

        it("groups", pnpTest("74971cb3-237f-426b-9d1e-634f6879a135", async function () {
            const e: ISiteGroups = await this.pnp.sp.web.currentUser.groups();
            return expect(e.length).to.be.gte(0);
        }));

        it("update", pnpTest("e5b5c751-455b-464b-a73f-7d49a16195f7", async function () {
            const _props: ISiteUserProps = await this.pnp.sp.web.currentUser();
            _props.Title = "Changed Title";
            await this.pnp.sp.web.currentUser.update(_props);
            const _newProps = await this.pnp.sp.web.currentUser();
            return expect(_newProps.Title).to.be.eq("Changed Title");
        }));
    });
});
