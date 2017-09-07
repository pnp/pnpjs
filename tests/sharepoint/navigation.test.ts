import { expect } from "chai";
import { Navigation } from "../../src/sharepoint/navigation";
import { toMatchEndRegex } from "../testutils";

describe("Navigation", () => {
    it("Should be an object", () => {
        let navigation = new Navigation("_api/web");
        expect(navigation).to.be.a("object");
    });
    describe("url", () => {
        it("Should return _api/web/Navigation", () => {
            let navigation = new Navigation("_api/web");
            expect(navigation.toUrl()).to.match(toMatchEndRegex("_api/web/navigation"));
        });
    });
});
