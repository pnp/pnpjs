import { expect } from "chai";
import { testSettings } from "../main";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/user-custom-actions";

describe("user-custom-actions", function () {
    if (testSettings.enableWebTests) {

        it("should invoke", function () {
            return expect(sp.web.userCustomActions()).to.eventually.be.fulfilled;
        });

        it("getById", function () {
            return expect(sp.web.userCustomActions.getById("00000000-0000-0000-0000-000000000000")).to.haveOwnProperty("update");
        });

        it("clear", function () {
            return expect(sp.web.userCustomActions.clear()).to.eventually.to.fulfilled;
        });
    }
});
