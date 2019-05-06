import { expect } from "chai";
import { Search } from "../src/search";

describe("Search", () => {
    it("Should be an object", () => {
        const searchquery = new Search("_api");
        expect(searchquery).to.be.a("object");
    });
});
