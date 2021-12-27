import { expect } from "chai";
import { getSP } from "../main.js";
import "@pnp/sp/site-users";
import { ISiteUserProps, IUserUpdateResult, ISiteUserInfo } from "@pnp/sp/site-users";
import { ISiteGroups } from "@pnp/sp/presets/all";
import { stringIsNullOrEmpty } from "@pnp/core";
import { SPFI } from "@pnp/sp";

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

        if (!this.settings.enableWebTests) {
            this.skip();
        }
    });

    describe(".web", function () {

        let _spfi: SPFI = null;

        before(function () {
            _spfi = getSP();
        });

        it("siteUsers", async function () {
            const siteUsers: ISiteUserInfo[] = await _spfi.web.siteUsers();
            const hasResults = siteUsers.length > 0;
            const siteUser = siteUsers[0];
            const hasProps = testISiteUserInfo(siteUser);
            return expect(hasResults && hasProps).to.be.true;
        });

        it("currentUser", async function () {
            const currentUser: ISiteUserInfo = await _spfi.web.currentUser();
            const hasProps = testISiteUserInfo(currentUser);
            return expect(hasProps).to.be.true;
        });

        it("ensureUser", async function () {
            const e: ISiteUserProps = await _spfi.web.currentUser();
            return expect(_spfi.web.ensureUser(e.LoginName)).to.eventually.fulfilled;
        });

        it("getUserById", async function () {
            const user: ISiteUserProps = await _spfi.web.currentUser();
            return expect(_spfi.web.getUserById(user.Id)()).to.eventually.fulfilled;
        });
    });

    describe(".siteUsers", function () {

        let _spfi: SPFI = null;

        before(async function () {
            _spfi = getSP();
        });

        it("getById", async function () {
            const e: ISiteUserProps = await _spfi.web.currentUser();
            return expect(_spfi.web.siteUsers.getById(e.Id)()).to.eventually.fulfilled;
        });

        it("getByEmail", async function () {
            const e: ISiteUserProps = await _spfi.web.currentUser();
            if (!stringIsNullOrEmpty(e.Email)) {
                return expect(_spfi.web.siteUsers.getByEmail(e.Email)()).to.eventually.fulfilled;
            }
        });

        it("getByLoginName", async function () {
            const e: ISiteUserProps = await _spfi.web.currentUser();
            return expect(_spfi.web.siteUsers.getByLoginName(e.LoginName)()).to.eventually.fulfilled;
        });
    });

    describe(".currentUser", function () {

        let _spfi: SPFI = null;

        before(async function () {
            _spfi = getSP();
        });

        it("groups", async function () {
            const e: ISiteGroups = await _spfi.web.currentUser.groups();
            return expect(e.length).to.be.gte(0);
        });
        it("update", async function () {
            const _props: ISiteUserProps = await _spfi.web.currentUser();
            _props.Title = "Changed Title";
            const e: IUserUpdateResult = await _spfi.web.currentUser.update(_props);
            const _newProps = await e.user();
            return expect(_newProps.Title).to.be.eq("Changed Title");
        });
    });
});
