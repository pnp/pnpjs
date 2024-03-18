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
import { pnpTest } from "../pnp-test.js";

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

    before(pnpTest("7fa03413-981c-4d51-be83-8b1b9155985a", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const props = await this.props({
            templateName: getRandomString(5) + "Columns",
        });

        site = await getTestingGraphSPSite(this);
        const ctName = "PnPTestContentType";
        const currentCT = await site.contentTypes();
        const exists = currentCT.filter(ct => ct.name === ctName);
        if (exists.length < 1) {

            const ctTemplate = JSON.parse(JSON.stringify({
                name: ctName,
                description: "PnPTestContentType Description",
                base: {
                    name: "Item",
                    id: "0x01",
                },
                group: "PnPTest Content Types",
                id: "0x0100CDB27E23CEF44850904C80BD666FA645",
            }));

            ctTemplate.name += props.templateName;

            const addCT = await site.contentTypes.add(ctTemplate);
            contentType = addCT.contentType;
        } else {
            contentType = site.contentTypes.getById(exists[0].id);
        }

        const addList = await site.lists.add({
            displayName: `PnPGraphTestColumns_${getRandomString(5)}`,
            list: { "template": "genericList" },
        });

        list = addList.list;
    }));

    after(async function () {
        if (list != null) {
            list.delete();
        }
        if (contentType != null) {
            contentType.delete();
        }
    });

    describe("Site", function () {

        it("columns", pnpTest("052a70b6-953b-4267-800d-900b0bf1539d", async function () {
            const columns = await site.columns();
            expect(columns).to.be.an("array");
            if (columns.length > 0) {
                expect(columns[0]).to.haveOwnProperty("id");
            }
        }));

        it("getById()", pnpTest("e2ebde42-c5a9-4301-9fdc-92dd711d5414", async function () {
            let passed = true;
            const columns = await site.columns();
            if (columns.length > 0) {
                const column = await site.columns.getById(columns[0].id)();
                passed = (column.id === columns[0].id);
            }
            return expect(passed).is.true;
        }));

        it("add", pnpTest("7880c343-29a8-4c44-9fb3-4b39f4309c36", async function () {

            const props = await this.props({
                displayName: getRandomString(5) + "Add",
            });

            const columnTemplate = JSON.parse(JSON.stringify(sampleColumn));
            columnTemplate.name += "Add";
            columnTemplate.displayName += props.displayName;
            const c = await site.columns.add(columnTemplate);
            await site.columns.getById(c.data.id).delete();
            return expect((c.data.name === columnTemplate.name)).to.be.true;
        }));

        it("update", pnpTest("8ce610b0-3139-4e2b-9d90-47ad43247250", async function () {

            const props = await this.props({
                name: getRandomString(5) + "Update",
                displayName: getRandomString(5) + "Update",
            });

            const columnTemplate = JSON.parse(JSON.stringify(sampleColumn));
            columnTemplate.name += props.name;
            columnTemplate.displayName += props.displayName;
            const newColumnName = `${columnTemplate.displayName}-CHANGED`;
            const c = await site.columns.add(columnTemplate);
            await site.columns.getById(c.data.id).update({ displayName: newColumnName });
            const updateColumn = await site.columns.getById(c.data.id)();
            await site.columns.getById(c.data.id).delete();
            return expect((updateColumn.displayName === newColumnName)).to.be.true;
        }));

        it("delete", pnpTest("bcb9bafc-4d9c-40d3-a335-b6ff9650e25c", async function () {

            const props = await this.props({
                name: getRandomString(5) + "Update",
                displayName: getRandomString(5) + "Update",
            });

            const columnTemplate = JSON.parse(JSON.stringify(sampleColumn));
            columnTemplate.name += props.name;
            columnTemplate.displayName += props.displayName;
            const c = await site.columns.add(columnTemplate);
            await site.columns.getById(c.data.id).delete();
            let deletedColumn: ColumnDefinition = null;
            try {
                deletedColumn = await site.columns.getById(c.data.id)();
            } catch (err) {
                // do nothing
            }
            return expect(deletedColumn).to.be.null;
        }));
    });
    describe("Content-Type", function () {
        let siteColumn;
        let columnTemplateName;

        before(pnpTest("7b7c0559-06c7-4c7d-881e-bfc33d47c31a", async function () {

            if (!this.pnp.settings.enableWebTests) {
                this.skip();
            }

            const props = await this.props({
                columnTemplateName: sampleColumn.name + getRandomString(5) + "SiteColumn",
            });

            columnTemplateName = props.columnTemplateName;

            const columnTemplate = JSON.parse(JSON.stringify(sampleColumn));
            columnTemplate.name = columnTemplateName;
            columnTemplate.displayName = columnTemplateName;
            const addSiteCT = await site.columns.add(columnTemplate);
            siteColumn = addSiteCT.column;
        }));

        after(async function () {
            if (siteColumn != null) {
                siteColumn.delete();
            }
        });

        it("columns", pnpTest("0312da75-4067-4d63-bb2c-e5f0d35f4b53", async function () {
            const columns = await contentType.columns();
            return expect(columns).to.be.an("array") && expect(columns[0]).to.haveOwnProperty("id");
        }));

        it("getById()", pnpTest("d518e3f7-566d-4404-8e97-6cea48d5b1d1", async function () {
            let passed = true;
            const columns = await contentType.columns();
            if (columns.length > 0) {
                const column = await contentType.columns.getById(columns[0].id)();
                passed = (column.id === columns[0].id);
            }
            return expect(passed).is.true;
        }));

        it("addRef", pnpTest("9dd8c09e-9e07-42e2-ac2d-5685966d2aa0", async function () {
            const c = await contentType.columns.addRef(siteColumn);
            await contentType.columns.getById(c.data.id).delete();
            return expect((c.data.name === columnTemplateName)).to.be.true;
        }));

        // Site column properties cannot be updated in content type.
        it.skip("update", pnpTest("c3afb14e-3f42-48e8-9ea6-43be8d231762", async function () {
            const c = await contentType.columns.addRef(siteColumn);
            const updateColumnResults = await contentType.columns.getById(c.data.id).update({ propagateChanges: true });
            await contentType.columns.getById(c.data.id).delete();
            return expect((updateColumnResults.propagateChanges)).to.be.true;
        }));

        it("delete", pnpTest("4d6e18c1-abe7-4cd4-a90e-1c1715d5e1ce", async function () {
            const c = await contentType.columns.addRef(siteColumn);
            await contentType.columns.getById(c.data.id).delete();
            let deletedColumn: ColumnDefinition = null;
            try {
                deletedColumn = await contentType.columns.getById(c.data.id)();
            } catch (err) {
                // do nothing
            }
            return expect(deletedColumn).to.be.null;
        }));
    });

    describe("List", function () {
        it("columns", pnpTest("2b7ff4ba-7b59-49ad-9d98-cda8bec9a012", async function () {
            const columns = await list.columns();
            return expect(columns).to.be.an("array") && expect(columns[0]).to.haveOwnProperty("id");
        }));

        it("getById()", pnpTest("1560f120-d7da-491a-b27b-48c7b7d124ca", async function () {
            let passed = true;
            const columns = await list.columns();
            if (columns.length > 0) {
                const column = await list.columns.getById(columns[0].id)();
                passed = (column.id === columns[0].id);
            }
            return expect(passed).is.true;
        }));

        it("add", pnpTest("387b5fb8-14b7-4c9a-8719-f62bc2289780", async function () {

            const props = await this.props({
                displayName: getRandomString(5) + "Add",
            });

            const columnTemplate = JSON.parse(JSON.stringify(sampleColumn));
            columnTemplate.name += "Add";
            columnTemplate.displayName += props.displayName;
            const c = await list.columns.add(columnTemplate);
            await list.columns.getById(c.data.id).delete();
            return expect((c.data.name === columnTemplate.name)).to.be.true;
        }));

        it("update", pnpTest("3827a66a-2f8b-4cd7-addb-b49eac258f45", async function () {

            const props = await this.props({
                name: getRandomString(5) + "Update",
                displayName: getRandomString(5) + "Update",
            });

            const columnTemplate = JSON.parse(JSON.stringify(sampleColumn));
            columnTemplate.name += props.name;
            columnTemplate.displayName += props.displayName;
            const newColumnName = `${columnTemplate.displayName}-CHANGED`;
            const c = await list.columns.add(columnTemplate);
            await list.columns.getById(c.data.id).update({ displayName: newColumnName });
            const updateColumn = await list.columns.getById(c.data.id)();
            await list.columns.getById(c.data.id).delete();
            return expect((updateColumn.displayName === newColumnName)).to.be.true;
        }));

        it("delete", pnpTest("16650b92-045a-4bfe-8f37-a8a8856385f2", async function () {

            const props = await this.props({
                name: getRandomString(5) + "Delete",
                displayName: getRandomString(5) + "Delete",
            });

            const columnTemplate = JSON.parse(JSON.stringify(sampleColumn));
            columnTemplate.name += props.name;
            columnTemplate.displayName += props.displayName;
            const c = await list.columns.add(columnTemplate);
            await list.columns.getById(c.data.id).delete();
            let deletedColumn: ColumnDefinition = null;
            try {
                deletedColumn = await list.columns.getById(c.data.id)();
            } catch (err) {
                // do nothing
            }
            return expect(deletedColumn).to.be.null;
        }));
    });
});
