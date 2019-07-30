
import { expect } from "chai";
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/lists";
import { testSettings } from "../main";
import "@pnp/sp/src/fields";
import {
  DateTimeFieldFormatType,
  FieldTypes,
  CalendarType,
  DateTimeFieldFriendlyFormatType,
  UrlFieldFormatType,
  FieldUserSelectionMode,
  ChoiceFieldFormatType,
} from "@pnp/sp/src/fields";
import { getRandomString } from "@pnp/common";

describe("Fields", function () {
  const testFieldName = "PnPJSTest";
  const titleFieldId = "fa564e0f-0c70-4ab9-b863-0177e6ddd247";
  const testFieldGroup = "PnP Test Group";
  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:max-line-length
  const testFieldDescription = "PnPJS Test Description";
  const listName = "Documents";

  if (testSettings.enableWebTests) {
    // Web Tests
    it("Web: gets field by id", async function () {
      const field = await sp.web.fields.getById(titleFieldId).select("Title").get<{ Title: string }>();
      return expect(field.Title).to.eq("Title");
    });
    it("Web: get field by title", async function () {
      const field = await sp.web.fields.getByTitle("Title").select("Id").get<{ Id: string }>();
      return expect(field.Id).to.eq(titleFieldId);
    });
    it("Web: get field by internal name or title", async function () {
      const field = await sp.web.fields.getByInternalNameOrTitle("Other Address Country/Region").select("Title").get<{ Title: string }>();
      return expect(field.Title).to.eq("Other Address Country/Region");
    });
    it("Web: create field using XML schema", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const testFieldId = `060E50AC-E9C1-4D3C-B1F9-${getRandomString(12)}`;
      const testFieldSchema = `<Field ID="{${testFieldId}}" \
      Name="${testFieldNameRand}" DisplayName="${testFieldNameRand}" \
      Type="Currency" Decimals="2" Min="0" Required="FALSE" Group="${testFieldGroup}" />`;
      const field = await sp.web.fields.createFieldAsXml(testFieldSchema);
      return expect(field).to.not.be.null;
    });
    it("Web: add field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields.add(testFieldNameRand, "SP.FieldText", { FieldTypeKind: 3, Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("Web: add text field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields.addText(testFieldNameRand, 255, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("Web: add calculated field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields.addCalculated(testFieldNameRand, "=Modified+1", DateTimeFieldFormatType.DateOnly, FieldTypes.DateTime, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it.only("Web: add datetime field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addDateTime(testFieldNameRand, DateTimeFieldFormatType.DateOnly, CalendarType.Gregorian, DateTimeFieldFriendlyFormatType.Disabled, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it.only("Web: add currency field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addCurrency(testFieldNameRand, 0, 100, 1033, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it.only("Web: add multi line text field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addMultilineText(testFieldNameRand, 6, true, false, false, true, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it.only("Web: add url field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addUrl(testFieldNameRand, UrlFieldFormatType.Hyperlink, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it.only("Web: add user field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addUser(testFieldNameRand, FieldUserSelectionMode.PeopleOnly, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it.only("Web: add lookup field", async function () {
      const lookupListName = `LookupList_${getRandomString(10)}`;
      const list = await sp.web.lists.add(lookupListName, testFieldDescription, 100, false);
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addLookup(testFieldNameRand, list.data.Id, "Title", { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it.only("Web: add choice field", async function () {
      const choices = [`Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`];
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addChoice(testFieldNameRand, choices, ChoiceFieldFormatType.Dropdown, false, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it.only("Web: add multi choice field", async function () {
      const choices = [`Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`];
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addMultiChoice(testFieldNameRand, choices, ChoiceFieldFormatType.Dropdown, false, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it.only("Web: add boolean field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addBoolean(testFieldNameRand, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it.only("Web: add dependent lookup field", async function () {
      const lookupListName = `LookupList_${getRandomString(10)}`;
      const list = await sp.web.lists.add(lookupListName, testFieldDescription, 100, false);
      const testFieldNamePrimary = `${testFieldName}_${getRandomString(10)}`;
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addLookup(testFieldNamePrimary, list.data.Id, "Title", { Group: testFieldGroup });
      const fieldDep = await sp.web.fields
        .addDependentLookupField(testFieldNameRand, field.data.Id, "Description");
      return expect(fieldDep.data.Title).to.be.equal(testFieldNameRand);
    });
    it.only("Web: add location field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addLocation(testFieldNameRand, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });

    // List tests
    it("List: create field using XML schema", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const testFieldId = `060E50AC-E9C1-4D3C-B1F9-${getRandomString(12)}`;
      const testFieldSchema = `<Field ID="{${testFieldId}}" \
      Name="${testFieldNameRand}" DisplayName="${testFieldNameRand}" \
      Type="Currency" Decimals="2" Min="0" Required="FALSE" Group="${testFieldGroup}" />`;
      const field = await sp.web.lists.getByTitle(listName).fields.createFieldAsXml(testFieldSchema);
      const result = expect(field.data.Title).to.be.equal(testFieldNameRand);
      return result;
    });
  }
});
