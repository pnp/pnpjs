import { expect } from "chai";
import { getSP, testSettings } from "../main.js";
import "@pnp/sp/site-users";
import { ISiteUserProps, IUserUpdateResult, ISiteUserInfo } from "@pnp/sp/site-users";
import { ISiteGroups } from "@pnp/sp/presets/all";
import { stringIsNullOrEmpty } from "@pnp/core";
import { SPFI } from "@pnp/sp";

describe("Web", function () {
    if (testSettings.enableWebTests) {
        let _spfi: SPFI = null;

        function testISiteUserInfo(siteUser: ISiteUserInfo): boolean {
            return siteUser.hasOwnProperty("Email") &&
                siteUser.hasOwnProperty("Id") &&
                siteUser.hasOwnProperty("IsHiddenInUI") &&
                siteUser.hasOwnProperty("IsShareByEmailGuestUser") &&
                siteUser.hasOwnProperty("IsSiteAdmin") &&
                siteUser.hasOwnProperty("LoginName") &&
                siteUser.hasOwnProperty("PrincipalType") &&
                siteUser.hasOwnProperty("Title") &&
                siteUser.hasOwnProperty("Expiration") &&
                siteUser.hasOwnProperty("IsEmailAuthenticationGuestUser") &&
                siteUser.hasOwnProperty("UserId") &&
                siteUser.hasOwnProperty("UserPrincipalName")
        }

        before(function () {
            _spfi = getSP();
        });

        it(".siteUsers", async function () {
            const siteUsers: ISiteUserInfo[] = await _spfi.web.siteUsers();
            const hasResults = siteUsers.length > 0;
            const siteUser = siteUsers[0];
            const hasProps = testISiteUserInfo(siteUser);
            return expect(hasResults && hasProps).to.be.true;
        });

        it(".currentUser", async function () {
            const currentUser: ISiteUserInfo = await _spfi.web.currentUser();
            const hasProps = testISiteUserInfo(currentUser);
            return expect(hasProps).to.be.true;
        });

        it(".ensureUser", async function () {
            const e: ISiteUserProps = await _spfi.web.currentUser();
            return expect(_spfi.web.ensureUser(e.LoginName)).to.eventually.fulfilled;
        });

        it(".getUserById", async function () {
            const user: ISiteUserProps = await _spfi.web.currentUser();
            return expect(_spfi.web.getUserById(user.Id)()).to.eventually.fulfilled;
        });
    }
});

describe("Site Users", function () {
    if (testSettings.enableWebTests) {
        let _spfi: SPFI = null;

        before(async function () {
            _spfi = getSP();
        });

        it(".getByID", async function () {
            const e: ISiteUserProps = await _spfi.web.currentUser();
            return expect(_spfi.web.siteUsers.getById(e.Id)()).to.eventually.fulfilled;
        });

        it(".getByEmail", async function () {
            const e: ISiteUserProps = await _spfi.web.currentUser();
            if (!stringIsNullOrEmpty(e.Email)) {
                return expect(_spfi.web.siteUsers.getByEmail(e.Email)()).to.eventually.fulfilled;
            }
        });

        it(".getByLoginName", async function () {
            const e: ISiteUserProps = await _spfi.web.currentUser();
            return expect(_spfi.web.siteUsers.getByLoginName(e.LoginName)()).to.eventually.fulfilled;
        });
    }
});

describe("Site User", function () {

    if (testSettings.enableWebTests) {
        let _spfi: SPFI = null;

        before(async function () {
            _spfi = getSP();
        });

        it(".groups", async function () {
            const e: ISiteGroups = await _spfi.web.currentUser.groups();
            return expect(e.length).to.be.gte(0);
        });
        it(".update", async function () {
            const _props: ISiteUserProps = await _spfi.web.currentUser();
            _props.Title = "Changed Title";
            const e: IUserUpdateResult = await _spfi.web.currentUser.update(_props);
            const _newProps = await e.user();
            return expect(_newProps.Title).to.be.eq("Changed Title");
        });

    }
});



