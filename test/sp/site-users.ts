import { expect } from "chai";
import { sp } from "@pnp/sp";
import { testSettings } from "../main";
import "@pnp/sp/site-users";
import { IInvokableTest } from "../types";
import { ISiteUserProps, IUserUpdateResult } from "@pnp/sp/site-users";
import { ISiteGroups } from "@pnp/sp/presets/all";
import { stringIsNullOrEmpty } from "@pnp/common";

describe("Web", () => {
    if (testSettings.enableWebTests) {
        describe("Invokable Properties", () => {
            const tests: IInvokableTest[] = [
                { desc: ".siteUsers", test: sp.web.siteUsers },
                { desc: ".currentUser", test: sp.web.currentUser },
            ];
            tests.forEach((testObj) => {
                const { test, desc } = testObj;
                it(desc, () => expect((<any>test)()).to.eventually.fulfilled);
            });
        });

        it(".ensureUser", async function () {
            const e: ISiteUserProps = await sp.web.currentUser();
            return expect(sp.web.ensureUser(e.LoginName)).to.eventually.fulfilled;
        });

        it(".getUserById", async function () {
            const user: ISiteUserProps = await sp.web.currentUser();
            return expect(sp.web.getUserById(user.Id)()).to.eventually.fulfilled;
        });
    }
});

describe("Site Users", () => {
    if (testSettings.enableWebTests) {
        it(".getByID", async function () {
            const e: ISiteUserProps = await sp.web.currentUser();
            return expect(sp.web.siteUsers.getById(e.Id)()).to.eventually.fulfilled;
        });

        it(".getByEmail", async function () {
            const e: ISiteUserProps = await sp.web.currentUser();
            if (!stringIsNullOrEmpty(e.Email)) {
                return expect(sp.web.siteUsers.getByEmail(e.Email)()).to.eventually.fulfilled;
            }
        });

        it(".getByLoginName", async function () {
            const e: ISiteUserProps = await sp.web.currentUser();
            return expect(sp.web.siteUsers.getByLoginName(e.LoginName)()).to.eventually.fulfilled;
        });
    }
});

describe("Site User", () => {
    if (testSettings.enableWebTests) {
        it(".groups", async function () {
            const e: ISiteGroups = await sp.web.currentUser.groups();
            return expect(e.length).to.be.gte(0);
        });
        it(".update", async function () {
            const _props: ISiteUserProps = await sp.web.currentUser();
            _props.Title = "Changed Title";
            const e: IUserUpdateResult = await sp.web.currentUser.update(_props);
            const _newProps = await e.user.get();
            return expect(_newProps.Title).to.be.eq("Changed Title");
        });

    }
});

describe("Site User Properties", () => {
    if (testSettings.enableWebTests) {
        const tests: IInvokableTest[] = [
            { desc: ".Email", test: sp.web.currentUser },
            { desc: ".Id", test: sp.web.currentUser },
            { desc: ".IsHiddenInUI", test: sp.web.currentUser },
            { desc: ".IsShareByEmailGuestUser", test: sp.web.currentUser },
            { desc: ".IsSiteAdmin", test: sp.web.currentUser },
            { desc: ".LoginName", test: sp.web.currentUser },
            { desc: ".PrincipalType", test: sp.web.currentUser },
            { desc: ".Title", test: sp.web.currentUser },
        ];
        tests.forEach((testObj) => {
            const { test, desc } = testObj;
            it(desc, () => expect((<any>test)()).to.eventually.fulfilled);
        });
    }
});



