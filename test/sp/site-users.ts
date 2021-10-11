import { expect } from "chai";
import { getSP, testSettings } from "../main.js";
import "@pnp/sp/site-users";
import { ISiteUserProps, IUserUpdateResult } from "@pnp/sp/site-users";
import { ISiteGroups } from "@pnp/sp/presets/all";
import { stringIsNullOrEmpty } from "@pnp/core";
import { SPFI } from "@pnp/sp";

describe("Web", function () {
    if (testSettings.enableWebTests) {
        let _spfi: SPFI = null;

        before(function () {
            _spfi = getSP();
        });

        // describe("Invokable Properties", function () {
        //     const tests: IInvokableTest[] = [
        //         { desc: ".siteUsers", test: _spfi.web.siteUsers },
        //         { desc: ".currentUser", test: _spfi.web.currentUser },
        //     ];
        //     tests.forEach((testObj) => {
        //         const { test, desc } = testObj;
        //         it(desc, function () expect((<any>test)()).to.eventually.fulfilled);
        //     });
        // });

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

// TODO: Figure out work around for constant declaration of tests
// describe("Site User Properties", function () {
//     if (testSettings.enableWebTests) {
//         const tests: IInvokableTest[] = [
//             { desc: ".Email", test: _spfi.web.currentUser },
//             { desc: ".Id", test: _spfi.web.currentUser },
//             { desc: ".IsHiddenInUI", test: _spfi.web.currentUser },
//             { desc: ".IsShareByEmailGuestUser", test: _spfi.web.currentUser },
//             { desc: ".IsSiteAdmin", test: _spfi.web.currentUser },
//             { desc: ".LoginName", test: _spfi.web.currentUser },
//             { desc: ".PrincipalType", test: _spfi.web.currentUser },
//             { desc: ".Title", test: _spfi.web.currentUser },
//         ];
//         tests.forEach((testObj) => {
//             const { test, desc } = testObj;
//             it(desc, function () expect((<any>test)()).to.eventually.fulfilled);
//         });
//     }
// });



