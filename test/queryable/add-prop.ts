import { expect } from "chai";
import {
    addProp,
} from "@pnp/queryable";
import "@pnp/sp/webs";
import { pnpTest } from "../pnp-test.js";

describe("add-prop", function () {

    it("Should add a property to an object", pnpTest("da54b703-1e3f-49ed-885f-9041e2c524c9", async function () {

        function tester() {
            this.name = "Testing";
        }

        addProp(tester, "prop", (_o, path) => {
            return path;
        }, "path-value");

        const y = new tester();

        expect(y).to.have.property("name", "Testing");
        expect(y).to.have.property("prop", "path-value");
    }));
});
