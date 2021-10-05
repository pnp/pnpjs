import { expect } from "chai";
import { PnPClientStorageWrapper } from "@pnp/core";

describe("Storage", function () {

    describe("PnPClientStorageWrapper", function () {

        let wrapper: PnPClientStorageWrapper;

        beforeEach(function () {
            wrapper = new PnPClientStorageWrapper(localStorage);
        });

        it("Add and Get a value", function () {
            wrapper.put("test", "value");
            const ret = wrapper.get("test");
            expect(ret).to.eq("value");
        });

        it("Add two values, remove one and still return the other", function () {
            wrapper.put("test1", "value1");
            wrapper.put("test2", "value2");
            wrapper.delete("test1");
            const ret = wrapper.get("test2");
            expect(ret).to.eq("value2");
        });

        it("Use getOrPut to add a value using a getter function and return it", function () {
            wrapper.getOrPut("test", function () {
                return new Promise(() => "value");
            }).then(function () {
                const ret = wrapper.get("test");
                expect(ret).to.eq("value");
            });
        });
    });
});
