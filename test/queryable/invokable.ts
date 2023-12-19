/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { expect } from "chai";
import {
    invokable,
    IInvokable,
} from "@pnp/queryable";

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

    it("works", async function () {

        const obj = new InvokableTest();
        const v = await obj();
        expect(v).to.eq(value);
    });

    it("correctly overrides in inheriting classes", async function () {

        const obj = new InvokableTest2();
        const v = await obj();
        expect(v).to.eq(value2);
    });
});
