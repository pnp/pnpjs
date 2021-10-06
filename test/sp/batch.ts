import { assert, expect } from "chai";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import "@pnp/sp/files/item";
import "@pnp/sp/folders/list";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/site-users/web";
import "@pnp/sp/batching";
import { CheckinType } from "@pnp/sp/files";
import { getSP, testSettings } from "../main.js";
import { SPRest } from "@pnp/sp";

describe("Batching", function () {

    if (testSettings.enableWebTests) {
        let _spRest: SPRest = null;
        before(function () {
            _spRest = getSP();
        });

        it("Should execute batches in the expected order for a single request", async function () {
            this.timeout(60000);
            const order: number[] = [];
            const expected: number[] = [1, 2];

            const [batchedSP, execute] = _spRest.batched();

            batchedSP.web().then(function () {
                order.push(1);
            });

            await execute();
            order.push(2);

            return expect(order.toString()).to.eql(expected.toString());
        });

        it("Should execute batches in the expected order for an even number of requests", async function () {
            this.timeout(120000);
            const order: number[] = [];
            const expected: number[] = [1, 2, 3];

            const [batchedSP, execute] = _spRest.batched();

            batchedSP.web().then(function () {
                order.push(1);
            });

            batchedSP.web.lists().then(function () {
                order.push(2);
            });

            await execute();

            order.push(3);

            return expect(order.toString()).to.eql(expected.toString());
        });

        it("Should execute batches in the expected order for an odd number of requests", async function () {
            this.timeout(120000);
            const order: number[] = [];
            const expected: number[] = [1, 2, 3, 4];

            const [batchedSP, execute] = _spRest.batched();

            batchedSP.web().then(function () {
                order.push(1);
            });

            batchedSP.web.lists().then(function () {
                order.push(2);
            });

            batchedSP.web.lists.top(1)().then(function () {
                order.push(3);
            });

            await execute();

            order.push(4);
            return expect(order.toString()).to.eql(expected.toString());
        });

        it("Should execute batches that have internally cloned requests", async function () {
            this.timeout(120000);
            const order: number[] = [];
            const expected: number[] = [1, 2, 3];
            const listTitle = "BatchItemAddTest";

            const ler = await _spRest.web.lists.ensure(listTitle);

            if (ler.data) {
                const [batchedSP, execute] = _spRest.batched();

                batchedSP.web.lists.getByTitle(listTitle).items.add({ Title: "Hello 1" }).then(function () {
                    order.push(1);
                });

                batchedSP.web.lists.getByTitle(listTitle).items.add({ Title: "Hello 2" }).then(function () {
                    order.push(2);
                });

                await execute();

                order.push(3);
                return expect(order.toString()).to.eql(expected.toString());
            } else {
                assert.fail(`Did not succesfully create list ${listTitle}`);
            }
        });

        if (testSettings.testUser?.length > 0) {
            it("Should execute batches that have internally cloned requests but aren't items.add", async function () {
                this.timeout(120000);
                const order: number[] = [];
                const expected: number[] = [1, 2, 3];

                const { Id: groupId } = await _spRest.web.associatedVisitorGroup.select("Id")<{ Id: number }>();

                if (groupId !== undefined) {
                    const [batchedSP, execute] = _spRest.batched();

                    batchedSP.web.siteGroups.getById(groupId).users().then(function () {
                        order.push(1);
                    });

                    batchedSP.web.siteGroups.getById(groupId).users.add(testSettings.testUser).then(function () {
                        order.push(2);
                    });

                    await execute();

                    order.push(3);
                    return expect(order.toString()).to.eql(expected.toString());
                } else {
                    assert.fail("Did not succesfully retrieve visitors group id");
                }
            });
        }

        // TODO: Error with line 155 not completeing. Needs more investigation
        it.skip("Should handle complex operation ordering", async function () {
            this.timeout(120000);
            const order: number[] = [];
            const expected: number[] = [1, 2, 3, 4];
            const listTitle = "BatchOrderingTest";

            const ler = await _spRest.web.lists.ensure(listTitle, "", 101);

            if (ler.data) {
                const [batchedSP, execute] = _spRest.batched();

                // ensure we have a file
                const far = await batchedSP.web.lists.getByTitle(listTitle).rootFolder.files.addUsingPath("MyFile.txt", "Some content");

                const item = await far.file.getItem();

                item.file.checkout().then(function () {
                    order.push(1);
                });

                item.update({
                    Title: "test.txt",
                }).then(function () {
                    order.push(2);
                });

                item.file.checkin("", CheckinType.Major).then(function () {
                    order.push(3);
                });

                await execute();

                order.push(4);
                return expect(order.toString()).to.eql(expected.toString());
            } else {
                assert.fail(`Did not succesfully create list ${listTitle}`);
            }
        });
    }
});
