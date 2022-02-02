import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/user-custom-actions";

describe("UserCustomActions", function () {

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("-invoke", async function () {
        const actions = await this.pnp.sp.web.userCustomActions();
        return expect(actions).to.be.an("Array");
    });

    it("getById", async function () {
        const actions = await this.pnp.sp.web.userCustomActions();
        if (actions === undefined || actions.length < 1) {
            this.skip();
        }
        const action = await this.pnp.sp.web.userCustomActions.getById(actions[0].Id)();
        return expect(action).to.haveOwnProperty("update");
    });

    it("clear", function () {
        return expect(this.pnp.sp.web.userCustomActions.clear()).to.eventually.to.fulfilled;
    });
});
