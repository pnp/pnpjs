import { expect } from "chai";
import {
    dateAdd,
    combine,
    getRandomString,
    getGUID,
    isFunc,
    isArray,
    objectDefinedNotNull,
    isUrlAbsolute,
    stringIsNullOrEmpty,
    jsS,
    hOP,
    getHashCode,
} from "@pnp/core";

// tslint:disable:no-unused-expression

describe("dateAdd", function () {
    it("Add 5 Minutes", function () {
        const testDate = new Date();
        const checkDate = new Date(testDate.toLocaleString());
        checkDate.setMinutes(testDate.getMinutes() + 5);
        expect(dateAdd(testDate, "minute", 5).getMinutes()).to.eq(checkDate.getMinutes());
    });

    it("Add 2 Years", function () {
        const testDate = new Date();
        const checkDate = new Date(testDate.toLocaleString());
        checkDate.setFullYear(testDate.getFullYear() + 2);
        expect(dateAdd(testDate, "year", 2).getFullYear()).to.eq(checkDate.getFullYear());
    });
});

describe("combine", function () {
    it("Path (1)", function () {
        expect(combine("/path/", "path2", "path3", "/path4")).to.eq("path/path2/path3/path4");
    });

    it("Path (2)", function () {
        expect(combine("http://site/path/", "/path4/page.aspx")).to.eq("http://site/path/path4/page.aspx");
    });

    it("Path (3)", function () {
        expect(combine(null, "path2", undefined, null, "/path4")).to.eq("path2/path4");
    });

    it("Path (4)", function () {
        expect(combine(null, "path2", undefined, "", null, "/path4")).to.eq("path2/path4");
    });

    it("No Path", function () {
        expect(combine()).to.eq("");
    });
});

describe("getRandomString", function () {
    it("Length 5", function () {
        const j = getRandomString(5);
        expect(j).to.be.a("string");
        expect(j).to.have.length(5);
    });

    it("Length 28", function () {
        const j = getRandomString(28);
        expect(j).to.be.a("string");
        expect(j).to.have.length(28);
    });
});

describe("getGUID", function () {
    it("Test Pattern", function () {
        expect(getGUID()).to.match(/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i);
    });
});

describe("isFunc", function () {
    it("True", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isFunc(function () {
            return;
        })).to.be.true;
    });

    it("False", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isFunc({ val: 0 })).to.be.false;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isFunc(null)).to.be.false;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
    it("True", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isArray([1, 2, 3, 4])).to.be.true;
    });

    it("False", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isArray(null)).to.be.false;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isArray("")).to.be.false;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isArray(3)).to.be.false;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isArray({})).to.be.false;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isArray(undefined)).to.be.false;
    });
});

describe("isUrlAbsolute", function () {
    it("Yes (1)", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isUrlAbsolute("https://something.com")).to.be.true;
    });

    it("Yes (2)", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isUrlAbsolute("//something.com")).to.be.true;
    });

    it("Yes (3)", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isUrlAbsolute("http://something.com")).to.be.true;
    });

    it("No (1)", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isUrlAbsolute("/sites/dev")).to.be.false;
    });

    it("No (2)", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isUrlAbsolute("sites/dev")).to.be.false;
    });

    it("Empty", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isUrlAbsolute("")).to.be.false;
    });
});

describe("stringIsNullOrEmpty", function () {
    it("Yes (1)", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(stringIsNullOrEmpty(null)).to.be.true;
    });

    it("Yes (2)", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(stringIsNullOrEmpty("")).to.be.true;
    });

    it("No", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(stringIsNullOrEmpty("not empty")).to.be.false;
    });
});

describe("jsS", function () {
    it("Sucess", function () {
        expect(jsS({ test: true })).to.eq("{\"test\":true}");
    });
});

describe("hOP", function () {
    it("Success", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(hOP({ test: true }, "test")).to.be.true;
    });
    it("Fail", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(hOP({ test: true }, "nope")).to.be.false;
    });
});

describe("getHashCode", function () {
    it("Success", function () {
        expect(getHashCode("test string value")).to.be.a("number");
        expect(getHashCode("test string value !@#$%^&*()_+{}<>,.?/'\"")).to.be.a("number");
    });
});
