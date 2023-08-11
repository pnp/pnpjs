import { expect } from "chai";
import { PnPClientStorage } from "@pnp/core";
import { pnpTest } from "../pnp-test.js";

describe("Storage", function () {

    describe("PnPClientStorageWrapper", function () {

        let storage: PnPClientStorage;

        beforeEach(pnpTest("71bacb4d-2a28-4da3-a09b-7b8625345586", function () {
            storage = new PnPClientStorage();
        }));

        it("Add and Get a value (local)", pnpTest("4986f3f6-3b31-4ac5-9746-62384a108ae1", function () {
            storage.local.put("test", "value");
            const ret = storage.local.get("test");
            expect(ret).to.eq("value");
        }));

        it("Add two values, remove one and still return the other (local)", pnpTest("b370742a-0eb9-40f5-bb75-43b667f51181", function () {
            storage.local.put("test1", "value1");
            storage.local.put("test2", "value2");
            storage.local.delete("test1");
            const ret = storage.local.get("test2");
            expect(ret).to.eq("value2");
        }));

        it("Use getOrPut to add a value using a getter function and return it (local)", pnpTest("6f8a3a57-6e1e-4e26-9c86-2bfb05085c5e", function () {
            storage.local.getOrPut("test", function () {
                return new Promise(() => "value");
            }).then(function () {
                const ret = storage.local.get("test");
                expect(ret).to.eq("value");
            });
        }));

        it("Add and Get a value (session)", pnpTest("71cc7886-18d7-4362-b232-07afd7d6b750", function () {
            storage.session.put("test", "value");
            const ret = storage.session.get("test");
            expect(ret).to.eq("value");
        }));

        it("Add two values, remove one and still return the other (session)", pnpTest("8c570f93-d6aa-49f3-a740-d884f1832b59", function () {
            storage.session.put("test1", "value1");
            storage.session.put("test2", "value2");
            storage.session.delete("test1");
            const ret = storage.session.get("test2");
            expect(ret).to.eq("value2");
        }));

        it("Use getOrPut to add a value using a getter function and return it (session)", pnpTest("0c25edf5-120e-48d3-b6cd-e2da49391d21", function () {
            storage.session.getOrPut("test", function () {
                return new Promise(() => "value");
            }).then(function () {
                const ret = storage.session.get("test");
                expect(ret).to.eq("value");
            });
        }));
    });
});
