import { expect } from "chai";
import { ContentType } from "@microsoft/microsoft-graph-types";
import "@pnp/graph/sites";
import "@pnp/graph/lists";
import "@pnp/graph/content-types";
import { IList } from "@pnp/graph/lists";
import { ISite } from "@pnp/graph/sites";
import { getRandomString } from "@pnp/core";
import getTestingGraphSPSite from "./utilities/getTestingGraphSPSite.js";

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

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        site = await getTestingGraphSPSite(this);

        const listTmp = await site.lists.add({
            displayName: `PnPGraphTestContentTypes_${getRandomString(8)}`,
            list: { "template": "genericList" },
        });

        list = site.lists.getById(listTmp.data.id);
    });

    after(async function () {
        if (list != null) {
            list.delete();
        }
    });

    describe("Site", function () {

        it("content types", async function () {
            const ct = await site.contentTypes();
            return expect(ct).to.be.an("array") && expect(ct[0]).to.haveOwnProperty("id");
        });

        it("getById", async function () {
            let passed = true;
            const cts = await site.contentTypes();
            if (cts.length > 0) {
                const ct = await site.contentTypes.getById(cts[0].id)();
                passed = (ct.id === cts[0].id);
            }
            return expect(passed).is.true;
        });

        it("getCompatibleFromHub", async function () {
            const cts = await site.contentTypes.getCompatibleHubContentTypes();
            return expect(cts).to.be.an("array");
        });

        it("add", async function () {
            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += getRandomString(5) + "Add";
            const ct = await site.contentTypes.add(ctTemplate);
            await site.contentTypes.getById(ct.data.id).delete();
            return expect((ct.data.name === ctTemplate.name)).to.be.true;
        });

        // potential long running function - not approrpriate for automated tests
        it.skip("addFromHub");

        // requires content type hub and hub sites to test.
        it.skip("associateWithHub");

        // Errors with ~ Metadata hub feature is disabled on this site.
        it.skip("isPublished", async function () {
            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += getRandomString(5) + "SiteIsPublished";
            const ct = await site.contentTypes.add(ctTemplate);
            const isPublished = await ct.contentType.isPublished();
            await site.contentTypes.getById(ct.data.id).delete();
            return expect(isPublished).to.be.false;
        });

        // Errors with ~ Metadata hub feature is disabled on this site.
        it.skip("publish", async function () {
            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += getRandomString(5) + "SitePublish";
            const ct = await site.contentTypes.add(ctTemplate);
            await ct.contentType.publish();
            const isPublished = await ct.contentType.isPublished();
            await site.contentTypes.getById(ct.data.id).delete();
            return expect(isPublished).to.be.true;
        });

        // Errors with ~ Metadata hub feature is disabled on this site.
        it.skip("unpublish", async function () {
            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += getRandomString(5) + "SiteUnPublish";
            const ct = await site.contentTypes.add(ctTemplate);
            await ct.contentType.publish();
            await ct.contentType.unpublish();
            const isPublished = await ct.contentType.isPublished();
            await site.contentTypes.getById(ct.data.id).delete();
            return expect(isPublished).to.be.false;
        });

        it("update", async function () {
            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += getRandomString(5) + "SiteUpdate";
            const newContentTypeName = `${ctTemplate.name}-CHANGED`;
            const ct = await site.contentTypes.add(ctTemplate);
            await site.contentTypes.getById(ct.data.id).update({ name: newContentTypeName });
            const updateContentType = await site.contentTypes.getById(ct.data.id)();
            await site.contentTypes.getById(ct.data.id).delete();
            return expect((updateContentType.name === newContentTypeName)).to.be.true;
        });

        it("delete", async function () {
            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += getRandomString(5) + "SiteDelete";
            const ct = await site.contentTypes.add(ctTemplate);
            await site.contentTypes.getById(ct.data.id).delete();
            let deletedContentType: ContentType = null;
            try {
                deletedContentType = await site.contentTypes.getById(ct.data.id)();
            } catch (err) {
                // do nothing
            }
            return expect(deletedContentType).to.be.null;
        });
    });

    describe("List", function () {
        it("content types", async function () {
            const ct = await list.contentTypes();
            return expect(ct).to.be.an("array") && expect(ct[0]).to.haveOwnProperty("id");
        });

        it("getById()", async function () {
            let passed = true;
            const cts = await list.contentTypes();
            if (cts.length > 0) {
                const ct = await list.contentTypes.getById(cts[0].id)();
                passed = (ct.id === cts[0].id);
            }
            return expect(passed).is.true;
        });

        it("getCompatibleFromHub", async function () {
            const cts = await list.contentTypes.getCompatibleHubContentTypes();
            return expect(cts).to.be.an("array");
        });

        // potential long running function - not approrpriate for automated tests
        it.skip("addFromHub");

        it("addCopy", async function () {
            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += getRandomString(5) + "ListAddCopy";
            const siteCT = await site.contentTypes.add(ctTemplate);
            const listCT = await list.contentTypes.addCopy(siteCT.contentType);
            await list.contentTypes.getById(listCT.data.id).delete();
            await site.contentTypes.getById(siteCT.data.id).delete();
            return expect((siteCT.data.name === listCT.data.name)).to.be.true;
        });

        it("update", async function () {
            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += getRandomString(5) + "ListUpdate";
            const newContentTypeName = `${ctTemplate.displayName}-CHANGED`;
            const siteCT = await site.contentTypes.add(ctTemplate);
            const listCT = await list.contentTypes.addCopy(siteCT.contentType);
            await listCT.contentType.update({ name: newContentTypeName });
            const updateContentType = await list.contentTypes.getById(listCT.data.id)();
            await list.contentTypes.getById(listCT.data.id).delete();
            await site.contentTypes.getById(siteCT.data.id).delete();
            return expect((updateContentType.name === newContentTypeName)).to.be.true;
        });

        it("delete", async function () {
            const ctTemplate = JSON.parse(JSON.stringify(sampleContentType));
            ctTemplate.name += getRandomString(5) + "ListDelete";
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
        });
    });
});
