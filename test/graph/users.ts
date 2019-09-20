import { testSettings } from "../main";
import {graph } from "@pnp/graph";
import "@pnp/graph/src/users";
import "@pnp/graph/presets/all";
import { expect } from "chai";

describe("Users", function () {
    if (testSettings.enableWebTests) {
        it("gets current user", async function() {
            const me = await graph.me();
            return expect(me).to.not.be.null;
        });
        it("gets all users", async function() {
            const users = await graph.users();
            return expect(users).to.not.be.null;
        });
    }
});
