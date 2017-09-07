import { expect } from "chai";
import { ContentTypes, ContentType } from "../../src/sharepoint/contenttypes";
import pnp from "../../src/pnp";
import { testSettings } from "../test-config.test";
import { toMatchEndRegex } from "../testutils";

/* tslint:disable max-line-length */

describe("ContentTypes", () => {
    it("Should be an object", () => {
        let contenttypes = new ContentTypes("_api/web/lists/getByTitle('Tasks')");
        expect(contenttypes).to.be.a("object");
    });
    describe("url", () => {
        it("Should return _api/web/lists/getByTitle('Tasks')/contenttypes", () => {
            let contenttypes = new ContentTypes("_api/web/lists/getByTitle('Tasks')");
            expect(contenttypes.toUrl()).to.match(toMatchEndRegex("_api/web/lists/getByTitle('Tasks')/contenttypes"));
        });
    });
    describe("getById", () => {
        it("Should return _api/web/lists/getByTitle('Tasks')/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')", () => {
            let contenttypes = new ContentTypes("_api/web/lists/getByTitle('Tasks')");
            let ct = contenttypes.getById("0x0101000BB1B729DCB7414A9344ED650D3C05B3").toUrl();
            expect(ct).to.match(toMatchEndRegex("_api/web/lists/getByTitle('Tasks')/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')"));
        });
    });

    if (testSettings.enableWebTests) {

        describe("getById", () => {
            it("Should return the item content type", () => {
                return expect(pnp.sp.web.contentTypes.getById("0x01").get()).to.eventually.be.fulfilled;
            });
        });
    }
});

describe("ContentType", () => {
    let contentType: ContentType;

    beforeEach(() => {
        contentType = new ContentType("_api/web", "contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')");
    });

    it("Should be an object", () => {
        expect(contentType).to.be.an("object");
    });

    describe("fieldLinks", () => {
        it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/fieldLinks", () => {
            expect(contentType.fieldLinks.toUrl()).to.match(toMatchEndRegex("_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/fieldlinks"));
        });
    });

    describe("fields", () => {
        it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/fields", () => {
            expect(contentType.fields.toUrl()).to.match(toMatchEndRegex("_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/fields"));
        });
    });

    describe("parent", () => {
        it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/parent", () => {
            expect(contentType.parent.toUrl()).to.match(toMatchEndRegex("_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/parent"));
        });
    });

    describe("workflowAssociations", () => {
        it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/workflowAssociations", () => {
            expect(contentType.workflowAssociations.toUrl()).to.match(toMatchEndRegex("_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/workflowAssociations"));
        });
    });
});
