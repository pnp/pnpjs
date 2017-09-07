import { expect } from "chai";
import { Folders, Folder } from "../../src/sharepoint/folders";
import { toMatchEndRegex } from "../testutils";

describe("Folders", () => {

    let folders: Folders;

    beforeEach(() => {
        folders = new Folders("_api/web");
    });

    it("Should be an object", () => {
        expect(folders).to.be.a("object");
    });

    describe("url", () => {
        it("Should return _api/web/folders", () => {
            expect(folders.toUrl()).to.match(toMatchEndRegex("_api/web/folders"));
        });
    });

    describe("getByName", () => {
        it("Should return _api/web/folders('Russell Wilson')", () => {
            let folder = folders.getByName("Russell Wilson");
            expect(folder.toUrl()).to.match(toMatchEndRegex("_api/web/folders('Russell Wilson')"));
        });
    });
});

describe("Folder", () => {

    let folder: Folder;

    beforeEach(() => {
        folder = new Folder("_api/web/folders", "getByName('Marshawn Lynch')");
    });

    it("Should be an object", () => {
        expect(folder).to.be.a("object");
    });

    describe("contentTypeOrder", () => {
        it("Should return _api/web/folders/getByName('Marshawn Lynch')/contentTypeOrder", () => {
            expect(folder.contentTypeOrder.toUrl())
                .to.match(toMatchEndRegex("_api/web/folders/getByName('Marshawn Lynch')/contentTypeOrder"));
        });
    });

    describe("files", () => {
        it("Should return _api/web/folders/getByName('Marshawn Lynch')/files", () => {
            expect(folder.files.toUrl()).to.match(toMatchEndRegex("_api/web/folders/getByName('Marshawn Lynch')/files"));
        });
    });

    describe("folders", () => {
        it("Should return _api/web/folders/getByName('Marshawn Lynch')/folders", () => {
            expect(folder.folders.toUrl()).to.match(toMatchEndRegex("_api/web/folders/getByName('Marshawn Lynch')/folders"));
        });
    });

    describe("listItemAllFields", () => {
        it("Should return _api/web/folders/getByName('Marshawn Lynch')/listItemAllFields", () => {
            expect(folder.listItemAllFields.toUrl())
                .to.match(toMatchEndRegex("_api/web/folders/getByName('Marshawn Lynch')/listItemAllFields"));
        });
    });

    describe("parentFolder", () => {
        it("Should return _api/web/folders/getByName('Marshawn Lynch')/parentFolder", () => {
            expect(folder.parentFolder.toUrl()).to.match(toMatchEndRegex("_api/web/folders/getByName('Marshawn Lynch')/parentFolder"));
        });
    });

    describe("properties", () => {
        it("Should return _api/web/folders/getByName('Marshawn Lynch')/properties", () => {
            expect(folder.properties.toUrl()).to.match(toMatchEndRegex("_api/web/folders/getByName('Marshawn Lynch')/properties"));
        });
    });

    describe("serverRelativeUrl", () => {
        it("Should return _api/web/folders/getByName('Marshawn Lynch')/serverRelativeUrl", () => {
            expect(folder.serverRelativeUrl.toUrl())
                .to.match(toMatchEndRegex("_api/web/folders/getByName('Marshawn Lynch')/serverRelativeUrl"));
        });
    });

    describe("uniqueContentTypeOrder", () => {
        it("Should return _api/web/folders/getByName('Marshawn Lynch')/uniqueContentTypeOrder", () => {
            expect(folder.uniqueContentTypeOrder.toUrl())
                .to.match(toMatchEndRegex("_api/web/folders/getByName('Marshawn Lynch')/uniqueContentTypeOrder"));
        });
    });
});
