import { testSettings } from "../main";
import { graph } from "@pnp/graph";
import "@pnp/graph/src/users";
import "@pnp/graph/presets/all";
import { expect } from "chai";

describe("Users", function () {

    if (testSettings.enableWebTests) {

        // cannot run as app doesn't have a user or "me"
        // it("gets current user", async function () {
        //     const me = await graph.me();
        //     return expect(me).to.not.be.null;
        // });

        it("gets all users", async function () {

            const users = await graph.users();

            return expect(users).to.not.be.null;
        });

        it("getById", async function () {

            const users = await graph.users.select("id").top(1)<{ id: string }[]>();

            const user = await graph.users.getById(users[0].id);

            return expect(user).to.not.be.null.and.haveOwnProperty("id");
        });
    }
});
