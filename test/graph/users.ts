import { testSettings } from "../main";
import {graph } from "@pnp/graph";
import "@pnp/graph/src/users";
import "@pnp/graph/presets";
import { expect } from "chai";

describe("Users", function () {
    if (testSettings.enableWebTests) {
        it("gets current user", async function() {
            const me = await graph.me();
            return expect(me).to.not.be.null;
        });
    }
});
