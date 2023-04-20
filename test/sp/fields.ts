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

        it("getById", async function () {
            return expect(this.pnp.sp.site.rootWeb.fields.getById(titleFieldId).select("Title")()).to.eventually.be.fulfilled;
        });

        it("getByTitle", async function () {
            const field = await this.pnp.sp.site.rootWeb.fields.getById(titleFieldId).select("Title")<{ Title: string }>();
            const field2 = await this.pnp.sp.site.rootWeb.fields.getByTitle(field.Title).select("Id")<{ Id: string }>();
            return expect(field2.Id).to.eq(titleFieldId);
        });
        it("getByInternalNameOrTitle", async function () {
            const field = await this.pnp.sp.site.rootWeb.fields.getByInternalNameOrTitle("Other Address Country/Region").select("Title")<{ Title: string }>();
            return expect(field.Title).to.eq("Other Address Country/Region");
        });
        it("createFieldAsXml", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const testFieldId = getGUID();
            const testFieldSchema = `<Field ID="{${testFieldId}}" \
      Name="${testFieldNameRand}" DisplayName="${testFieldNameRand}" \
      Type="Currency" Decimals="2" Min="0" Required="FALSE" Group="${testFieldGroup}" />`;
            const field = await this.pnp.sp.web.fields.createFieldAsXml(testFieldSchema);
            return expect(field).to.not.be.null;
        });
        it("add", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields.add(testFieldNameRand, "SP.FieldText", FieldTypes.Text, { Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addText", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields.addText(testFieldNameRand, { Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addNumber", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields.addNumber(testFieldNameRand, { Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addCalculated", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields
                .addCalculated(testFieldNameRand, {
                    Formula: "=Modified+1",
                    DateFormat: DateTimeFieldFormatType.DateOnly,
                    FieldTypeKind: FieldTypes.Calculated,
                    Group: testFieldGroup,
                });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addDateTime", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields
                .addDateTime(testFieldNameRand,
                    {
                        DisplayFormat: DateTimeFieldFormatType.DateOnly,
                        DateTimeCalendarType: CalendarType.Gregorian,
                        FriendlyDisplayFormat: DateTimeFieldFriendlyFormatType.Disabled,
                        Group: testFieldGroup,
                    }
                );
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addCurrency", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields.addCurrency(testFieldNameRand, { MinimumValue: 0, MaximumValue: 100, CurrencyLocaleId: 1033, Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addMultilineText", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields
                .addMultilineText(testFieldNameRand, {
                    NumberOfLines: 6,
                    RichText: true,
                    RestrictedMode: false,
                    AppendOnly: false,
                    AllowHyperlink: true,
                    Group: testFieldGroup,
                });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addUrl", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields
                .addUrl(testFieldNameRand, { DisplayFormat: UrlFieldFormatType.Hyperlink, Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addUser", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields
                .addUser(testFieldNameRand, { SelectionMode: FieldUserSelectionMode.PeopleOnly, Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addLookup", async function () {
            const lookupListName = `LookupList_${getRandomString(10)}`;
            const list = await this.pnp.sp.web.lists.add(lookupListName, testFieldDescription, 100, false);
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields.addLookup(testFieldNameRand, { LookupListId: list.data.Id, LookupFieldName: "Title" });
            await field.field.update({
                Group: testFieldGroup,
            });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addChoice", async function () {
            const choices = [`Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`];
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields
                .addChoice(testFieldNameRand, { Choices: choices, EditFormat: ChoiceFieldFormatType.Dropdown, FillInChoice: false, Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addMultiChoice", async function () {
            const choices = [`Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`];
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields
                .addMultiChoice(testFieldNameRand, { Choices: choices, FillInChoice: false, Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addBoolean", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields
                .addBoolean(testFieldNameRand, { Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addDependentLookupField", async function () {
            const lookupListName = `LookupList_${getRandomString(10)}`;
            const list = await this.pnp.sp.web.lists.add(lookupListName, testFieldDescription, 100, false);
            const testFieldNamePrimary = `${testFieldName}_${getRandomString(10)}`;
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields
                .addLookup(testFieldNamePrimary, { LookupListId: list.data.Id, LookupFieldName: "Title" });
            const fieldDep = await this.pnp.sp.web.fields
                .addDependentLookupField(testFieldNameRand, field.data.Id, "Description");
            return expect(fieldDep.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addLocation", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields
                .addLocation(testFieldNameRand, { Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("update", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            await this.pnp.sp.web.fields.add(testFieldNameRand, "SP.FieldText", FieldTypes.Text, { Group: testFieldGroup });
            await this.pnp.sp.web.fields.getByTitle(testFieldNameRand).update({ Description: testFieldDescription });
            const fieldResult = await this.pnp.sp.web.fields.getByTitle(testFieldNameRand)();
            return expect(fieldResult.Description).to.be.equal(testFieldDescription);
        });
        it("setShowInDisplayForm", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            await this.pnp.sp.web.fields.add(testFieldNameRand, "SP.FieldText", FieldTypes.Text, { Group: testFieldGroup });
            try {
                await this.pnp.sp.web.fields.getByTitle(testFieldNameRand).setShowInDisplayForm(true);
                return expect(true).to.be.true;
            } catch (err) {
                return expect(false).to.be.true;
            }
        });
        it("setShowInEditForm", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            await this.pnp.sp.web.fields.add(testFieldNameRand, "SP.FieldText", FieldTypes.Text, { Group: testFieldGroup });
            try {
                await this.pnp.sp.web.fields.getByTitle(testFieldNameRand).setShowInEditForm(true);
                return expect(true).to.be.true;
            } catch (err) {
                return expect(false).to.be.true;
            }
        });
        it("setShowInNewForm", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            await this.pnp.sp.web.fields.add(testFieldNameRand, "SP.FieldText", FieldTypes.Text, { Group: testFieldGroup });
            try {
                await this.pnp.sp.web.fields.getByTitle(testFieldNameRand).setShowInNewForm(true);
                return expect(true).to.be.true;
            } catch (err) {
                return expect(false).to.be.true;
            }
        });
        it("delete", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const f = await this.pnp.sp.web.fields.add(testFieldNameRand, "SP.FieldText", FieldTypes.Text, { Group: testFieldGroup });
            return expect(f.field.delete()).to.eventually.be.fulfilled;
        });
    });

    describe("List", function () {
        // List tests
        it("getById", async function () {
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.getById(titleFieldId).select("Title")<{ Title: string }>();
            return expect(field.Title).to.eq("Title");
        });
        it("getByTitle", async function () {
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.getByTitle("Title").select("Id")<{ Id: string }>();
            return expect(field.Id).to.eq(titleFieldId);
        });

        it("getByInternalNameOrTitle (1)", async function () {
            const field = await this.pnp.sp.site.rootWeb.fields.getByInternalNameOrTitle("Other Address Country/Region").select("Title")<{ Title: string }>();
            return expect(field.Title).to.eq("Other Address Country/Region");
        });

        it("getByInternalNameOrTitle (2)", async function () {
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.getByInternalNameOrTitle("Title").select("Id")<{ Id: string }>();
            return expect(field.Id).to.eq(titleFieldId);
        });

        it("createFieldAsXml", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const testFieldId = getGUID();
            const testFieldSchema = `<Field ID="{${testFieldId}}" \
      Name="${testFieldNameRand}" DisplayName="${testFieldNameRand}" \
      Type="Currency" Decimals="2" Min="0" Required="FALSE" Group="${testFieldGroup}" />`;
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.createFieldAsXml(testFieldSchema);
            const result = expect(field.data.Title).to.be.equal(testFieldNameRand);
            return result;
        });
        it("add", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.add(testFieldNameRand,"SP.FieldText", FieldTypes.Text, { Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addText", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.addText(testFieldNameRand, { MaxLength: 255, Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addNumber", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields.addNumber(testFieldNameRand, { Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addCalculated", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields
                .addCalculated(testFieldNameRand,
                    { Formula: "=Modified+1", DateFormat: DateTimeFieldFormatType.DateOnly, FieldTypeKind: FieldTypes.Calculated, Group: testFieldGroup }
                );
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addDateTime", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields
                .addDateTime(testFieldNameRand,
                    {
                        DisplayFormat: DateTimeFieldFormatType.DateOnly,
                        DateTimeCalendarType: CalendarType.Gregorian,
                        FriendlyDisplayFormat: DateTimeFieldFriendlyFormatType.Disabled,
                        Group: testFieldGroup,
                    }
                );
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addCurrency", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields
                .addCurrency(testFieldNameRand, { MinimumValue: 0, MaximumValue: 100, CurrencyLocaleId: 1033, Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addMultilineText", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields
                .addMultilineText(testFieldNameRand, {
                    NumberOfLines: 6,
                    RichText: true,
                    RestrictedMode: false,
                    AppendOnly: false,
                    AllowHyperlink: true,
                    Group: testFieldGroup,
                });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addUrl", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.fields
                .addUrl(testFieldNameRand, { DisplayFormat: UrlFieldFormatType.Hyperlink, Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addUser", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields
                .addUser(testFieldNameRand, { SelectionMode: FieldUserSelectionMode.PeopleOnly, Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addLookup", async function () {
            const lookupListName = `LookupList_${getRandomString(10)}`;
            const list = await this.pnp.sp.web.lists.add(lookupListName, testFieldDescription, 100, false);
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields.addLookup(testFieldNameRand, { LookupListId: list.data.Id, LookupFieldName: "Title" });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addChoice", async function () {
            const choices = [`Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`];
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields
                .addChoice(testFieldNameRand, { Choices: choices, EditFormat: ChoiceFieldFormatType.Dropdown, FillInChoice: false, Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addMultiChoice", async function () {
            const choices = [`Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`];
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields
                .addMultiChoice(testFieldNameRand, { Choices: choices, FillInChoice: false, Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addBoolean", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields
                .addBoolean(testFieldNameRand, { Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("addLocation", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const field = await this.pnp.sp.web.lists.getByTitle(listName).fields
                .addLocation(testFieldNameRand, { Group: testFieldGroup });
            return expect(field.data.Title).to.be.equal(testFieldNameRand);
        });
        it("update", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            await this.pnp.sp.web.lists.getByTitle(listName).fields.add(testFieldNameRand,"SP.FieldText", FieldTypes.Text, { Group: testFieldGroup });
            await this.pnp.sp.web.lists.getByTitle(listName).fields.getByTitle(testFieldNameRand).update({ Description: testFieldDescription });
            const fieldResult = await this.pnp.sp.web.lists.getByTitle(listName).fields.getByTitle(testFieldNameRand)();
            return expect(fieldResult.Description).to.be.equal(testFieldDescription);
        });
        it("setShowInDisplayForm", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            await this.pnp.sp.web.lists.getByTitle(listName).fields.add(testFieldNameRand,"SP.FieldText", FieldTypes.Text, { Group: testFieldGroup });
            try {
                await this.pnp.sp.web.lists.getByTitle(listName).fields.getByTitle(testFieldNameRand).setShowInDisplayForm(true);
                return expect(true).to.be.true;
            } catch (err) {
                return expect(false).to.be.true;
            }
        });
        it("setShowInEditForm", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            await this.pnp.sp.web.lists.getByTitle(listName).fields.add(testFieldNameRand,"SP.FieldText", FieldTypes.Text, { Group: testFieldGroup });
            try {
                await this.pnp.sp.web.lists.getByTitle(listName).fields.getByTitle(testFieldNameRand).setShowInEditForm(true);
                return expect(true).to.be.true;
            } catch (err) {
                return expect(false).to.be.true;
            }
        });
        it("setShowInNewForm", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            await this.pnp.sp.web.lists.getByTitle(listName).fields.add(testFieldNameRand,"SP.FieldText", FieldTypes.Text, { Group: testFieldGroup });
            try {
                await this.pnp.sp.web.lists.getByTitle(listName).fields.getByTitle(testFieldNameRand).setShowInNewForm(true);
                return expect(true).to.be.true;
            } catch (err) {
                return expect(false).to.be.true;
            }
        });
        it("delete", async function () {
            const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
            const f = await this.pnp.sp.web.lists.getByTitle(listName).fields.add(testFieldNameRand,"SP.FieldText", FieldTypes.Text, { Group: testFieldGroup });
            return expect(f.field.delete()).to.eventually.be.fulfilled;
        });
    });
});
