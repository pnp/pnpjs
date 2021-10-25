import { expect } from "chai";
import {
    addProp,
} from "@pnp/queryable";
import "@pnp/sp/webs";

describe("add-prop", function () {

    it("Should add a property to an object", async function () {

        function tester() {
            this.name = "Testing";
        }

        addProp(tester, "prop", (_o, path) => {
            return path;
        }, "path-value");

        const y = new tester();

        expect(y).to.have.property("name", "Testing");
        expect(y).to.have.property("prop", "path-value");
    });
});
