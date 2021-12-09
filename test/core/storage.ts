import { expect } from "chai";
import { PnPClientStorage } from "@pnp/core";

describe("Storage", function () {

    describe("PnPClientStorageWrapper", function () {

        let storage: PnPClientStorage;

        beforeEach(function () {
            storage = new PnPClientStorage();
        });

        it("Add and Get a value (local)", function () {
            storage.local.put("test", "value");
            const ret = storage.local.get("test");
            expect(ret).to.eq("value");
        });

        it("Add two values, remove one and still return the other (local)", function () {
            storage.local.put("test1", "value1");
            storage.local.put("test2", "value2");
            storage.local.delete("test1");
            const ret = storage.local.get("test2");
            expect(ret).to.eq("value2");
        });

        it("Use getOrPut to add a value using a getter function and return it (local)", function () {
            storage.local.getOrPut("test", function () {
                return new Promise(() => "value");
            }).then(function () {
                const ret = storage.local.get("test");
                expect(ret).to.eq("value");
            });
        });

        it("Add and Get a value (session)", function () {
            storage.session.put("test", "value");
            const ret = storage.session.get("test");
            expect(ret).to.eq("value");
        });

        it("Add two values, remove one and still return the other (session)", function () {
            storage.session.put("test1", "value1");
            storage.session.put("test2", "value2");
            storage.session.delete("test1");
            const ret = storage.session.get("test2");
            expect(ret).to.eq("value2");
        });

        it("Use getOrPut to add a value using a getter function and return it (session)", function () {
            storage.session.getOrPut("test", function () {
                return new Promise(() => "value");
            }).then(function () {
                const ret = storage.session.get("test");
                expect(ret).to.eq("value");
            });
        });
    });
});
