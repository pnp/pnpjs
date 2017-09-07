import { expect } from "chai";
import { Files, File, Versions, Version } from "../../src/sharepoint/files";
import { toMatchEndRegex } from "../testutils";

describe("Files", () => {

    let files: Files;

    beforeEach(() => {
        files = new Files("_api/web");
    });

    it("Should be an object", () => {
        expect(files).to.be.a("object");
    });

    describe("url", () => {
        it("Should return _api/web/files", () => {
            expect(files.toUrl()).to.match(toMatchEndRegex("_api/web/files"));
        });
    });

    describe("getByName", () => {
        it("Should return _api/web/files('Doug Baldwin')", () => {
            let file = files.getByName("Doug Baldwin");
            expect(file.toUrl()).to.match(toMatchEndRegex("_api/web/files('Doug Baldwin')"));
        });
    });
});

describe("File", () => {

    let file: File;

    beforeEach(() => {
        file = new File("_api/web/files", "getByName('Thomas Rawls')");
    });

    it("Should be an object", () => {
        expect(file).to.be.a("object");
    });

    describe("listItemAllFields", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/listItemAllFields", () => {
            expect(file.listItemAllFields.toUrl()).to.match(toMatchEndRegex("_api/web/files/getByName('Thomas Rawls')/listItemAllFields"));
        });
    });

    describe("versions", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/versions", () => {
            expect(file.versions.toUrl()).to.match(toMatchEndRegex("_api/web/files/getByName('Thomas Rawls')/versions"));
        });
    });
});

describe("Versions", () => {

    let versions: Versions;

    beforeEach(() => {
        versions = new Versions("_api/web/getFileByServerRelativeUrl('Earl Thomas')");
    });

    it("Should be an object", () => {
        expect(versions).to.be.a("object");
    });

    describe("url", () => {
        it("Should return _api/web/getFileByServerRelativeUrl('Earl Thomas')/versions", () => {
            expect(versions.toUrl()).to.match(toMatchEndRegex("_api/web/getFileByServerRelativeUrl('Earl Thomas')/versions"));
        });
    });

    describe("getById", () => {
        it("Should return _api/web/getFileByServerRelativeUrl('Earl Thomas')/versions(1)", () => {
            let version = versions.getById(1);
            expect(version.toUrl()).to.match(toMatchEndRegex("_api/web/getFileByServerRelativeUrl('Earl Thomas')/versions(1)"));
        });
    });
});

describe("Version", () => {

    let version: Version;

    beforeEach(() => {
        version = new Version("_api/web/getFileByServerRelativeUrl('Richard Sherman')", "versions(1)");
    });

    it("Should be an object", () => {
        expect(version).to.be.a("object");
    });
});
