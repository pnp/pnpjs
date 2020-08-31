# @pnp/sp/lists

Fields in SharePoint can be applied to both webs and lists. When referencing a webs' fields you are effectively looking at site columns which are common fields that can be utilized in any list/library in the site. When referencing a lists' fields you are looking at the fields only associated to that particular list.

## IFields

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 1|import { sp } from "@pnp/sp";<br />import { Webs, IWebs } from "@pnp/sp/webs"; <br />import { Fields, IFields } from "@pnp/sp/fields";|
|Selective 2|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br />import "@pnp/sp/fields";|
|Preset: All|import { sp, Fields, IFields } from "@pnp/sp/presets/all";|
|Preset: Core|import { sp, Fields, IFields } from "@pnp/sp/presets/core";|

### Get Field by Id

Gets a field from the collection by id (guid). Note that the library will handle a guid formatted with curly braces (i.e. '{03b05ff4-d95d-45ed-841d-3855f77a2483}') as well as without curly braces (i.e. '03b05ff4-d95d-45ed-841d-3855f77a2483'). The Id parameter is also case insensitive.

```TypeScript
import { sp } from "@pnp/sp";
import { IField } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/fields";

// get the field by Id for web
const field: IField = sp.web.fields.getById("03b05ff4-d95d-45ed-841d-3855f77a2483");
// get the field by Id for list 'My List'
const field2: IFieldInfo = await sp.web.lists.getByTitle("My List").fields.getById("03b05ff4-d95d-45ed-841d-3855f77a2483")();

// we can use this 'field' variable to execute more queries on the field:
const r = await field.select("Title")();

// show the response from the server
console.log(r.Title);
```

### Get Field by Title

You can also get a field from the collection by title.

```TypeScript
import { sp } from "@pnp/sp";
import { IField } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists"
import "@pnp/sp/fields";

// get the field with the title 'Author' for web
const field: IField = sp.web.fields.getByTitle("Author");
// get the field with the title 'Author' for list 'My List'
const field2: IFieldInfo = await sp.web.lists.getByTitle("My List").fields.getByTitle("Author")();

// we can use this 'field' variable to run more queries on the field:
const r = await field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Get Field by Internal Name or Title

You can also get a field from the collection regardless of if the string is the fields internal name or title which can be different.

```TypeScript
import { sp } from "@pnp/sp";
import { IField } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists"
import "@pnp/sp/fields";

// get the field with the internal name 'ModifiedBy' for web
const field: IField = sp.web.fields.getByInternalNameOrTitle("ModifiedBy");
// get the field with the internal name 'ModifiedBy' for list 'My List'
const field2: IFieldInfo = await sp.web.lists.getByTitle("My List").fields.getByInternalNameOrTitle("ModifiedBy")();

// we can use this 'field' variable to run more queries on the field:
const r = await field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Create a Field using an XML schema

Create a new field by defining an XML schema that assigns all the properties for the field.

```TypeScript
import { sp } from "@pnp/sp";
import { IField } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

// define the schema for your new field, in this case a date field with a default date of today.
const fieldSchema = `<Field ID="{03b09ff4-d99d-45ed-841d-3855f77a2483}" StaticName="MyField" Name="MyField" DisplayName="My New Field" FriendlyDisplayFormat="Disabled" Format="DateOnly" Type="DateTime" Group="My Group"><Default>[today]</Default></Field>`;

// create the new field in the web
const field: IFieldAddResult = await sp.web.fields.createFieldAsXml(fieldSchema);
// create the new field in the list 'My List'
const field2: IFieldAddResult = await sp.web.lists.getByTitle("My List").fields.createFieldAsXml(fieldSchema);

// we can use this 'field' variable to run more queries on the list:
const r = await field.field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a New Field

Use the add method to create a new field where you define the field type

```TypeScript
import { sp } from "@pnp/sp";
import { IField } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

