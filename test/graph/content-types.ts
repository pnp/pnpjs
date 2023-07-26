import { expect } from "chai";
import { ContentType } from "@microsoft/microsoft-graph-types";
import "@pnp/graph/sites";
import "@pnp/graph/lists";
import "@pnp/graph/content-types";
import { IList } from "@pnp/graph/lists";
import { ISite } from "@pnp/graph/sites";
import { getRandomString } from "@pnp/core";
import getTestingGraphSPSite from "./utilities/getTestingGraphSPSite.js";
import { pnpTest } from "../pnp-test.js";

describe("ContentTypes", function () {
    let site: ISite;
    let list: IList;

    const sampleContentType: ContentType = {
        name: "PnPTestContentType",
        description: "PnPTestContentType Description",
        base: {
            name: "Item",
            id: "0x01",
        },
        group: "PnPTest Content Types",
        id: "0x0100CDB27E23CEF44850904C80BD666FA645",
    };

    before(pnpTest("558cdcaf-dfe4-47e1-a310-7b1c4c9e5d1d", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const props = await this.props({
            displayName: `PnPGraphTestContentTypes_${getRandomString(8)}`,
        });

        site = await getTestingGraphSPSite(this);

        const listTmp = await site.lists.add({
            displayName: props.displayName,
            list: { "template": "genericList" },
        });

        list = site.lists.getById(listTmp.data.id);
    }));

    after(async function () {
        if (list != null) {
            list.delete();
        }
    });

    describe("Site", function () {

        it("content types", pnpTest("adc47d1e-6b59-4287-a7f6-1fa42a0862e2", async function () {
            const ct = await site.contentTypes();
            return expect(ct).to.be.an("array") && expect(ct[0]).to.haveOwnProperty("id");
        }));

        it("getById", pnpTest("ab0e1dc6-6387-404f-8acc-b8025d5aa049", async function () {
            let passed = true;
            const cts = await site.contentTypes();
            if (cts.length > 0) {
                const ct = await site.contentTypes.getById(cts[0].id)();
                passed = (ct.id === cts[0].id);
            }
            return expect(passed).is.true;
        }));

        it("getCompatibleFromHub", pnpTest("42b30d81-10bf-490e-aaee-e8a2c67c8006", async function () {
            const cts = await site.contentTypes.getCompatibleHubContentTypes();
            return expect(cts).to.be.an("array");
        }));

        it("add", pnpTest("3e939430-6d79-45e9-92cf-1a296a2e0911", async function () {

            const props = await this.props({
                name: getRandomString(5) + "Add",
            });

            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += props.name;
            const ct = await site.contentTypes.add(ctTemplate);
            await site.contentTypes.getById(ct.data.id).delete();
            return expect((ct.data.name === ctTemplate.name)).to.be.true;
        }));

        // potential long running function - not approrpriate for automated tests
        it.skip("addFromHub");

        // requires content type hub and hub sites to test.
        it.skip("associateWithHub");

        // Errors with ~ Metadata hub feature is disabled on this site.
        it.skip("isPublished", pnpTest("4c3b75f9-d46e-4ae4-a1b7-8ce7bb43009c", async function () {

            const props = await this.props({
                name: getRandomString(5) + "SiteIsPublished",
            });

            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += props.name;
            const ct = await site.contentTypes.add(ctTemplate);
            const isPublished = await ct.contentType.isPublished();
            await site.contentTypes.getById(ct.data.id).delete();
            return expect(isPublished).to.be.false;
        }));

        // Errors with ~ Metadata hub feature is disabled on this site.
        it.skip("publish", pnpTest("664acec7-ff46-4bbf-9352-16d0718767de", async function () {

            const props = await this.props({
                name: getRandomString(5) + "SitePublish",
            });

            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += props.name;
            const ct = await site.contentTypes.add(ctTemplate);
            await ct.contentType.publish();
            const isPublished = await ct.contentType.isPublished();
            await site.contentTypes.getById(ct.data.id).delete();
            return expect(isPublished).to.be.true;
        }));

        // Errors with ~ Metadata hub feature is disabled on this site.
        it.skip("unpublish", pnpTest("28cd50ea-5672-48fc-9fc1-842c9d69688b", async function () {

            const props = await this.props({
                name: getRandomString(5) + "SiteUnPublish",
            });

            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += props.name;
            const ct = await site.contentTypes.add(ctTemplate);
            await ct.contentType.publish();
            await ct.contentType.unpublish();
            const isPublished = await ct.contentType.isPublished();
            await site.contentTypes.getById(ct.data.id).delete();
            return expect(isPublished).to.be.false;
        }));

        it("update", pnpTest("41d3c22d-8632-4890-9ecf-7d0a367d739c", async function () {

            const props = await this.props({
                name: getRandomString(5) + "SiteUpdate",
            });

            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += props.name;
            const newContentTypeName = `${ctTemplate.name}-CHANGED`;
            const ct = await site.contentTypes.add(ctTemplate);
            await site.contentTypes.getById(ct.data.id).update({ name: newContentTypeName });
            const updateContentType = await site.contentTypes.getById(ct.data.id)();
            await site.contentTypes.getById(ct.data.id).delete();
            return expect((updateContentType.name === newContentTypeName)).to.be.true;
        }));

        it("delete", pnpTest("50a499b1-b6b9-47f7-b14e-567c03ac77a2", async function () {

            const props = await this.props({
                name: getRandomString(5) + "SiteDelete",
            });

            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += props.name;
            const ct = await site.contentTypes.add(ctTemplate);
            await site.contentTypes.getById(ct.data.id).delete();
            let deletedContentType: ContentType = null;
            try {
                deletedContentType = await site.contentTypes.getById(ct.data.id)();
            } catch (err) {
                // do nothing
            }
            return expect(deletedContentType).to.be.null;
        }));
    });

    describe("List", function () {

        it("content types", pnpTest("3ee007d0-e331-4842-bc8e-8251726d9d39", async function () {
            const ct = await list.contentTypes();
            return expect(ct).to.be.an("array") && expect(ct[0]).to.haveOwnProperty("id");
        }));

        it("getById()", pnpTest("ab0abf2f-4ffe-4d37-af4b-c8bdb8f2a257", async function () {
            let passed = true;
            const cts = await list.contentTypes();
            if (cts.length > 0) {
                const ct = await list.contentTypes.getById(cts[0].id)();
                passed = (ct.id === cts[0].id);
            }
            return expect(passed).is.true;
        }));

        it("getCompatibleFromHub", pnpTest("c74f5186-5aff-4b18-b5b7-97edcd4bd6c5", async function () {
            const cts = await list.contentTypes.getCompatibleHubContentTypes();
            return expect(cts).to.be.an("array");
        }));

        // potential long running function - not approrpriate for automated tests
        it.skip("addFromHub");

        it("addCopy", pnpTest("ef5ebb3f-f8f1-4b57-a977-c3ad359365ca", async function () {

            const props = await this.props({
                name: getRandomString(5) + "ListAddCopy",
            });

            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += props.name;
            const siteCT = await site.contentTypes.add(ctTemplate);
            const listCT = await list.contentTypes.addCopy(siteCT.contentType);
            await list.contentTypes.getById(listCT.data.id).delete();
            await site.contentTypes.getById(siteCT.data.id).delete();
            return expect((siteCT.data.name === listCT.data.name)).to.be.true;
        }));

        it("update", pnpTest("3add8b28-47ea-45a9-9db3-aa370e088f67", async function () {

            const props = await this.props({
                name: getRandomString(5) + "ListUpdate",
            });

            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += props.name;
            const newContentTypeName = `${ctTemplate.displayName}-CHANGED`;
            const siteCT = await site.contentTypes.add(ctTemplate);
            const listCT = await list.contentTypes.addCopy(siteCT.contentType);
            await listCT.contentType.update({ name: newContentTypeName });
            const updateContentType = await list.contentTypes.getById(listCT.data.id)();
            await list.contentTypes.getById(listCT.data.id).delete();
            await site.contentTypes.getById(siteCT.data.id).delete();
            return expect((updateContentType.name === newContentTypeName)).to.be.true;
        }));

        it("delete", pnpTest("5d8dc8f0-5220-400b-b990-0bcdfcd08594", async function () {

            const props = await this.props({
                name: getRandomString(5) + "ListDelete",
            });

            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += props.name;
            const siteCT = await site.contentTypes.add(ctTemplate);
            const listCT = await list.contentTypes.addCopy(siteCT.contentType);
            await list.contentTypes.getById(listCT.data.id).delete();
            await site.contentTypes.getById(siteCT.data.id).delete();
            let deletedContentType: ContentType = null;
            try {
                deletedContentType = await list.contentTypes.getById(listCT.data.id)();
            } catch (err) {
                // do nothing
            }
            return expect(deletedContentType).to.be.null;
        }));
    });
});
