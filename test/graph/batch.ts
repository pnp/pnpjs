import { Users } from "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/sites";
import { createBatch } from "@pnp/graph/batching";
import { expect } from "chai";
import { pnpTest } from "../pnp-test.js";

describe("Batching", function () {

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("Single Request", pnpTest("104a9d10-ef6f-485f-961e-45014147f52a", async function () {
        const order: number[] = [];
        const expected: number[] = [1, 2];

        const [batchedGraph, execute] = this.pnp.graph.batched();

        batchedGraph.users().then(function () {
            order.push(1);
        });

        await execute();
        order.push(2);

        return expect(order.toString()).to.eql(expected.toString());
    }));

    it("Even # Requests", pnpTest("52bb031b-2a18-46e7-bb1b-8c0085812e0d", async function () {
        const order: number[] = [];
        const expected: number[] = [1, 2, 3];

        const [batchedGraph, execute] = this.pnp.graph.batched();

        batchedGraph.users().then(function () {
            order.push(1);
        });

        batchedGraph.sites().then(function () {
            order.push(2);
        });

        await execute();

        order.push(3);

        return expect(order.toString()).to.eql(expected.toString());
    }));

    it("Odd # Requests", pnpTest("0f5f9c29-7da8-483b-8c7d-4a6a9656bb92", async function () {
        const order: number[] = [];
        const expected: number[] = [1, 2, 3, 4];

        const [batchedGraph, execute] = this.pnp.graph.batched();

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
    }));

    it("Should work with the same Queryable when properly cloned (Advanced)", pnpTest("76fbb5bf-dfc5-4230-a9df-ef1ecc2ee7a4", async function () {

        const users = this.pnp.graph.users;

        const [batchedBehavior, execute] = createBatch(users);
        users.using(batchedBehavior);

        users();
        this.pnp.graph.users.using(batchedBehavior)();
        this.pnp.graph.users.using(batchedBehavior)();
        this.pnp.graph.users.using(batchedBehavior)();

        return expect(execute()).to.eventually.be.fulfilled;
    }));

    it("Should work with the same Queryable when properly cloned by factory (Advanced)", pnpTest("d0ba8747-a776-4f4e-be09-6a6126dc1e06", async function () {

        const users = this.pnp.graph.users;

        const [batchedBehavior, execute] = createBatch(users);
        users.using(batchedBehavior);

        Users(users).using(batchedBehavior)();
        Users(users).using(batchedBehavior)();
        Users(users).using(batchedBehavior)();

        return expect(execute()).to.eventually.be.fulfilled;
    }));

    it("Should fail with the same Queryable (Advanced)", pnpTest("ca3ae3bb-1729-47d9-abea-e531cd7817dc", async function () {

        const users = this.pnp.graph.users;

        const [batchedBehavior, execute] = createBatch(users);
        users.using(batchedBehavior);

        users();

        const p = users();

        const p2 = execute();

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(p).to.eventually.be.rejected;

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(p2).to.eventually.be.fulfilled;
    }));

});
