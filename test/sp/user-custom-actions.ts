import { expect } from "chai";
import { testSettings } from "../main";
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/user-custom-actions";

describe("user-custom-actions", function () {
    if (testSettings.enableWebTests) {
        it("userCustomActions()", function () {
            return expect(sp.web.userCustomActions()).to.eventually.be.fulfilled;
        });

        it("userCustomActions.getById", function () {
            return expect(sp.web.userCustomActions.getById("00000000-0000-0000-0000-000000000000")).to.haveOwnProperty("update");
        });

        it("userCustomAction.clear", function () {
            return expect(sp.web.userCustomActions.clear()).to.eventually.to.fulfilled;
        });
    }
});
