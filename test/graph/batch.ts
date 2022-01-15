import { getGraph } from "../main.js";
import { GraphFI } from "@pnp/graph";
import { Users } from "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/sites";
import { createBatch } from "@pnp/graph/batching";
import { expect } from "chai";

describe("Batching", function () {

    this.timeout(120000);

    let _graphfi: GraphFI = null;

    before(function () {

        if (!this.settings.enableWebTests) {
            this.skip();
        }

        _graphfi = getGraph();
    });

    it("Single Request", async function () {
        const order: number[] = [];
        const expected: number[] = [1, 2];

        const [batchedGraph, execute] = _graphfi.batched();

        batchedGraph.users().then(function () {
            order.push(1);
        });

        await execute();
        order.push(2);

        return expect(order.toString()).to.eql(expected.toString());
    });

    it("Even # Requests", async function () {
        const order: number[] = [];
        const expected: number[] = [1, 2, 3];

        const [batchedGraph, execute] = _graphfi.batched();

        batchedGraph.users().then(function () {
            order.push(1);
        });

        batchedGraph.sites().then(function () {
            order.push(2);
        });

        await execute();

        order.push(3);

        return expect(order.toString()).to.eql(expected.toString());
    });

    it("Odd # Requests", async function () {
        const order: number[] = [];
        const expected: number[] = [1, 2, 3, 4];

        const [batchedGraph, execute] = _graphfi.batched();

        batchedGraph.users().then(function () {
            order.push(1);
        });

        batchedGraph.sites().then(function () {
            order.push(2);
        });

        batchedGraph.groups.top(1)().then(function () {
            order.push(3);
        });

        await execute();

        order.push(4);
        return expect(order.toString()).to.eql(expected.toString());
    });

    it("Should work with the same Queryable when properly cloned (Advanced)", async function () {

        const users = _graphfi.users;

        const [batchedBehavior, execute] = createBatch(users);
        users.using(batchedBehavior);

        users();
        _graphfi.users.using(batchedBehavior)();
        _graphfi.users.using(batchedBehavior)();
        _graphfi.users.using(batchedBehavior)();

        return expect(execute()).to.eventually.be.fulfilled;
    });

    it("Should work with the same Queryable when properly cloned by factory (Advanced)", async function () {

        const users = _graphfi.users;

        const [batchedBehavior, execute] = createBatch(users);
        users.using(batchedBehavior);

        Users(users).using(batchedBehavior)();
        Users(users).using(batchedBehavior)();
        Users(users).using(batchedBehavior)();

        return expect(execute()).to.eventually.be.fulfilled;
    });

    it("Should fail with the same Queryable (Advanced)", async function () {

        const users = _graphfi.users;

        const [batchedBehavior, execute] = createBatch(users);
        users.using(batchedBehavior);

        users();

        const p = users();

        const p2 = execute();

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(p).to.eventually.be.rejected;

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(p2).to.eventually.be.fulfilled;
    });
});
