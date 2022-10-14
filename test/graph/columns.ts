import { expect } from "chai";
import { ColumnDefinition } from "@microsoft/microsoft-graph-types";
import "@pnp/graph/sites";
import "@pnp/graph/lists";
import "@pnp/graph/columns";
import "@pnp/graph/content-types";
import { IList } from "@pnp/graph/lists";
import { ISite } from "@pnp/graph/sites";
import { IContentType } from "@pnp/graph/content-types";
import { getRandomString } from "@pnp/core";
import getTestingGraphSPSite from "./utilities/getTestingGraphSPSite.js";

describe("Columns", function () {

    let site: ISite;
    let list: IList;
    let contentType: IContentType;

    const sampleColumn: ColumnDefinition = {
        description: "PnPTestColumn Description",
        enforceUniqueValues: false,
        hidden: false,
        indexed: false,
        name: "PnPTestColumn",
        displayName: "PnPTestColumn",
        text: {
            allowMultipleLines: false,
            appendChangesToExistingText: false,
            linesForEditing: 0,
            maxLength: 255,
        },
    };

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        site = await getTestingGraphSPSite(this);

        const ctTemplate = JSON.parse(JSON.stringify({
            name: "PnPTestContentType",
            description: "PnPTestContentType Description",
            base: {
                name: "Item",
                id: "0x01",
            },
            group: "PnPTest Content Types",
            id: "0x0100CDB27E23CEF44850904C80BD666FA645",
        }));

        ctTemplate.name += getRandomString(5) + "Columns";

        const addCT = await site.contentTypes.add(ctTemplate);
        contentType = addCT.contentType;

        const addList = await site.lists.add({
            displayName: "PnPGraphTestColumns",
            list: { "template": "genericList" },
        });

        list = addList.list;
    });

    after(async function () {
        if (list != null) {
            list.delete();
        }
        if (contentType != null) {
            contentType.delete();
        }
    });

    describe("Site", function () {
        it("columns", async function () {
            const columns = await site.columns();
            expect(columns).to.be.an("array");
            if (columns.length > 0) {
                expect(columns[0]).to.haveOwnProperty("id");
            }
        });

        it("getById()", async function () {
            let passed = true;
            const columns = await site.columns();
            if (columns.length > 0) {
                const column = await site.columns.getById(columns[0].id)();
                passed = (column.id === columns[0].id);
            }
            return expect(passed).is.true;
        });

        it("add", async function () {
            const columnTemplate = JSON.parse(JSON.stringify(sampleColumn));
            columnTemplate.name += "Add";
            columnTemplate.displayName += getRandomString(5) + "Add";
            const c = await site.columns.add(columnTemplate);
            await site.columns.getById(c.data.id).delete();
            return expect((c.data.name === columnTemplate.name)).to.be.true;
        });

        it("update", async function () {
            const columnTemplate = JSON.parse(JSON.stringify(sampleColumn));
            columnTemplate.name += getRandomString(5) + "Update";
            columnTemplate.displayName += getRandomString(5) + "Update";
            const newColumnName = `${columnTemplate.displayName}-CHANGED`;
            const c = await site.columns.add(columnTemplate);
            await site.columns.getById(c.data.id).update({ displayName: newColumnName });
            const updateColumn = await site.columns.getById(c.data.id)();
            await site.columns.getById(c.data.id).delete();
            return expect((updateColumn.displayName === newColumnName)).to.be.true;
        });

        it("delete", async function () {
            const columnTemplate = JSON.parse(JSON.stringify(sampleColumn));
            columnTemplate.name += getRandomString(5) + "Delete";
            columnTemplate.displayName += getRandomString(5) + "Delete";
            const c = await site.columns.add(columnTemplate);
            await site.columns.getById(c.data.id).delete();
            let deletedColumn: ColumnDefinition = null;
            try {
                deletedColumn = await site.columns.getById(c.data.id)();
            } catch (err) {
                // do nothing
            }
            return expect(deletedColumn).to.be.null;
        });
    });
    describe("Content-Type", function () {
        let siteColumn;
        const columnTemplateName = sampleColumn.name + getRandomString(5) + "SiteColumn";

        before(async function () {

            if (!this.pnp.settings.enableWebTests) {
                this.skip();
            }

            const columnTemplate = JSON.parse(JSON.stringify(sampleColumn));
            columnTemplate.name = columnTemplateName;
            columnTemplate.displayName = columnTemplateName;
            const addSiteCT = await site.columns.add(columnTemplate);
            siteColumn = addSiteCT.column;
        });

        after(async function () {
            if (siteColumn != null) {
                siteColumn.delete();
            }
        });

        it("columns", async function () {
            const columns = await contentType.columns();
            return expect(columns).to.be.an("array") && expect(columns[0]).to.haveOwnProperty("id");
        });

        it("getById()", async function () {
            let passed = true;
            const columns = await contentType.columns();
            if (columns.length > 0) {
                const column = await contentType.columns.getById(columns[0].id)();
                passed = (column.id === columns[0].id);
            }
            return expect(passed).is.true;
        });

        it("addRef", async function () {
            const c = await contentType.columns.addRef(siteColumn);
            await contentType.columns.getById(c.data.id).delete();
            return expect((c.data.name === columnTemplateName)).to.be.true;
        });

        // Site column properties cannot be updated in content type.
        it.skip("update", async function () {
            const c = await contentType.columns.addRef(siteColumn);
            const updateColumnResults = await contentType.columns.getById(c.data.id).update({ propagateChanges: true });
            await contentType.columns.getById(c.data.id).delete();
            return expect((updateColumnResults.propagateChanges)).to.be.true;
        });

        it("delete", async function () {
            const c = await contentType.columns.addRef(siteColumn);
            await contentType.columns.getById(c.data.id).delete();
            let deletedColumn: ColumnDefinition = null;
            try {
                deletedColumn = await contentType.columns.getById(c.data.id)();
            } catch (err) {
                // do nothing
            }
            return expect(deletedColumn).to.be.null;
        });
    });

    describe("List", function () {
        it("columns", async function () {
            const columns = await list.columns();
            return expect(columns).to.be.an("array") && expect(columns[0]).to.haveOwnProperty("id");
        });

        it("getById()", async function () {
            let passed = true;
            const columns = await list.columns();
            if (columns.length > 0) {
                const column = await list.columns.getById(columns[0].id)();
                passed = (column.id === columns[0].id);
            }
            return expect(passed).is.true;
        });

        it("add", async function () {
            const columnTemplate = JSON.parse(JSON.stringify(sampleColumn));
            columnTemplate.name += "Add";
            columnTemplate.displayName += getRandomString(5) + "Add";
            const c = await list.columns.add(columnTemplate);
            await list.columns.getById(c.data.id).delete();
            return expect((c.data.name === columnTemplate.name)).to.be.true;
        });

        it("update", async function () {
            const columnTemplate = JSON.parse(JSON.stringify(sampleColumn));
            columnTemplate.name += getRandomString(5) + "Update";
            columnTemplate.displayName += getRandomString(5) + "Update";
            const newColumnName = `${columnTemplate.displayName}-CHANGED`;
            const c = await list.columns.add(columnTemplate);
            await list.columns.getById(c.data.id).update({ displayName: newColumnName });
            const updateColumn = await list.columns.getById(c.data.id)();
            await list.columns.getById(c.data.id).delete();
            return expect((updateColumn.displayName === newColumnName)).to.be.true;
        });

        it("delete", async function () {
            const columnTemplate = JSON.parse(JSON.stringify(sampleColumn));
            columnTemplate.name += getRandomString(5) + "Delete";
            columnTemplate.displayName += getRandomString(5) + "Delete";
            const c = await list.columns.add(columnTemplate);
            await list.columns.getById(c.data.id).delete();
            let deletedColumn: ColumnDefinition = null;
            try {
                deletedColumn = await list.columns.getById(c.data.id)();
            } catch (err) {
                // do nothing
            }
            return expect(deletedColumn).to.be.null;
        });
    });
});
