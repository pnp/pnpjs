import { Util } from "@pnp/common";
import { expect } from "chai";
import { Items, Item } from "../";
import { toMatchEndRegex } from "./utils";

describe("Items", () => {

    const basePath = "_api/web/lists/getByTitle('Tasks')";
    let items: Items;

    beforeEach(() => {
        items = new Items(basePath);
    });

    it("Should be an object", () => {
        expect(items).to.be.a("object");
    });

    describe("url", () => {
        const path = Util.combinePaths(basePath, "items");
        it("Should return " + path, () => {
            expect(items.toUrl()).to.match(toMatchEndRegex(path));
        });
    });
    describe("getById", () => {
        const path = Util.combinePaths(basePath, "items(1)");
        it("Should return " + path, () => {
            expect(items.getById(1).toUrl()).to.match(toMatchEndRegex(path));
        });
    });
});

describe("Item", () => {

    const basePath = "_api/web/lists/getByTitle('Tasks')/items(1)";
    let item: Item;

    beforeEach(() => {
        item = new Item(basePath);
    });

    it("Should be an object", () => {
        expect(item).to.be.a("object");
    });

    describe("attachmentFiles", () => {
        const path = Util.combinePaths(basePath, "AttachmentFiles");
        it("Should return " + path, () => {
            expect(item.attachmentFiles.toUrl()).to.match(toMatchEndRegex(path));
        });
    });

    describe("contentType", () => {
        const path = Util.combinePaths(basePath, "ContentType");
        it("Should return " + path, () => {
            expect(item.contentType.toUrl()).to.match(toMatchEndRegex(path));
        });
    });

    describe("effectiveBasePermissions", () => {
        const path = Util.combinePaths(basePath, "EffectiveBasePermissions");
        it("Should return " + path, () => {
            expect(item.effectiveBasePermissions.toUrl()).to.match(toMatchEndRegex(path));
        });
    });

    describe("effectiveBasePermissionsForUI", () => {
        const path = Util.combinePaths(basePath, "EffectiveBasePermissionsForUI");
        it("Should return " + path, () => {
            expect(item.effectiveBasePermissionsForUI.toUrl()).to.match(toMatchEndRegex(path));
        });
    });

    describe("fieldValuesAsHTML", () => {
        const path = Util.combinePaths(basePath, "FieldValuesAsHTML");
        it("Should return " + path, () => {
            expect(item.fieldValuesAsHTML.toUrl()).to.match(toMatchEndRegex(path));
        });
    });

    describe("fieldValuesAsText", () => {
        const path = Util.combinePaths(basePath, "FieldValuesAsText");
        it("Should return " + path, () => {
            expect(item.fieldValuesAsText.toUrl()).to.match(toMatchEndRegex(path));
        });
    });

    describe("fieldValuesForEdit", () => {
        const path = Util.combinePaths(basePath, "FieldValuesForEdit");
        it("Should return " + path, () => {
            expect(item.fieldValuesForEdit.toUrl()).to.match(toMatchEndRegex(path));
        });
    });

    describe("folder", () => {
        const path = Util.combinePaths(basePath, "folder");
        it("Should return " + path, () => {
            expect(item.folder.toUrl()).to.match(toMatchEndRegex(path));
        });
    });
});
