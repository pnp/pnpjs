import { expect } from "chai";
import { Util } from "../../src/utils/util";

describe("Util", () => {

    describe("getCtxCallback", () => {
        it("Should create contextual callback", () => {

            class test {
                constructor() {
                    this.num = 1;
                }
                public num: number;
                public func(a: number) {
                    this.num += a;
                }
            }

            let t = new test();

            let callback = Util.getCtxCallback(t, t.func, 7);
            expect(callback).to.exist;
            expect(callback).to.be.a("function");
            // this call will update ctx var inside the callback
            expect(t.num).to.eq(1);
            callback();
            expect(t.num).to.eq(8);
        });
    });

    describe("dateAdd", () => {
        it("Should add 5 minutes to a date", () => {
            let testDate = new Date();
            let checkDate = new Date(testDate.toLocaleString());
            checkDate.setMinutes(testDate.getMinutes() + 5);
            expect(Util.dateAdd(testDate, "minute", 5).getMinutes()).to.eq(checkDate.getMinutes());
        });

        it("Should add 2 years to a date", () => {
            let testDate = new Date();
            let checkDate = new Date(testDate.toLocaleString());
            checkDate.setFullYear(testDate.getFullYear() + 2);
            expect(Util.dateAdd(testDate, "year", 2).getFullYear()).to.eq(checkDate.getFullYear());
        });
    });

    describe("stringInsert", () => {
        it("Should insert the string cat into dog at index 2 resulting in docatg", () => {
            expect(Util.stringInsert("dog", 2, "cat")).to.eq("docatg");
        });
    });

    describe("combinePaths", () => {
        it("Should combine the paths '/path/', 'path2', 'path3' and '/path4' to be path/path2/path3/path4", () => {
            expect(Util.combinePaths("/path/", "path2", "path3", "/path4")).to.eq("path/path2/path3/path4");
        });

        it("Should combine the paths 'http://site/path/' and '/path4/page.aspx' to be http://site/path/path4/page.aspx", () => {
            expect(Util.combinePaths("http://site/path/", "/path4/page.aspx")).to.eq("http://site/path/path4/page.aspx");
        });

        it("Should combine the paths null, 'path2', undefined, null and '/path4' to be path2/path4", () => {
            expect(Util.combinePaths(null, "path2", undefined, null, "/path4")).to.eq("path2/path4");
        });

        it("Should combine the paths null, 'path2', undefined, \"\", null and '/path4' to be path2/path4", () => {
            expect(Util.combinePaths(null, "path2", undefined, "", null, "/path4")).to.eq("path2/path4");
        });

        it("Should not error with no arguments specified", () => {
            expect(Util.combinePaths()).to.eq("");
        });
    });

    describe("getRandomString", () => {
        it("Should produce a random string of length 5", () => {
            let j = Util.getRandomString(5);
            expect(j).to.exist;
            expect(j).to.be.a("string");
            expect(j).to.have.length(5);
        });

        it("Should produce a random string of length 27", () => {
            let j = Util.getRandomString(27);
            expect(j).to.exist;
            expect(j).to.be.a("string");
            expect(j).to.have.length(27);
        });
    });

    describe("getGUID", () => {
        it("Should produce a GUID matching the expected pattern", () => {
            expect(Util.getGUID()).to.match(/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i);
        });
    });

    describe("isFunction", () => {
        it("Should find that a function is a function", () => {
            expect(Util.isFunction(() => { return; })).to.be.true;
        });

        it("Should find that a non-function is not a function", () => {
            expect(Util.isFunction({ val: 0 })).to.be.false;
            expect(Util.isFunction(null)).to.be.false;
            expect(Util.isFunction(undefined)).to.be.false;
        });
    });

    describe("isArray", () => {
        it("Should find that an Array is an Array", () => {
            expect(Util.isArray([1, 2, 3, 4])).to.be.true;
        });

        it("Should find that a non-Array is not an Array", () => {
            expect(Util.isArray(null)).to.be.false;
            expect(Util.isArray("")).to.be.false;
            expect(Util.isArray(3)).to.be.false;
            expect(Util.isArray({})).to.be.false;
            expect(Util.isArray(undefined)).to.be.false;
        });
    });
});
