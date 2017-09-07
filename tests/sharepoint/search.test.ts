import { expect } from "chai";
import { Search } from "../../src/sharepoint/search";

describe("Search", () => {
    it("Should be an object", () => {
        let searchquery = new Search("_api");
        expect(searchquery).to.be.a("object");
    });
});
