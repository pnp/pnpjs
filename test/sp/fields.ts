
import { expect } from "chai";
import { sp } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import { testSettings } from "../main";
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
import { getRandomString, getGUID } from "@pnp/common";

describe("Fields", function () {
  const testFieldName = "PnPJSTest";
  const titleFieldId = "fa564e0f-0c70-4ab9-b863-0177e6ddd247";
  const testFieldGroup = "PnP Test Group";
  const testFieldDescription = "PnPJS Test Description";
  const listName = "Documents";

  if (testSettings.enableWebTests) {
    // Web Tests
    it("Web: gets field by id", async function () {
      return expect(sp.site.rootWeb.fields.getById(titleFieldId).select("Title")<{ Title: string }>()).to.eventually.be.fulfilled;
    });
    it("Web: get field by title", async function () {
      const field = await sp.site.rootWeb.fields.getById(titleFieldId).select("Title").get<{ Title: string }>();
      const field2 = await sp.site.rootWeb.fields.getByTitle(field.Title).select("Id").get<{ Id: string }>();
      return expect(field2.Id).to.eq(titleFieldId);
    });
    it("Web: get field by internal name or title", async function () {
      const field = await sp.site.rootWeb.fields.getByInternalNameOrTitle("Other Address Country/Region").select("Title").get<{ Title: string }>();
      return expect(field.Title).to.eq("Other Address Country/Region");
    });
    it("Web: create field using XML schema", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const testFieldId = getGUID();
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
    it("Web: add datetime field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addDateTime(testFieldNameRand, DateTimeFieldFormatType.DateOnly, CalendarType.Gregorian, DateTimeFieldFriendlyFormatType.Disabled, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("Web: add currency field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields.addCurrency(testFieldNameRand, 0, 100, 1033, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("Web: add multi line text field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addMultilineText(testFieldNameRand, 6, true, false, false, true, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("Web: add url field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addUrl(testFieldNameRand, UrlFieldFormatType.Hyperlink, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("Web: add user field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addUser(testFieldNameRand, FieldUserSelectionMode.PeopleOnly, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("Web: add lookup field", async function () {
      const lookupListName = `LookupList_${getRandomString(10)}`;
      const list = await sp.web.lists.add(lookupListName, testFieldDescription, 100, false);
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields.addLookup(testFieldNameRand, list.data.Id, "Title");
      await field.field.update({
        Group: testFieldGroup,
      });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("Web: add choice field", async function () {
      const choices = [`Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`];
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addChoice(testFieldNameRand, choices, ChoiceFieldFormatType.Dropdown, false, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("Web: add multi choice field", async function () {
      const choices = [`Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`];
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addMultiChoice(testFieldNameRand, choices, false, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("Web: add boolean field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addBoolean(testFieldNameRand, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("Web: add dependent lookup field", async function () {
      const lookupListName = `LookupList_${getRandomString(10)}`;
      const list = await sp.web.lists.add(lookupListName, testFieldDescription, 100, false);
      const testFieldNamePrimary = `${testFieldName}_${getRandomString(10)}`;
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addLookup(testFieldNamePrimary, list.data.Id, "Title", {});
      const fieldDep = await sp.web.fields
        .addDependentLookupField(testFieldNameRand, field.data.Id, "Description");
      return expect(fieldDep.data.Title).to.be.equal(testFieldNameRand);
    });
    it("Web: add location field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addLocation(testFieldNameRand, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("Web: update a field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      await sp.web.fields.add(testFieldNameRand, "SP.FieldText", { FieldTypeKind: 3, Group: testFieldGroup });
      await sp.web.fields.getByTitle(testFieldNameRand).update({ Description: testFieldDescription });
      const fieldResult = await sp.web.fields.getByTitle(testFieldNameRand)();
      return expect(fieldResult.Description).to.be.equal(testFieldDescription);
    });
    it("Web: set show in display form", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      await sp.web.fields.add(testFieldNameRand, "SP.FieldText", { FieldTypeKind: 3, Group: testFieldGroup });
      try {
        await sp.web.fields.getByTitle(testFieldNameRand).setShowInDisplayForm(true);
        return expect(true).to.be.true;
      } catch (err) {
        return expect(false).to.be.true;
      }
    });
    it("Web: set show in edit form", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      await sp.web.fields.add(testFieldNameRand, "SP.FieldText", { FieldTypeKind: 3, Group: testFieldGroup });
      try {
        await sp.web.fields.getByTitle(testFieldNameRand).setShowInEditForm(true);
        return expect(true).to.be.true;
      } catch (err) {
        return expect(false).to.be.true;
      }
    });
    it("Web: set show in new form", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      await sp.web.fields.add(testFieldNameRand, "SP.FieldText", { FieldTypeKind: 3, Group: testFieldGroup });
      try {
        await sp.web.fields.getByTitle(testFieldNameRand).setShowInNewForm(true);
        return expect(true).to.be.true;
      } catch (err) {
        return expect(false).to.be.true;
      }
    });
    // Unknown issue where f.field.delete() successfully executes but does not actually delete the field.
    // However, this is happening only inside the testing framework, tests performed outside have proven successful, therefore disabling this test.
    // it("Web: delete web field", async function () {
    //   const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
    //   const f = await sp.web.fields.add(testFieldNameRand, "SP.FieldText", { FieldTypeKind: 3, Group: testFieldGroup });
    //   return expect(f.field.delete()).to.eventually.be.fulfilled;
    // });

    // List tests
    it("List: gets field by id", async function () {
      const field = await sp.web.lists.getByTitle(listName).fields.getById(titleFieldId).select("Title").get<{ Title: string }>();
      return expect(field.Title).to.eq("Title");
    });
    it("List: get field by title", async function () {
      const field = await sp.web.lists.getByTitle(listName).fields.getByTitle("Title").select("Id").get<{ Id: string }>();
      return expect(field.Id).to.eq(titleFieldId);
    });
    // it("List: get field by internal name or title", async function () {
    //   const field = await sp.web.lists.getByTitle(listName).fields.getByInternalNameOrTitle("Title").select("Title").get<{ Id: string }>();
    //   return expect(field.Id).to.eq(titleFieldId);
    // });
    it("List: create field using XML schema", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const testFieldId = getGUID();
      const testFieldSchema = `<Field ID="{${testFieldId}}" \
      Name="${testFieldNameRand}" DisplayName="${testFieldNameRand}" \
      Type="Currency" Decimals="2" Min="0" Required="FALSE" Group="${testFieldGroup}" />`;
      const field = await sp.web.lists.getByTitle(listName).fields.createFieldAsXml(testFieldSchema);
      const result = expect(field.data.Title).to.be.equal(testFieldNameRand);
      return result;
    });
    it("List: add field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.lists.getByTitle(listName).fields.add(testFieldNameRand, "SP.FieldText", { FieldTypeKind: 3, Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("List: add text field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.lists.getByTitle(listName).fields.addText(testFieldNameRand, 255, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("List: add calculated field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.lists.getByTitle(listName).fields
        .addCalculated(testFieldNameRand, "=Modified+1", DateTimeFieldFormatType.DateOnly, FieldTypes.DateTime, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("List: add datetime field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.lists.getByTitle(listName).fields
        .addDateTime(testFieldNameRand, DateTimeFieldFormatType.DateOnly, CalendarType.Gregorian, DateTimeFieldFriendlyFormatType.Disabled, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("List: add currency field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.lists.getByTitle(listName).fields
        .addCurrency(testFieldNameRand, 0, 100, 1033, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("List: add multi line text field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addMultilineText(testFieldNameRand, 6, true, false, false, true, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("List: add url field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.fields
        .addUrl(testFieldNameRand, UrlFieldFormatType.Hyperlink, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("List: add user field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.lists.getByTitle(listName).fields
        .addUser(testFieldNameRand, FieldUserSelectionMode.PeopleOnly, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("List: add lookup field", async function () {
      const lookupListName = `LookupList_${getRandomString(10)}`;
      const list = await sp.web.lists.add(lookupListName, testFieldDescription, 100, false);
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.lists.getByTitle(listName).fields.addLookup(testFieldNameRand, list.data.Id, "Title");
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("List: add choice field", async function () {
      const choices = [`Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`];
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.lists.getByTitle(listName).fields
        .addChoice(testFieldNameRand, choices, ChoiceFieldFormatType.Dropdown, false, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("List: add multi choice field", async function () {
      const choices = [`Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`, `Choice_${getRandomString(5)}`];
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.lists.getByTitle(listName).fields
        .addMultiChoice(testFieldNameRand, choices, false, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("List: add boolean field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.lists.getByTitle(listName).fields
        .addBoolean(testFieldNameRand, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("List: add location field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      const field = await sp.web.lists.getByTitle(listName).fields
        .addLocation(testFieldNameRand, { Group: testFieldGroup });
      return expect(field.data.Title).to.be.equal(testFieldNameRand);
    });
    it("List: update a field", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      await sp.web.lists.getByTitle(listName).fields.add(testFieldNameRand, "SP.FieldText", { FieldTypeKind: 3, Group: testFieldGroup });
      await sp.web.lists.getByTitle(listName).fields.getByTitle(testFieldNameRand).update({ Description: testFieldDescription });
      const fieldResult = await sp.web.lists.getByTitle(listName).fields.getByTitle(testFieldNameRand).get();
      return expect(fieldResult.Description).to.be.equal(testFieldDescription);
    });
    it("List: set show in display form", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      await sp.web.lists.getByTitle(listName).fields.add(testFieldNameRand, "SP.FieldText", { FieldTypeKind: 3, Group: testFieldGroup });
      try {
        await sp.web.lists.getByTitle(listName).fields.getByTitle(testFieldNameRand).setShowInDisplayForm(true);
        return expect(true).to.be.true;
      } catch (err) {
        return expect(false).to.be.true;
      }
    });
    it("List: set show in edit form", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      await sp.web.lists.getByTitle(listName).fields.add(testFieldNameRand, "SP.FieldText", { FieldTypeKind: 3, Group: testFieldGroup });
      try {
        await sp.web.lists.getByTitle(listName).fields.getByTitle(testFieldNameRand).setShowInEditForm(true);
        return expect(true).to.be.true;
      } catch (err) {
        return expect(false).to.be.true;
      }
    });
    it("List: set show in new form", async function () {
      const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
      await sp.web.lists.getByTitle(listName).fields.add(testFieldNameRand, "SP.FieldText", { FieldTypeKind: 3, Group: testFieldGroup });
      try {
        await sp.web.lists.getByTitle(listName).fields.getByTitle(testFieldNameRand).setShowInNewForm(true);
        return expect(true).to.be.true;
      } catch (err) {
        return expect(false).to.be.true;
      }
    });
    // Unknown issue where f.field.delete() successfully executes but does not actually delete the field.
    // However, this is happening only inside the testing framework, tests performed outside have proven successful, therefore disabling this test.
    // it("List: delete field", async function () {
    //   const testFieldNameRand = `${testFieldName}_${getRandomString(10)}`;
    //   const f = await sp.web.lists.getByTitle(listName).fields.add(testFieldNameRand, "SP.FieldText", { FieldTypeKind: 3, Group: testFieldGroup });
    //   return expect(f.field.delete()).to.eventually.be.fulfilled;
    // });
  }
});
