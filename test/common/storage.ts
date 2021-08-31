import { expect } from "chai";
import { PnPClientStorageWrapper } from "@pnp/core";

describe("Storage", () => {

    describe("PnPClientStorageWrapper", () => {

        let wrapper: PnPClientStorageWrapper;

        beforeEach(() => {
            wrapper = new PnPClientStorageWrapper(localStorage);
        });

        it("Add and Get a value", () => {
            wrapper.put("test", "value");
            const ret = wrapper.get("test");
            expect(ret).to.eq("value");
        });

        it("Add two values, remove one and still return the other", () => {
            wrapper.put("test1", "value1");
            wrapper.put("test2", "value2");
            wrapper.delete("test1");
            const ret = wrapper.get("test2");
            expect(ret).to.eq("value2");
        });

        it("Use getOrPut to add a value using a getter function and return it", () => {
            wrapper.getOrPut("test", () => {
                return new Promise(() => "value");
            }).then(() => {
                const ret = wrapper.get("test");
                expect(ret).to.eq("value");
            });
        });
    });
});
