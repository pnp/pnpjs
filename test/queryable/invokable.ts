import { expect } from "chai";
import {
    invokable,
    IInvokable,
} from "@pnp/queryable";
import { pnpTest } from "../pnp-test.js";

const value = "Test Result";
const value2 = "Test2 Values";

@invokable(async () => value)
class InvokableTest { }
// eslint-disable-next-line no-redeclare
interface InvokableTest extends IInvokable<any> { }

@invokable(async () => value2)
class InvokableTest2 extends InvokableTest { }
// eslint-disable-next-line no-redeclare
interface InvokableTest2 extends IInvokable<any> { }

describe("invokable", function () {

    it("works", pnpTest("dc414078-db3a-4638-bd94-77be33430bf9", async function () {

        const obj = new InvokableTest();
        const v = await obj();
        expect(v).to.eq(value);
    }));

    it("correctly overrides in inheriting classes", pnpTest("6254e288-e5e5-4271-ae37-e5db3a0cb8f7", async function () {

        const obj = new InvokableTest2();
        const v = await obj();
        expect(v).to.eq(value2);
    }));
});
