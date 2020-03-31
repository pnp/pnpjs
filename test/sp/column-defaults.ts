import { expect } from "chai";
import { testSettings } from "../main";
import "@pnp/sp/folders";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/sharing";
import "@pnp/sp/site-users/web";
import "@pnp/sp/files";
import { Web, IWeb } from "@pnp/sp/webs";
import { getRandomString } from "@pnp/common";
import { IList } from "@pnp/sp/lists";
import "@pnp/sp/fields/list";
import "@pnp/sp/column-defaults";

describe("DefaultColumnValues", function () {

    if (testSettings.enableWebTests) {

        const listName = "DefaultColumnValuesTests";
        let web: IWeb = null;
        let list: IList = null;

        before(async function () {
            web = Web(testSettings.sp.webUrl);
            const ler = await web.lists.ensure(listName, "", 101);
            list = ler.list;

            if (ler.created) {
                const batch = web.createBatch();
                list.fields.inBatch(batch).addText("TextField");
                list.fields.inBatch(batch).addNumber("NumberField");
                list.fields.inBatch(batch).addMultiChoice("MultiChoiceField", ["Item 1", "Item 2", "Item 3"]);
                await batch.execute();
            }
        });

        it("set root folder default values", async function () {

            await list.rootFolder.setDefaultColumnValues([{
                name: "TextField",
                value: "Text Default",
            }, {
                name: "NumberField",
                value: 1,
            }, {
                name: "MultiChoiceField",
                value: ["Item 1", "Item 3"],
            }]);

            const defaults = await list.rootFolder.getDefaultColumnValues();
            expect(defaults.length).to.eq(3);
            defaults.forEach(f => {

                switch (f.name) {
                    case "TextField":
                        expect(f).property("value", "Text Default", "TextField should match");
                        break;
                    case "NumberField":
                        expect(f).property("value", "1", "NumberField should match");
                        break;
                    case "MultiChoiceField":
                        expect(f).property("value", "Item 1;Item 3", "MultiChoiceField should match");
                        break;
                }
            });
        });

        it("set sub folder default values", async function () {

            const far = await list.rootFolder.folders.add(`fld_${getRandomString(4)}`);

            await far.folder.setDefaultColumnValues([{
                name: "TextField",
                value: "#PnPjs",
            }, {
                name: "NumberField",
                value: 14,
            }, {
                name: "MultiChoiceField",
                value: ["Item 1", "Item 2"],
            }]);

            const defaults = await far.folder.getDefaultColumnValues();

            expect(defaults.length).to.eq(3);

            defaults.forEach(f => {

                switch (f.name) {
                    case "TextField":
                        expect(f).property("value", "#PnPjs", "TextField should match");
                        break;
                    case "NumberField":
                        expect(f).property("value", "14", "NumberField should match");
                        break;
                    case "MultiChoiceField":
                        expect(f).property("value", "Item 1;Item 2", "MultiChoiceField should match");
                        break;
                }
            });
        });

        it("set list values", async function () {

            const subFolderName = `fld_${getRandomString(4)}`;
            await list.rootFolder.folders.add(subFolderName);

            list.setDefaultColumnValues([{
                name: "TextField",
                path: `/sites/dev/${listName}`,
                value: "#PnPjs Rocks!",
            }, {
                name: "NumberField",
                path: `/sites/dev/${listName}`,
                value: 42,
            }, {
                name: "MultiChoiceField",
                path: `/sites/dev/${listName}`,
                value: ["Item 1", "Item 2"],
            }, {
                name: "TextField",
                path: `/sites/dev/${listName}/${subFolderName}`,
                value: "#PnPjs Rocks in subfolders too!",
            }, {
                name: "MultiChoiceField",
                path: `/sites/dev/${listName}/${subFolderName}`,
                value: ["Item 1"],
            }]);

            const defaults = await list.getDefaultColumnValues();

            defaults.forEach(f => {

                if (f.path === `/sites/dev/${listName}`) {
                    switch (f.name) {
                        case "TextField":
                            expect(f).property("value", "#PnPjs Rocks!", "TextField should match");
                            break;
                        case "NumberField":
                            expect(f).property("value", "42", "NumberField should match");
                            break;
                        case "MultiChoiceField":
                            expect(f).property("value", "Item 1;Item 2", "MultiChoiceField should match");
                            break;
                    }
                } else if (f.path === `/sites/dev/${listName}/${subFolderName}`) {
                    switch (f.name) {
                        case "TextField":
                            expect(f).property("value", "#PnPjs Rocks in subfolders too!", "TextField should match");
                            break;
                        case "MultiChoiceField":
                            expect(f).property("value", "Item 1", "MultiChoiceField should match");
                            break;
                    }
                }
            });
        });

        it("clear all defaults", async function () {

            const subFolderName = `fld_${getRandomString(4)}`;
            await list.rootFolder.folders.add(subFolderName);

            list.setDefaultColumnValues([{
                name: "TextField",
                path: `/sites/dev/${listName}`,
                value: "#PnPjs Rocks!",
            }, {
                name: "NumberField",
                path: `/sites/dev/${listName}`,
                value: 42,
            }, {
                name: "MultiChoiceField",
                path: `/sites/dev/${listName}`,
                value: ["Item 1", "Item 2"],
            }, {
                name: "TextField",
                path: `/sites/dev/${listName}/${subFolderName}`,
                value: "#PnPjs Rocks in subfolders too!",
            }, {
                name: "MultiChoiceField",
                path: `/sites/dev/${listName}/${subFolderName}`,
                value: ["Item 1"],
            }]);

            const defaults = await list.getDefaultColumnValues();

            expect(defaults.length).to.be.gt(0);

            await list.setDefaultColumnValues([]);

            const defaults2 = await list.getDefaultColumnValues();

            expect(defaults2.length).to.eq(0);
        });

        it("clear folder defaults", async function () {

            const subFolderName = `fld_${getRandomString(4)}`;
            const far = await list.rootFolder.folders.add(subFolderName);

            await far.folder.setDefaultColumnValues([{
                name: "TextField",
                value: "#PnPjs Rocks!",
            }, {
                name: "NumberField",
                value: 42,
            }, {
                name: "MultiChoiceField",
                value: ["Item 1", "Item 2"],
            }]);

            const defaults = await far.folder.getDefaultColumnValues();

            expect(defaults.length).to.be.eq(3);

            await far.folder.clearDefaultColumnValues();

            const defaults2 = await far.folder.getDefaultColumnValues();

            expect(defaults2.length).to.eq(0);
        });
    }
});
