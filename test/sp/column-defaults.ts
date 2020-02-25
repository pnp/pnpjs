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

describe("DefaultColumnValues", function () {

    if (testSettings.enableWebTests) {

        let web: IWeb = null;
        let list: IList = null;

        before(async function () {
            web = Web(testSettings.sp.webUrl);
            const ler = await web.lists.ensure("DefaultColumnValuesTests", "", 101);
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

            const defaults = await list.getDefaultColumnValues();
            expect(defaults).to.have.length(3);
            defaults.forEach(f => {

                switch (f.name) {
                    case "TextField":
                        expect(f).property("defaultValue", "Text Default", "TextField should match");
                        break;
                    case "NumberField":
                        expect(f).property("defaultValue", "1", "NumberField should match");
                        break;
                    case "MultiChoiceField":
                        expect(f).property("defaultValue", "Item 1;Item 3", "MultiChoiceField should match");
                        break;
                }
            });
        });

        it("set sub folder default values", async function () {

            const subFolderName = `fld_${getRandomString(4)}`;
            const far = await list.rootFolder.folders.add(subFolderName);

            await far.folder.setDefaultColumnValues([{
                name: "TextField",
                value: "#PnPjs 🐇",
            }, {
                name: "NumberField",
                value: 14,
            }, {
                name: "MultiChoiceField",
                value: ["Item 1", "Item 2"],
            }]);

            const defaults = await far.folder.getDefaultColumnValues();
            expect(defaults).to.have.length(3);
            defaults.forEach(f => {

                switch (f.name) {
                    case "TextField":
                        expect(f).property("defaultValue", "#PnPjs 🐇", "TextField should match");
                        break;
                    case "NumberField":
                        expect(f).property("defaultValue", "14", "NumberField should match");
                        break;
                    case "MultiChoiceField":
                        expect(f).property("defaultValue", "Item 1;Item 2", "MultiChoiceField should match");
                        break;
                }
            });
        });
    }
});
