import { expect } from "chai";
import "@pnp/graph/groups";
import "@pnp/graph/users";

describe("Groups", function () {

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("pages users 1", async function () {

        let users = await this.pnp.graph.users.top(2).paged();

        expect(users).to.have.property("hasNext", true);

        users = await users.next();

        expect(users).to.have.property("hasNext", true);
    });

    it("pages all users", async function () {

        const count = await this.pnp.graph.users.count();

        const allUsers = [];
        let users = await this.pnp.graph.users.top(20).select("displayName").paged();

        allUsers.push(...users.value);

        while (users.hasNext) {
            users = await users.next();
            allUsers.push(...users.value);
        }

        expect(allUsers.length).to.eq(count);
    });

    it("pages groups", async function () {

        let groups = await this.pnp.graph.groups.top(2).paged();

        expect(groups).to.have.property("hasNext", true);

        groups = await groups.next();

        expect(groups).to.have.property("hasNext", true);
    });

    it("pages all groups", async function () {

        const count = await this.pnp.graph.groups.count();

        const allGroups = [];
        let groups = await this.pnp.graph.groups.top(20).select("mailNickname").paged();

        allGroups.push(...groups.value);

        while (groups.hasNext) {
            groups = await groups.next();
            allGroups.push(...groups.value);
        }

        expect(allGroups.length).to.be.gt((count - 10)).and.lt((count + 10));
    });
});
