import { expect } from "chai";
import { getCtxCallback } from "../";
import { dateAdd, combine, getRandomString, getGUID, isFunc, isArray, getAttrValueFromString, extend } from "../";

describe("extend", () => {

    it("Should extend an object with odd fields", () => {

        const o1 = {
            title: "thing",
        };

        const o2 = {
            desc: "another",
        };

        const o = extend(o1, o2);

        expect(o).to.deep.eq({ title: "thing", desc: "another" });
    });

    it("Should extend an object with even fields", () => {

        const o1 = {
            desc: "another",
            title: "thing",
        };

        const o2 = {
            bob: "sam",
            sara: "wendy",
        };

        const o = extend(o1, o2);

        expect(o).to.deep.eq({ desc: "another", title: "thing", bob: "sam", sara: "wendy" });
    });

    it("Should overwrite fields", () => {

        const o1 = {
            title: "thing",
        };

        const o2 = {
            title: "new",
        };

        const o = extend(o1, o2);

        expect(o).to.deep.eq({ title: "new" });
    });

    it("Should not overwrite fields", () => {

        const o1 = {
            title: "thing",
        };

        const o2 = {
            title: "new",
        };

        const o = extend(o1, o2, true);

        expect(o).to.deep.eq({ title: "thing" });
    });

    it("Should field fields", () => {

        const o1 = {
            title: "thing",
        };

        const o2 = {
            bob: "new",
            sara: "wendy",
        };

        const o = extend(o1, o2, false, (name) => name !== "bob");

        expect(o).to.deep.eq({ title: "thing", sara: "wendy" });
    });
});

describe("getCtxCallback", () => {
    it("Should create contextual callback", () => {

        class Test {
            constructor(public num = 1) { }
            public func(a: number) {
                this.num += a;
            }
        }

        const t = new Test();

        const callback = getCtxCallback(t, t.func, 7);
        expect(callback).to.be.a("function");
        // this call will update ctx var inside the callback
        expect(t.num).to.eq(1);
        callback();
        expect(t.num).to.eq(8);
    });
});

describe("dateAdd", () => {
    it("Should add 5 minutes to a date", () => {
        const testDate = new Date();
        const checkDate = new Date(testDate.toLocaleString());
        checkDate.setMinutes(testDate.getMinutes() + 5);
        expect(dateAdd(testDate, "minute", 5).getMinutes()).to.eq(checkDate.getMinutes());
    });

    it("Should add 2 years to a date", () => {
        const testDate = new Date();
        const checkDate = new Date(testDate.toLocaleString());
        checkDate.setFullYear(testDate.getFullYear() + 2);
        expect(dateAdd(testDate, "year", 2).getFullYear()).to.eq(checkDate.getFullYear());
    });
});

describe("combinePaths", () => {
    it("Should combine the paths '/path/', 'path2', 'path3' and '/path4' to be path/path2/path3/path4", () => {
        expect(combine("/path/", "path2", "path3", "/path4")).to.eq("path/path2/path3/path4");
    });

    it("Should combine the paths 'http://site/path/' and '/path4/page.aspx' to be http://site/path/path4/page.aspx", () => {
        expect(combine("http://site/path/", "/path4/page.aspx")).to.eq("http://site/path/path4/page.aspx");
    });

    it("Should combine the paths null, 'path2', undefined, null and '/path4' to be path2/path4", () => {
        expect(combine(null, "path2", undefined, null, "/path4")).to.eq("path2/path4");
    });

    it("Should combine the paths null, 'path2', undefined, \"\", null and '/path4' to be path2/path4", () => {
        expect(combine(null, "path2", undefined, "", null, "/path4")).to.eq("path2/path4");
    });

    it("Should not error with no arguments specified", () => {
        expect(combine()).to.eq("");
    });
});

describe("getRandomString", () => {
    it("Should produce a random string of length 5", () => {
        const j = getRandomString(5);
        expect(j).to.be.a("string");
        expect(j).to.have.length(5);
    });

    it("Should produce a random string of length 28", () => {
        const j = getRandomString(28);
        expect(j).to.be.a("string");
        expect(j).to.have.length(28);
    });
});

describe("getGUID", () => {
    it("Should produce a GUID matching the expected pattern", () => {
        expect(getGUID()).to.match(/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i);
    });
});

describe("isFunction", () => {
    it("Should find that a function is a function", () => {
        expect(isFunc(() => { return; })).to.be.true;
    });

    it("Should find that a non-function is not a function", () => {
        expect(isFunc({ val: 0 })).to.be.false;
        expect(isFunc(null)).to.be.false;
        expect(isFunc(undefined)).to.be.false;
    });
});

describe("isArray", () => {
    it("Should find that an Array is an Array", () => {
        expect(isArray([1, 2, 3, 4])).to.be.true;
    });

    it("Should find that a non-Array is not an Array", () => {
        expect(isArray(null)).to.be.false;
        expect(isArray("")).to.be.false;
        expect(isArray(3)).to.be.false;
        expect(isArray({})).to.be.false;
        expect(isArray(undefined)).to.be.false;
    });
});

describe("getAttrValueFromString", () => {

    it("Should correctly parse attribute values", () => {
        expect(getAttrValueFromString(`<thing att='value' />`, "att")).to.eq("value");
        expect(getAttrValueFromString(`<thing att="value1293.?,/\|!@#$%^&*()[]{}" />`, "att")).to.eq("value1293\\.\\?,/\\|!@#\\$%\\^&\\*\\(\\)\\[\\]\\{\\}");
        expect(getAttrValueFromString(`<thing att  =  'value' />`, "att")).to.eq("value");
        expect(getAttrValueFromString(`<thing att='value"' />`, "att")).to.eq("value\"");
        expect(getAttrValueFromString(`<thing att="value'" />`, "att")).to.eq("value'");
        expect(getAttrValueFromString(`<thing att='value value' att2="something" />`, "att")).to.eq("value value");
        expect(getAttrValueFromString(`<thing att='value'></thing>`, "att")).to.eq("value");
    });
});
