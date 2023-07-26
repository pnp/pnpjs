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
import { pnpTest } from "../pnp-test.js";

// tslint:disable:no-unused-expression

describe("dateAdd", function () {

    it("Add 5 Minutes", pnpTest("e5eeda9b-2378-430c-a9d9-ac952c0b4f8e", function () {
        const testDate = new Date();
        const checkDate = new Date(testDate.toLocaleString());
        checkDate.setMinutes(testDate.getMinutes() + 5);
        expect(dateAdd(testDate, "minute", 5).getMinutes()).to.eq(checkDate.getMinutes());
    }));

    it("Add 2 Years", pnpTest("2a25ffc5-4f96-4f59-9a57-26ea74d1a3b5", function () {
        const testDate = new Date();
        const checkDate = new Date(testDate.toLocaleString());
        checkDate.setFullYear(testDate.getFullYear() + 2);
        expect(dateAdd(testDate, "year", 2).getFullYear()).to.eq(checkDate.getFullYear());
    }));

});

describe("combine", function () {

    it("Path (1)", pnpTest("e8cedd77-c58d-4277-9465-6afa2e73adae", function () {
        expect(combine("/path/", "path2", "path3", "/path4")).to.eq("path/path2/path3/path4");
    }));

    it("Path (2)", pnpTest("1b9f2dc6-5b17-4573-8a65-2ef651b8972c", function () {
        expect(combine("http://site/path/", "/path4/page.aspx")).to.eq("http://site/path/path4/page.aspx");
    }));

    it("Path (3)", pnpTest("df90d9c6-c841-42f4-88d0-fb4d1a0451a5", function () {
        expect(combine(null, "path2", undefined, null, "/path4")).to.eq("path2/path4");
    }));

    it("Path (4)", pnpTest("b8564799-f0cb-4183-81a9-564e1480eba4", function () {
        expect(combine(null, "path2", undefined, "", null, "/path4")).to.eq("path2/path4");
    }));

    it("No Path", pnpTest("502a081f-144e-45c8-8115-c1ad4bc75d72", function () {
        expect(combine()).to.eq("");
    }));

});

describe("getRandomString", function () {

    it("Length 5", pnpTest("6c726b85-720a-4793-b5f6-2d302d16eb5b", function () {
        const j = getRandomString(5);
        expect(j).to.be.a("string");
        expect(j).to.have.length(5);
    }));

    it("Length 28", pnpTest("26afbb93-8d8d-4f2a-a1c0-b3a0fb78c6bb", function () {
        const j = getRandomString(28);
        expect(j).to.be.a("string");
        expect(j).to.have.length(28);
    }));

});

describe("getGUID", function () {

    it("Test Pattern", pnpTest("78cd5f6d-d30a-4c0c-b44f-f55e34e39b06", function () {
        expect(getGUID()).to.match(/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i);
    }));

});

describe("isFunc", function () {

    it("True", pnpTest("ff0020e6-0e1b-4b12-a4a1-8a4b2fc8fcdb", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isFunc(function () {
            return;
        })).to.be.true;
    }));

    it("False", pnpTest("ff0020e6-0e1b-4b12-a4a1-8a4b2fc8fcdb", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isFunc({ val: 0 })).to.be.false;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isFunc(null)).to.be.false;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isFunc(undefined)).to.be.false;
    }));
});

describe("objectDefinedNotNull", function () {

    it("defined", pnpTest("71a58271-6205-4a7b-b651-9322a36398cc", function () {

        return expect(objectDefinedNotNull({})).to.be.true;
    }));

    it("null", pnpTest("56af5be3-06e1-41b9-8183-2a9d7654052b", function () {

        return expect(objectDefinedNotNull(null)).to.be.false;
    }));

    it("undefined", pnpTest("65dcfc1f-1c3b-488d-9bc5-3a5dd36e06a3", function () {

        return expect(objectDefinedNotNull(undefined)).to.be.false;
    }));

});

describe("isArray", function () {

    it("True", pnpTest("3ad9a949-f147-47a7-868c-e1ae0fc9d65e", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isArray([1, 2, 3, 4])).to.be.true;
    }));

    it("False", pnpTest("d2bb66ab-b7ed-4e3d-828a-2044d4a4ffed", function () {
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
    }));

});

describe("isUrlAbsolute", function () {

    it("Yes (1)", pnpTest("edc77eae-ddd3-427c-aae8-863e79583c05", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isUrlAbsolute("https://something.com")).to.be.true;
    }));

    it("Yes (2)", pnpTest("25999d21-cc28-4582-bdb5-31fa59af1191", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isUrlAbsolute("//something.com")).to.be.true;
    }));

    it("Yes (3)", pnpTest("32547e58-299a-4979-a875-6d2dfdf324cc", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isUrlAbsolute("http://something.com")).to.be.true;
    }));

    it("No (1)", pnpTest("2ee70c05-0f90-47ce-a6cf-801bf459cfca", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isUrlAbsolute("/sites/dev")).to.be.false;
    }));

    it("No (2)", pnpTest("7b6b7504-fd43-4c4d-ad65-e944a11148e9", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isUrlAbsolute("sites/dev")).to.be.false;
    }));

    it("Empty", pnpTest("38c0cfa1-e518-47e9-a09a-7e941516dfb0", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isUrlAbsolute("")).to.be.false;
    }));

});

describe("stringIsNullOrEmpty", function () {

    it("Yes (1)", pnpTest("2c88a924-49d4-4468-b4ed-47dc59341499", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(stringIsNullOrEmpty(null)).to.be.true;
    }));

    it("Yes (2)", pnpTest("146cfe8e-3e74-420b-bde7-feec421fb3a8", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(stringIsNullOrEmpty("")).to.be.true;
    }));

    it("No", pnpTest("e843faac-0423-44ee-8206-00468296ea61", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(stringIsNullOrEmpty("not empty")).to.be.false;
    }));

});

describe("jsS", function () {

    it("Sucess", function () {
        expect(jsS({ test: true })).to.eq("{\"test\":true}");
    });

});

describe("hOP", function () {

    it("Success", pnpTest("f1d3a279-c51e-4c1b-a3d3-3d8ef3c747f6", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(hOP({ test: true }, "test")).to.be.true;
    }));

    it("Fail", pnpTest("d65fb0d9-be6e-4a3d-9ba9-44e85e8d6288", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(hOP({ test: true }, "nope")).to.be.false;
    }));
});

describe("getHashCode", function () {

    it("Success", pnpTest("dcd0ccfc-b4ff-4d9f-bd37-8a1b14d2baea", function () {
        expect(getHashCode("test string value")).to.be.a("number");
        expect(getHashCode("test string value !@#$%^&*()_+{}<>,.?/'\"")).to.be.a("number");
    }));

});
