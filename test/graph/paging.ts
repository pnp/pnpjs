import { expect } from "chai";
import "@pnp/graph/groups";
import "@pnp/graph/users";
import "@pnp/graph/sites";
import "@pnp/graph/lists";
import getTestingGraphSPSite from "./utilities/getTestingGraphSPSite.js";
import { getRandomString } from "@pnp/core";
import { graphPost, GraphQueryableCollection, IGraphQueryableCollection } from "@pnp/graph";
import { body } from "@pnp/queryable";

describe("Groups", function () {

    let itemsCol: IGraphQueryableCollection;

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
            return;
        }

        const site = await getTestingGraphSPSite(this);

        const listInfo = await site.lists.add({
            displayName: `Test_${getRandomString(4)}`,
            list: { "template": "genericList" },
        });

        itemsCol = GraphQueryableCollection(site.lists.getById(listInfo.data.id), "items");

        for (let i = 0; i < 11; i++) {
            await graphPost(itemsCol, body({
                Title: `Test_${getRandomString(4)}`,
            }));
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
        expect(groups).to.have.property("count").gt(0);
        expect(groups.value.length).to.eq(2);

        groups = await groups.next();

        expect(groups).to.have.property("hasNext", true);
        // count only returns on the first call, not subsequent paged calls
        expect(groups).to.have.property("count").eq(0);
        expect(groups.value.length).to.eq(2);
    });

    it("groups count", async function () {

        const count = await this.pnp.graph.groups.count();

        expect(count).to.be.gt(0);
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

    it("pages items", async function () {

        let pagedResults = await itemsCol.top(5).paged();

        expect(pagedResults.value.length).to.eq(5);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(pagedResults.hasNext).to.be.true;
        expect(pagedResults.count).to.eq(0);

        pagedResults = await pagedResults.next();

        expect(pagedResults.value.length).to.eq(5);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(pagedResults.hasNext).to.be.true;
        expect(pagedResults.count).to.eq(0);
    });

    it("items count", async function () {

        const count = await itemsCol.count();

        // items doesn't support count, should be zero
        expect(count).to.eq(0);
    });
});
