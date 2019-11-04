import { expect } from "chai";
import { dateAdd, combine, getRandomString, getGUID, isFunc, isArray, assign, getCtxCallback, objectDefinedNotNull, isUrlAbsolute, stringIsNullOrEmpty, jsS, hOP, getHashCode } from "@pnp/common";

// tslint:disable:no-unused-expression

describe("assign", function () {

    it("Should extend an object with odd fields", function () {

        const o1 = {
            title: "thing",
        };

        const o2 = {
            desc: "another",
        };

        const o = assign(o1, o2);

        expect(o).to.deep.eq({ title: "thing", desc: "another" });
    });

    it("Should extend an object with even fields", function () {

        const o1 = {
            desc: "another",
            title: "thing",
        };

        const o2 = {
            bob: "sam",
            sara: "wendy",
        };

        const o = assign(o1, o2);

        expect(o).to.deep.eq({ desc: "another", title: "thing", bob: "sam", sara: "wendy" });
    });

    it("Should overwrite fields", function () {

        const o1 = {
            title: "thing",
        };

        const o2 = {
            title: "new",
        };

        const o = assign(o1, o2);

        expect(o).to.deep.eq({ title: "new" });
    });

    it("Should not overwrite fields", function () {

        const o1 = {
            title: "thing",
        };

        const o2 = {
            title: "new",
        };

        const o = assign(o1, o2, true);

        expect(o).to.deep.eq({ title: "thing" });
    });

    it("Should field fields", function () {

        const o1 = {
            title: "thing",
        };

        const o2 = {
            bob: "new",
            sara: "wendy",
        };

        const o = assign(o1, o2, false, (name) => name !== "bob");

        expect(o).to.deep.eq({ title: "thing", sara: "wendy" });
    });
});

describe("getCtxCallback", function () {
    it("Should create contextual callback", function () {

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

describe("dateAdd", function () {
    it("Should add 5 minutes to a date", function () {
        const testDate = new Date();
        const checkDate = new Date(testDate.toLocaleString());
        checkDate.setMinutes(testDate.getMinutes() + 5);
        expect(dateAdd(testDate, "minute", 5).getMinutes()).to.eq(checkDate.getMinutes());
    });

    it("Should add 2 years to a date", function () {
        const testDate = new Date();
        const checkDate = new Date(testDate.toLocaleString());
        checkDate.setFullYear(testDate.getFullYear() + 2);
        expect(dateAdd(testDate, "year", 2).getFullYear()).to.eq(checkDate.getFullYear());
    });
});

describe("combine", function () {
    it("Should combine the paths '/path/', 'path2', 'path3' and '/path4' to be path/path2/path3/path4", function () {
        expect(combine("/path/", "path2", "path3", "/path4")).to.eq("path/path2/path3/path4");
    });

    it("Should combine the paths 'http://site/path/' and '/path4/page.aspx' to be http://site/path/path4/page.aspx", function () {
        expect(combine("http://site/path/", "/path4/page.aspx")).to.eq("http://site/path/path4/page.aspx");
    });

    it("Should combine the paths null, 'path2', undefined, null and '/path4' to be path2/path4", function () {
        expect(combine(null, "path2", undefined, null, "/path4")).to.eq("path2/path4");
    });

    it("Should combine the paths null, 'path2', undefined, \"\", null and '/path4' to be path2/path4", function () {
        expect(combine(null, "path2", undefined, "", null, "/path4")).to.eq("path2/path4");
    });

    it("Should not error with no arguments specified", function () {
        expect(combine()).to.eq("");
    });
});

describe("getRandomString", function () {
    it("Should produce a random string of length 5", function () {
        const j = getRandomString(5);
        expect(j).to.be.a("string");
        expect(j).to.have.length(5);
    });

    it("Should produce a random string of length 28", function () {
        const j = getRandomString(28);
        expect(j).to.be.a("string");
        expect(j).to.have.length(28);
    });
});

describe("getGUID", function () {
    it("Should produce a GUID matching the expected pattern", function () {
        expect(getGUID()).to.match(/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i);
    });
    it("Should produce a GUID matching the expected pattern", function () {
        expect(getGUID()).to.match(/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i);
    });
    it("Should produce a GUID matching the expected pattern", function () {
        expect(getGUID()).to.match(/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i);
    });
    it("Should produce a GUID matching the expected pattern", function () {
        expect(getGUID()).to.match(/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i);
    });
});

describe("isFunc", function () {
    it("Should find that a function is a function", function () {
        expect(isFunc(function () { return; })).to.be.true;
    });

    it("Should find that a non-function is not a function", function () {
        expect(isFunc({ val: 0 })).to.be.false;
        expect(isFunc(null)).to.be.false;
        expect(isFunc(undefined)).to.be.false;
    });
});

describe("objectDefinedNotNull", function () {

    it("defined", function () {

        return expect(objectDefinedNotNull({})).to.be.true;
    });

    it("null", function () {

        return expect(objectDefinedNotNull(null)).to.be.false;
    });

    it("undefined", function () {

        return expect(objectDefinedNotNull(undefined)).to.be.false;
    });

});

describe("isArray", function () {
    it("Should find that an Array is an Array", function () {
        expect(isArray([1, 2, 3, 4])).to.be.true;
    });

    it("Should find that a non-Array is not an Array", function () {
        expect(isArray(null)).to.be.false;
        expect(isArray("")).to.be.false;
        expect(isArray(3)).to.be.false;
        expect(isArray({})).to.be.false;
        expect(isArray(undefined)).to.be.false;
    });
});

describe("isUrlAbsolute", function () {
    it("Yes", function () {
        expect(isUrlAbsolute("https://something.com")).to.be.true;
    });

    it("Yes", function () {
        expect(isUrlAbsolute("//something.com")).to.be.true;
    });

    it("Yes", function () {
        expect(isUrlAbsolute("http://something.com")).to.be.true;
    });

    it("No", function () {
        expect(isUrlAbsolute("/sites/dev")).to.be.false;
    });

    it("No", function () {
        expect(isUrlAbsolute("sites/dev")).to.be.false;
    });

    it("Empty", function () {
        expect(isUrlAbsolute("")).to.be.false;
    });
});

describe("stringIsNullOrEmpty", function () {
    it("Yes", function () {
        expect(stringIsNullOrEmpty(null)).to.be.true;
    });

    it("Yes", function () {
        expect(stringIsNullOrEmpty("")).to.be.true;
    });

    it("No", function () {
        expect(stringIsNullOrEmpty("not empty")).to.be.false;
    });
});

describe("jsS", function () {
    it("Sucess", function () {
        expect(jsS({ test: true })).to.eq(`{"test":true}`);
    });
});

describe("hOP", function () {
    it("Success", function () {
        expect(hOP({ test: true }, "test")).to.be.true;
    });
});

describe("getHashCode", function () {
    it("Success", function () {
        expect(getHashCode("test string value")).to.be.a("number");
    });
});
