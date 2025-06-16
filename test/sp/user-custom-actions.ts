import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/user-custom-actions";
import { pnpTest } from  "../pnp-test.js";

describe("UserCustomActions", function () {

    before(pnpTest("c9d5d547-ca76-4bb0-94d5-cfdbdd26f221", function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    }));

    it("-invoke", pnpTest("9c1db9ea-7d81-4918-8829-bcaa93024781", async function () {
        const actions = await this.pnp.sp.web.userCustomActions();
        return expect(actions).to.be.an("Array");
    }));

    it("getById", pnpTest("20af5b00-f879-4bb3-aab2-5e5326408291", async function () {
        const actions = await this.pnp.sp.web.userCustomActions();
        if (actions === undefined || actions.length < 1) {
            this.skip();
        }
        const action = await this.pnp.sp.web.userCustomActions.getById(actions[0].Id)();
        return expect(action).to.haveOwnProperty("update");
    }));

    it("clear", pnpTest("56f681bd-82ab-4e88-b5e5-8c800cdf4f56", function () {
        return expect(this.pnp.sp.web.userCustomActions.clear()).to.eventually.to.fulfilled;
    }));
});
