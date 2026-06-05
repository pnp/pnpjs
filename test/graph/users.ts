import { expect } from "chai";
import { pnpTest } from "../pnp-test.js";
import { stringIsNullOrEmpty } from "@pnp/core";
import "@pnp/graph/users";

describe("Users", function () {

    let testUserName = "";

    before(function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        testUserName = this.pnp.settings.testUser.substr(this.pnp.settings.testUser.lastIndexOf("|") + 1);
    });

    it("users", pnpTest("ec268616-f30d-4c4a-936e-0148955ff1c0", async function () {
        const users = await this.pnp.graph.users();
        return expect(users.length).is.greaterThan(0);
    }));

    it("users - getById", pnpTest("ae3096fe-fbf5-4518-bbe2-44a9be212f06", async function () {
        const user = await this.pnp.graph.users.getById(testUserName)();
        return expect(user).is.not.null;
    }));

    it("users - delta", pnpTest("63ff45a4-a90b-40a0-91a2-10ed5a2a8e2f", async function () {
        const delta = await this.pnp.graph.users.delta()();
        return expect(delta.values).is.an("array");
    }));

});
