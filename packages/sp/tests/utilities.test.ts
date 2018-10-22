import { expect } from "chai";
import { sp } from "../";

describe("Utilities", () => {
    describe("containsInvalidFileFolderChars", () => {
        it("should return true for file/folder name with invalid characters", () => {
            const name = "test?test.txt";
            return expect(sp.utility.containsInvalidFileFolderChars(name)).to.be.true;
        });

        it("should return false for file/folder name with no invalid characters", () => {
            const name = "test.txt";
            return expect(sp.utility.containsInvalidFileFolderChars(name)).to.be.false;
        });
    });

    describe("stripInvalidFileFolderChars", () => {
        it("should strip invalid characters from file/folder name (online)", () => {
            const name = "a\"#%*:<>?/\\|b.txt";
            return expect(sp.utility.stripInvalidFileFolderChars(name)).to.equal("a#%b.txt");
        });

        it("should strip invalid characters from file/folder name (onpremise)", () => {
            const name = "a\"#%*:<>?/\\|b.txt";
            return expect(sp.utility.stripInvalidFileFolderChars(name, "", true)).to.equal("ab.txt");
        });

        it("should replace invalid characters with custom replacer if provided", () => {
            const name = "a*b.txt";
            return expect(sp.utility.stripInvalidFileFolderChars(name, "c")).to.equal("acb.txt");
        });
    });
});
