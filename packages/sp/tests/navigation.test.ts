import { expect } from "chai";
import { Navigation } from "../src/navigation";
import { toMatchEndRegex } from "./utils";

describe("Navigation", () => {
    it("Should be an object", () => {
        const navigation = new Navigation("_api/web");
        expect(navigation).to.be.a("object");
    });
    describe("url", () => {
        it("Should return _api/web/Navigation", () => {
            const navigation = new Navigation("_api/web");
            expect(navigation.toUrl()).to.match(toMatchEndRegex("_api/web/navigation"));
        });
    });
});
