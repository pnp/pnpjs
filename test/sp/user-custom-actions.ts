import { expect } from "chai";
import { getSP, testSettings } from "../main.js";
import "@pnp/sp/webs";
import "@pnp/sp/user-custom-actions";
import { SPFI } from "@pnp/sp";

describe("UserCustomActions", function () {

    let _spfi: SPFI = null;

    before(function () {

        if (!testSettings.enableWebTests) {
            this.skip();
            return;
        }

        _spfi = getSP();
    });

    it("-invoke", async function () {
        const actions = await _spfi.web.userCustomActions();
        return expect(actions).to.be.an("Array");
    });

    it("getById", async function () {
        const actions = await _spfi.web.userCustomActions();
        if (actions === undefined || actions.length < 1) {
            this.skip();
            return;
        }
        const action = await _spfi.web.userCustomActions.getById(actions[0].Id)();
        return expect(action).to.haveOwnProperty("update");
    });

    it("clear", function () {
        return expect(_spfi.web.userCustomActions.clear()).to.eventually.to.fulfilled;
    });
});