// create a new field called 'My Field' in web.
const field: IFieldAddResult = await sp.web.fields.add("My Field", "SP.FieldText", { FieldTypeKind: 3, Group: "My Group" });
// create a new field called 'My Field' in the list 'My List'
const field2: IFieldAddResult = await sp.web.lists.getByTitle("My List").fields.add("My Field", "SP.FieldText", { FieldTypeKind: 3, Group: "My Group" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a Site Field to a List

Use the createFieldAsXml method to add a site field to a list.

```TypeScript
import { sp } from "@pnp/sp";
import { IFieldAddResult } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

// create a new field called 'My Field' in web.
const field: IFieldAddResult = await sp.web.fields.add("My Field", "SP.FieldText", { FieldTypeKind: 3, Group: "My Group" });
// add the site field 'My Field' to the list 'My List'
const r = await sp.web.lists.getByTitle("My List").fields.createFieldAsXml(field.data.SchemaXml);

// log the field Id to console
console.log(r.data.Id);
```

### Add a Text Field

Use the addText method to create a new text field.

```TypeScript
import { sp } from "@pnp/sp";
import { IFieldAddResult } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

// create a new text field called 'My Field' in web.
const field: IFieldAddResult = await sp.web.fields.addText("My Field", 255, { Group: "My Group" });
// create a new text field called 'My Field' in the list 'My List'.
const field2: IFieldAddResult = await sp.web.lists.getByTitle("My List").fields.addText("My Field", 255, { Group: "My Group" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a Calculated Field

Use the addCalculated method to create a new calculated field.

```TypeScript
import { sp } from "@pnp/sp";
import { DateTimeFieldFormatType, FieldTypes } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

// create a new calculated field called 'My Field' in web
const field = await sp.web.fields.addCalculated("My Field", "=Modified+1", DateTimeFieldFormatType.DateOnly, FieldTypes.DateTime, { Group: "MyGroup" });
// create a new calculated field called 'My Field' in the list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.addCalculated("My Field", "=Modified+1", DateTimeFieldFormatType.DateOnly, FieldTypes.DateTime, { Group: "MyGroup" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a Date/Time Field

Use the addDateTime method to create a new date/time field.

```TypeScript
import { sp } from "@pnp/sp";
import { DateTimeFieldFormatType, CalendarType, DateTimeFieldFriendlyFormatType } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

// create a new date/time field called 'My Field' in web
const field = await sp.web.fields.addDateTime("My Field", DateTimeFieldFormatType.DateOnly, CalendarType.Gregorian, DateTimeFieldFriendlyFormatType.Disabled, { Group: "My Group" });
// create a new date/time field called 'My Field' in the list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.addDateTime("My Field", DateTimeFieldFormatType.DateOnly, CalendarType.Gregorian, DateTimeFieldFriendlyFormatType.Disabled, { Group: "My Group" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a Currency Field

Use the addCurrency method to create a new currency field.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

// create a new currency field called 'My Field' in web
const field = await sp.web.fields.addCurrency("My Field", 0, 100, 1033, { Group: "My Group" });
// create a new currency field called 'My Field' in list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.addCurrency("My Field", 0, 100, 1033, { Group: "My Group" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a Multi-line Text Field

Use the addMultilineText method to create a new multi-line text field.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

// create a new multi-line text field called 'My Field' in web
const field = await sp.web.fields.addMultilineText("My Field", 6, true, false, false, true, { Group: "My Group" });
// create a new multi-line text field called 'My Field' in list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.addMultilineText("My Field", 6, true, false, false, true, { Group: "My Group" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a URL Field

Use the addUrl method to create a new url field.

```TypeScript
import { sp } from "@pnp/sp";
import { UrlFieldFormatType } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

// create a new url field called 'My Field' in web
const field = await sp.web.fields.addUrl("My Field", UrlFieldFormatType.Hyperlink, { Group: "My Group" });
// create a new url field called 'My Field' in list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.addUrl("My Field", UrlFieldFormatType.Hyperlink, { Group: "My Group" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a User Field

Use the addUser method to create a new user field.

```TypeScript
import { sp } from "@pnp/sp";
import { FieldUserSelectionMode } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

// create a new user field called 'My Field' in web
const field = await sp.web.fields.addUser("My Field", FieldUserSelectionMode.PeopleOnly, { Group: "My Group" });
// create a new user field called 'My Field' in list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.addUser("My Field", FieldUserSelectionMode.PeopleOnly, { Group: "My Group" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a Lookup Field

Use the addLookup method to create a new lookup field.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const list = await sp.web.lists.getByTitle("My Lookup List")();
// create a new lookup field called 'My Field' based on an existing list 'My Lookup List' showing 'Title' field in web.
const field = await sp.web.fields.addLookup("My Field", list.Id, "Title",  { Group: "My Group" });
// create a new lookup field called 'My Field' based on an existing list 'My Lookup List' showing 'Title' field in list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.addLookup("My Field", list.Id, "Title",  { Group: "My Group" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.field.select("Id")();

// log the field Id to console
console.log(r.Id);

// **
// Adding a lookup that supports multiple values takes two calls:
const fieldAddResult = await sp.web.fields.addLookup("Test Lookup 124", "GUID", "Title");

await fieldAddResult.field.update({ Description: 'New Description' }, "SP.FieldLookup");
```

### Add a Choice Field

Use the addChoice method to create a new choice field.

```TypeScript
import { sp } from "@pnp/sp";
import { ChoiceFieldFormatType } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const choices = [`ChoiceA`, `ChoiceB`, `ChoiceC`];
// create a new choice field called 'My Field' in web
const field = await sp.web.fields.addChoice("My Field", choices, ChoiceFieldFormatType.Dropdown, false, { Group: "My Group" });
// create a new choice field called 'My Field' in list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.addChoice("My Field", choices, ChoiceFieldFormatType.Dropdown, false, { Group: "My Group" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a Multi-Choice Field

Use the addMultiChoice method to create a new multi-choice field.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const choices = [`ChoiceA`, `ChoiceB`, `ChoiceC`];
// create a new multi-choice field called 'My Field' in web
const field = await sp.web.fields.addMultiChoice("My Field", choices, false, { Group: "My Group" });
// create a new multi-choice field called 'My Field' in list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.addMultiChoice("My Field", choices, false, { Group: "My Group" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a Boolean Field

Use the addBoolean method to create a new boolean field.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

// create a new boolean field called 'My Field' in web
const field = await sp.web.fields.addBoolean("My Field", { Group: "My Group" });
// create a new boolean field called 'My Field' in list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.addBoolean("My Field", { Group: "My Group" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a Dependent Lookup Field

Use the addDependentLookupField method to create a new dependent lookup field.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

// create a new dependent lookup field called 'My Dep Field' showing 'Description' based on an existing 'My Field' lookup field in web.
const field = await sp.web.fields.getByTitle("My Field")();
const fieldDep = await sp.web.fields.addDependentLookupField("My Dep Field", field.Id, "Description");
// create a new dependent lookup field called 'My Dep Field' showing 'Description' based on an existing 'My Field' lookup field in list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.getByTitle("My Field")();
const fieldDep2 = await sp.web.lists.getByTitle("My List").fields.addDependentLookupField("My Dep Field", field2.Id, "Description");

// we can use this 'fieldDep' variable to run more queries on the field:
const r = await fieldDep.field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a Location Field

Use the addLocation method to create a new location field.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

// create a new location field called 'My Field' in web
const field = await sp.web.fields.addLocation("My Field", { Group: "My Group" });
// create a new location field called 'My Field' in list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.addLocation("My Field", { Group: "My Group" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Delete a Field

Use the delete method to delete a field.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/fields";

// delete one or more fields from web, returns boolean
const result = await sp.web.fields.getByTitle("My Field").delete();
const result2 = await sp.web.fields.getByTitle("My Field 2").delete();
// delete one or more fields from list 'My List', returns boolean
const result = await sp.web.lists.getByTitle("My List").fields.getByTitle("My Field").delete();
const result2 = await sp.web.lists.getByTitle("My List").fields.getByTitle("My Field 2").delete();
```

### Update a Field

Use the update method to update a field.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

// update the field called 'My Field' with a description in web, returns FieldUpdateResult
const fieldUpdate = await sp.web.fields.getByTitle("My Field").update({ Description: "My Description" });
// update the field called 'My Field' with a description in list 'My List', returns FieldUpdateResult
const fieldUpdate2 = await sp.web.lists.getByTitle("My List").fields.getByTitle("My Field").update({ Description: "My Description" });

// if you need to update a field with properties for a specific field type you can optionally include the field type as a second param
// if you do not include it we will look up the type, but that adds a call to the server
const fieldUpdate2 = await sp.web.lists.getByTitle("My List").fields.getByTitle("My Look up Field").update({ RelationshipDeleteBehavior: 1 }, "SP.FieldLookup");
```

### Show a Field in the Display Form

Use the setShowInDisplayForm method to add a field to the display form.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

// show field called 'My Field' in display form throughout web
await sp.web.fields.getByTitle("My Field").setShowInDisplayForm(true);
// show field called 'My Field' in display form for list 'My List'
await sp.web.lists.getByTitle("My List").fields.getByTitle("My Field").setShowInDisplayForm(true);
```

### Show a Field in the Edit Form

Use the setShowInEditForm method to add a field to the edit form.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

// show field called 'My Field' in edit form throughout web
await sp.web.fields.getByTitle("My Field").setShowInEditForm(true);
// show field called 'My Field' in edit form for list 'My List'
await sp.web.lists.getByTitle("My List").fields.getByTitle("My Field").setShowInEditForm(true);
```

### Show a Field in the New Form

Use the setShowInNewForm method to add a field to the display form.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

// show field called 'My Field' in new form throughout web
await sp.web.fields.getByTitle("My Field").setShowInNewForm(true);
// show field called 'My Field' in new form for list 'My List'
await sp.web.lists.getByTitle("My List").fields.getByTitle("My Field").setShowInNewForm(true);
```
