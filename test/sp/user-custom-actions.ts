import { expect } from "chai";
import { getSP, testSettings } from "../main.js";
import "@pnp/sp/webs";
import "@pnp/sp/user-custom-actions";
import { SPFI } from "@pnp/sp";

describe("user-custom-actions", function () {
    if (testSettings.enableWebTests) {
        let _spfi: SPFI = null;

        before(function () {
            _spfi = getSP();
        });

        it("should invoke", function () {
            return expect(_spfi.web.userCustomActions()).to.eventually.be.fulfilled;
        });

        it("getById", function () {
            return expect(_spfi.web.userCustomActions.getById("00000000-0000-0000-0000-000000000000")).to.haveOwnProperty("update");
        });

        it("clear", function () {
            return expect(_spfi.web.userCustomActions.clear()).to.eventually.to.fulfilled;
        });
    }
});
