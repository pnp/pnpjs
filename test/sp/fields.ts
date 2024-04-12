import { expect } from "chai";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import {
    DateTimeFieldFormatType,
    FieldTypes,
    CalendarType,
    DateTimeFieldFriendlyFormatType,
    UrlFieldFormatType,
    FieldUserSelectionMode,
    ChoiceFieldFormatType,
} from "@pnp/sp/fields";
import { getRandomString, getGUID } from "@pnp/core";
import { pnpTest } from "../pnp-test.js";


describe("Fields", function () {

    const testFieldName = "PnPJSTest";
    const titleFieldId = "fa564e0f-0c70-4ab9-b863-0177e6ddd247";
    const testFieldGroup = "PnP Test Group";
    const testFieldDescription = "PnPJS Test Description";
    const listName = "Documents";

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    describe("Web", function () {
        // Web Tests

        it("getById", pnpTest("b5329930-2be1-4026-902a-9d91aa366362", async function () {
            return expect(this.pnp.sp.site.rootWeb.fields.getById(titleFieldId).select("Title")()).to.eventually.be.fulfilled;
        }));

        it("getByTitle", pnpTest("58c24f33-5e86-4b80-b013-d001876dd540", async function () {
            const field = await this.pnp.sp.site.rootWeb.fields.getById(titleFieldId).select("Title")<{ Title: string }>();
            const field2 = await this.pnp.sp.site.rootWeb.fields.getByTitle(field.Title).select("Id")<{ Id: string }>();
            return expect(field2.Id).to.eq(titleFieldId);
        }));

        it("getByInternalNameOrTitle", pnpTest("22316017-8c38-4662-b57c-73c79b1d821f", async function () {
            const field = await this.pnp.sp.site.rootWeb.fields.getByInternalNameOrTitle("Other Address Country/Region").select("Title")<{ Title: string }>();
            return expect(field.Title).to.eq("Other Address Country/Region");
        }));

        it("createFieldAsXml", pnpTest("1ebfde07-317d-4107-bd42-addd4846cc0a", async function () {

            const { name, id } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
                id: getGUID(),
            });

            const testFieldSchema = `<Field ID="{${id}}" Name="${name}" DisplayName="${name}" Type="Currency" Decimals="2" Min="0" Required="FALSE" Group="${testFieldGroup}" />`;

            const field = await this.pnp.sp.web.fields.createFieldAsXml(testFieldSchema);
            return expect(field).to.not.be.null;
        }));

        it("add", pnpTest("80e75ef7-3d5a-4880-9b28-67143ce6d058", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields.add(testFieldNameRand, FieldTypes.Text, { Group: testFieldGroup });
            return expect(field.Title).to.be.equal(testFieldNameRand);
        }));

        it("addText", pnpTest("54ce0598-f27c-4787-9d39-3f31cedaacbd", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields.addText(testFieldNameRand, { Group: testFieldGroup });
            return expect(field.Title).to.be.equal(testFieldNameRand);
        }));

        it("addImageField", pnpTest("76b940f7-2113-4adb-adad-230e119b5450", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields.addImageField(testFieldNameRand, { Group: testFieldGroup});
            return expect(field.Title).to.be.equal(testFieldNameRand);
        }));

        it("addNumber", pnpTest("5f3f2ba5-d467-4ebb-8161-3589c35f62c4", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields.addNumber(testFieldNameRand, { Group: testFieldGroup });
            return expect(field.Title).to.be.equal(testFieldNameRand);
        }));

        it("addCalculated", pnpTest("4dc773f4-6f65-44e9-8ff6-8a03fe4dcb31", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields
                .addCalculated(testFieldNameRand, {
                    Formula: "=Modified+1",
                    DateFormat: DateTimeFieldFormatType.DateOnly,
                    FieldTypeKind: FieldTypes.Calculated,
                    Group: testFieldGroup,
                });

            return expect(field.Title).to.be.equal(name);
        }));

        it("addDateTime", pnpTest("8c6ef065-4ead-40ba-b240-43c4c750ceb2", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.fields
                .addDateTime(name,
                    {
                        DisplayFormat: DateTimeFieldFormatType.DateOnly,
                        DateTimeCalendarType: CalendarType.Gregorian,
                        FriendlyDisplayFormat: DateTimeFieldFriendlyFormatType.Disabled,
                        Group: testFieldGroup,
                    }
                );

            return expect(field.Title).to.be.equal(name);
        }));

        it("addCurrency", pnpTest("673c2821-b07d-4c52-ae70-e5afe2a786bb", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.fields.addCurrency(name, { MinimumValue: 0, MaximumValue: 100, CurrencyLocaleId: 1033, Group: testFieldGroup });
            return expect(field.Title).to.be.equal(name);
        }));

        it("addMultilineText", pnpTest("a6e8d8be-4db2-4e2a-a65b-0af3cfe6ff0e", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.fields
                .addMultilineText(name, {
                    NumberOfLines: 6,
                    RichText: true,
                    RestrictedMode: false,
                    AppendOnly: false,
                    AllowHyperlink: true,
                    Group: testFieldGroup,
                });

            return expect(field.Title).to.be.equal(name);
        }));

        it("addUrl", pnpTest("c0754452-3817-415c-96d4-89e47d5cb7c2", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.fields.addUrl(name, { DisplayFormat: UrlFieldFormatType.Hyperlink, Group: testFieldGroup });

            return expect(field.Title).to.be.equal(name);
        }));

        it("addUser", pnpTest("93b6e6b4-d9b2-464f-8846-9c0353b9515f", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.fields.addUser(name, { SelectionMode: FieldUserSelectionMode.PeopleOnly, Group: testFieldGroup });

            return expect(field.Title).to.be.equal(name);
        }));

        it("addLookup", pnpTest("578da2cd-0a42-42a0-84e7-0e0de0315610", async function () {

            const { name, lookupListName } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
                lookupListName: `LookupList_${getRandomString(10)}`,
            });

            const list = await this.pnp.sp.web.lists.add(lookupListName, testFieldDescription, 100, false);

            const field = await this.pnp.sp.web.fields.addLookup(name, { LookupListId: list.Id, LookupFieldName: "Title" });
            await this.pnp.sp.web.fields.getById(field.Id).update({
                Group: testFieldGroup,
            });

            return expect(field.Title).to.be.equal(name);
        }));

        it("addChoice", pnpTest("deff0f4a-5a4d-4607-b882-cb9c1b972d47", async function () {

            const { choices, name } = await this.props({
                choices: [`Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`],
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.fields.addChoice(name, {
                Choices: choices,
                EditFormat: ChoiceFieldFormatType.Dropdown,
                FillInChoice: false,
                Group: testFieldGroup,
            });

            return expect(field.Title).to.be.equal(name);
        }));

        it("addMultiChoice", pnpTest("011f8908-35b1-4a41-84d6-fbf5ce8d892a", async function () {

            const { choices, name } = await this.props({
                choices: [`Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`],
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.fields.addMultiChoice(name, { Choices: choices, FillInChoice: false, Group: testFieldGroup });
            return expect(field.Title).to.be.equal(name);
        }));

        it("addBoolean", pnpTest("b5d13907-d9dc-48c5-a3d4-cfcfbfed9c99", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.fields.addBoolean(name, { Group: testFieldGroup });
            return expect(field.Title).to.be.equal(name);
        }));

        it("addDependentLookupField", pnpTest("16a58810-c90c-4eb3-af0b-60a34d9f5a36", async function () {

            const { primary, secondary, lookupListName } = await this.props({
                primary: `primary_${getRandomString(10)}`,
                secondary: `secondary_${getRandomString(10)}`,
                lookupListName: `LookupList_${getRandomString(10)}`,
            });

            const list = await this.pnp.sp.web.lists.add(lookupListName, testFieldDescription, 100, false);

            const field = await this.pnp.sp.web.fields.addLookup(primary, { LookupListId: list.Id, LookupFieldName: "Title" });

            const fieldDep = await this.pnp.sp.web.fields.addDependentLookupField(secondary, field.Id, "Description");

            return expect(fieldDep.Title).to.be.equal(secondary);
        }));

        it("addLocation", pnpTest("76f5fd29-9fda-4eef-aed4-c29feec3ccfa", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.fields.addLocation(name, { Group: testFieldGroup });

            return expect(field.Title).to.be.equal(name);
        }));

        it("update", pnpTest("83525af1-10dc-4da1-a3a6-056c806bcdcc", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            await this.pnp.sp.web.fields.add(name, FieldTypes.Text, { Group: testFieldGroup });
            await this.pnp.sp.web.fields.getByTitle(name).update({ Description: testFieldDescription });

            const fieldResult = await this.pnp.sp.web.fields.getByTitle(name)();

            return expect(fieldResult.Description).to.be.equal(testFieldDescription);
        }));

        it("setShowInDisplayForm", pnpTest("3e9c6f6c-7b3e-44d2-83fe-95c94c824513", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            await this.pnp.sp.web.fields.add(name, FieldTypes.Text, { Group: testFieldGroup });

            return expect(this.pnp.sp.web.fields.getByTitle(name).setShowInDisplayForm(true)).to.eventually.be.fulfilled;
        }));

        it("setShowInEditForm", pnpTest("9cfae885-6d53-4278-a45a-df8c48e7cd59", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            await this.pnp.sp.web.fields.add(name, FieldTypes.Text, { Group: testFieldGroup });

            return expect(this.pnp.sp.web.fields.getByTitle(name).setShowInEditForm(true)).to.eventually.be.fulfilled;
        }));

        it("setShowInNewForm", pnpTest("2ae3d1a2-4eaa-4b0d-a128-b4d81fb656de", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            await this.pnp.sp.web.fields.add(name, FieldTypes.Text, { Group: testFieldGroup });

            return expect(this.pnp.sp.web.fields.getByTitle(name).setShowInNewForm(true)).to.eventually.be.fulfilled;
        }));

        it("delete", pnpTest("7130986f-4b77-4278-a980-6cf49b9691de", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const f = await this.pnp.sp.web.fields.add(name, FieldTypes.Text, { Group: testFieldGroup });

            return expect(this.pnp.sp.web.fields.getById(f.Id).delete()).to.eventually.be.fulfilled;
        }));
    });

    describe("List", function () {

        it("getById", pnpTest("6e68860b-1a24-4c3c-b5ad-79f6d6a7f539", async function () {
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.getById(titleFieldId).select("Title")<{ Title: string }>();
            return expect(field.Title).to.eq("Title");
        }));

        it("getByTitle", pnpTest("1cdf405a-3631-450c-9d17-15d980a98782", async function () {
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.getByTitle("Title").select("Id")<{ Id: string }>();
            return expect(field.Id).to.eq(titleFieldId);
        }));

        it("getByInternalNameOrTitle (1)", pnpTest("14343d58-f0c2-4f8c-ad89-2c55008edcd3", async function () {
            const field = await this.pnp.sp.site.rootWeb.fields.getByInternalNameOrTitle("Other Address Country/Region").select("Title")<{ Title: string }>();
            return expect(field.Title).to.eq("Other Address Country/Region");
        }));

        it("getByInternalNameOrTitle (2)", pnpTest("2baf89f5-1e3e-4fb6-9c85-f5839f6d762c", async function () {
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.getByInternalNameOrTitle("Title").select("Id")<{ Id: string }>();
            return expect(field.Id).to.eq(titleFieldId);
        }));

        it("createFieldAsXml", pnpTest("850a224d-82aa-44ed-bb1e-cf0f97007129", async function () {

            const { name, fieldId } = await this.props({
                fieldId: getGUID(),
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const testFieldSchema = `<Field ID="{${fieldId}}" Name="${name}" DisplayName="${name}" Type="Currency" Decimals="2" Min="0" Group="${testFieldGroup}" />`;

            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.createFieldAsXml(testFieldSchema);

            return expect(field.Title).to.be.equal(name);
        }));

        it("add", pnpTest("6a1cb77e-97fb-4ce3-8d73-fdd4f4a7c239", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.add(name, FieldTypes.Text, { Group: testFieldGroup });
            return expect(field.Title).to.be.equal(name);
        }));

        it("addText", pnpTest("81840f7d-ae56-4c0d-9650-1b759dbd774a", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.addText(name, { MaxLength: 255, Group: testFieldGroup });
            return expect(field.Title).to.be.equal(name);
        }));

        it("addNumber", pnpTest("d3bc8f38-ee7d-40a5-8b40-61f9d05f68a9", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.fields.addNumber(name, { Group: testFieldGroup });
            return expect(field.Title).to.be.equal(name);
        }));

        it("addCalculated", pnpTest("cb328457-cb39-4b1c-98de-5d085431803b", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.addCalculated(name, {
                Formula: "=Modified+1",
                DateFormat: DateTimeFieldFormatType.DateOnly,
                FieldTypeKind: FieldTypes.Calculated,
                Group: testFieldGroup,
            });

            return expect(field.Title).to.be.equal(name);
        }));

        it("addDateTime", pnpTest("dfa18a6f-9957-4a75-aea6-a8a6a30a0d3e", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.addDateTime(name, {
                DisplayFormat: DateTimeFieldFormatType.DateOnly,
                DateTimeCalendarType: CalendarType.Gregorian,
                FriendlyDisplayFormat: DateTimeFieldFriendlyFormatType.Disabled,
                Group: testFieldGroup,
            });

            return expect(field.Title).to.be.equal(name);
        }));

        it("addCurrency", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.addCurrency(name, {
                MinimumValue: 0,
                MaximumValue: 100,
                CurrencyLocaleId: 1033,
                Group: testFieldGroup,
            });

            return expect(field.Title).to.be.equal(name);
        });

        it("addMultilineText", pnpTest("52e64708-f16a-4fbc-81c1-a4387c786621", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.fields.addMultilineText(name, {
                NumberOfLines: 6,
                RichText: true,
                RestrictedMode: false,
                AppendOnly: false,
                AllowHyperlink: true,
                Group: testFieldGroup,
            });

            return expect(field.Title).to.be.equal(name);
        }));

        it("addUrl", pnpTest("895c46bc-1feb-4b7c-8136-c54a93fc5ea0", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.fields.addUrl(name, { DisplayFormat: UrlFieldFormatType.Hyperlink, Group: testFieldGroup });
            return expect(field.Title).to.be.equal(name);
        }));

        it("addUser", pnpTest("89eda1be-52bd-4be1-9ea4-bcdc31fd984f", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.addUser(name, {
                SelectionMode: FieldUserSelectionMode.PeopleOnly,
                Group: testFieldGroup,
            });
            return expect(field.Title).to.be.equal(name);
        }));

        it("addLookup", pnpTest("b977c6d0-c6b4-44e4-bb7d-c62e942949cb", async function () {

            const { name, lookupListName } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
                lookupListName: `LookupList_${getRandomString(10)}`,
            });

            const list = await this.pnp.sp.web.lists.add(lookupListName, testFieldDescription, 100, false);
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.addLookup(name, { LookupListId: list.Id, LookupFieldName: "Title" });

            return expect(field.Title).to.be.equal(name);
        }));

        it("addChoice", pnpTest("feffd849-9f80-4f57-aa84-9a56f308fbce", async function () {

            const { name, choices } = await this.props({
                choices: [`Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`],
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.addChoice(name, {
                Choices: choices,
                EditFormat: ChoiceFieldFormatType.Dropdown,
                FillInChoice: false,
                Group: testFieldGroup,
            });
            return expect(field.Title).to.be.equal(name);
        }));

        it("addMultiChoice", pnpTest("96cd525d-7541-4b05-a867-01b019826b91", async function () {

            const { name, choices } = await this.props({
                choices: [`Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`],
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.addMultiChoice(name, { Choices: choices, FillInChoice: false, Group: testFieldGroup });
            return expect(field.Title).to.be.equal(name);
        }));

        it("addBoolean", pnpTest("4c48b3fc-659d-4b35-95f9-da847ed8c5b5", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.addBoolean(name, { Group: testFieldGroup });
            return expect(field.Title).to.be.equal(name);
        }));

        it("addLocation", pnpTest("bc663610-bbe2-47b8-85fe-4576b02684b2", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.addLocation(name, { Group: testFieldGroup });
            return expect(field.Title).to.be.equal(name);
        }));

        it("update", pnpTest("7c560353-590a-4785-b44a-09b6c9934ba4", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            await this.pnp.sp.web.lists.getByTitle(listName).fields.add(name, FieldTypes.Text, { Group: testFieldGroup });
            await this.pnp.sp.web.lists.getByTitle(listName).fields.getByTitle(name).update({ Description: testFieldDescription });
            const fieldResult = await this.pnp.sp.web.lists.getByTitle(listName).fields.getByTitle(name)();
            return expect(fieldResult.Description).to.be.equal(testFieldDescription);
        }));

        it("setShowInDisplayForm", pnpTest("a106be65-84ef-4c91-baa9-a88e39b12fc1", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            await this.pnp.sp.web.lists.getByTitle(listName).fields.add(name, FieldTypes.Text, { Group: testFieldGroup });

            return expect(this.pnp.sp.web.lists.getByTitle(listName).fields.getByTitle(name).setShowInDisplayForm(true)).to.eventually.be.fulfilled;
        }));

        it("setShowInEditForm", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            await this.pnp.sp.web.lists.getByTitle(listName).fields.add(name, FieldTypes.Text, { Group: testFieldGroup });

            return expect(this.pnp.sp.web.lists.getByTitle(listName).fields.getByTitle(name).setShowInEditForm(true)).to.eventually.be.fulfilled;
        });

        it("setShowInNewForm", pnpTest("2d042af3-b23f-42d8-9028-5b2dc7a03d7f", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            await this.pnp.sp.web.lists.getByTitle(listName).fields.add(name, FieldTypes.Text, { Group: testFieldGroup });

            return expect(this.pnp.sp.web.lists.getByTitle(listName).fields.getByTitle(name).setShowInNewForm(true)).to.eventually.be.fulfilled;
        }));

        it("delete", async function () {

            const { name } = await this.props({
                name: `${testFieldName}_${getRandomString(10)}`,
            });

            const f = await this.pnp.sp.web.lists.getByTitle(listName).fields.add(name, FieldTypes.Text, { Group: testFieldGroup });
            return expect(this.pnp.sp.web.lists.getByTitle(listName).fields.getById(f.Id).delete()).to.eventually.be.fulfilled;
        });
    });
});
