import { expect } from "chai";
import { sp } from "@pnp/sp";
import { testSettings } from "../main";
import "@pnp/sp/src/site-users";
import { IInvokableTest } from "../types";
import {  ISiteUserProps } from "@pnp/sp/src/site-users";

describe("Web", () => {
    if(testSettings.enableWebTests) {
        describe("Invokable Properties", () => {
            const tests: IInvokableTest[] = [
                {desc: ".siteUsers", test: sp.web.siteUsers},
                {desc: ".currentUser", test: sp.web.currentUser},
            ];
            tests.forEach((testObj) => {
                const {test, desc} = testObj;
                it(desc, () => expect((<any>test)()).to.eventually.fulfilled);
            });
        });

        it.only(".ensureUser", async function () {
            const e: ISiteUserProps = await sp.web.currentUser.get();
            return expect(sp.web.ensureUser(e.LoginName)).to.eventually.fulfilled;
        });

        it.only(".getUserById",  async function () {
            const user: ISiteUserProps = await sp.web.currentUser.get();
            return expect(sp.web.getUserById(user.Id)()).to.eventually.fulfilled;
        });
    }
});

describe("Site Users", () => {
    if (testSettings.enableWebTests) {
        it.only(".getByID", async function () {
            const e: ISiteUserProps = await sp.web.currentUser.get();
            return expect(sp.web.siteUsers.getById(e.Id)()).to.eventually.fulfilled;
        });

        it.only(".getByEmail", async function () {
            const email = testSettings.sp.sitedesigns.testuser;
            return expect(sp.web.siteUsers.getByEmail(email)()).to.eventually.fulfilled;
        });

        it.only(".getByLoginName", async function () {
            const e: ISiteUserProps = await sp.web.currentUser.get();
            return expect(sp.web.siteUsers.getByLoginName(e.LoginName)()).to.eventually.fulfilled;
        });
    }
});

describe("Site User", () => {
    if (testSettings.enableWebTests) {
        //todo .groups test for get grouos for curent user
        //todo .update test for curent user update
    }
});

describe("Site User Properties", () => {
    if (testSettings.enableWebTests) {
        //todo test user has properties
        const tests: IInvokableTest[] = [
            {desc: ".Email", test: sp.web.currentUser},
            {desc: ".Id", test: sp.web.currentUser},
        ];
        tests.forEach((testObj) => {
            const {test, desc} = testObj;
            it(desc, () => expect((<any>test)()).to.eventually.fulfilled);
        });
    }
});




