# @pnp/sp/fields

Fields in SharePoint can be applied to both webs and lists. When referencing a webs' fields you are effectively looking at site columns which are common fields that can be utilized in any list/library in the site. When referencing a lists' fields you are looking at the fields only associated to that particular list.

## IFields

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

### Get Field by Id

Gets a field from the collection by id (guid). Note that the library will handle a guid formatted with curly braces (i.e. '{03b05ff4-d95d-45ed-841d-3855f77a2483}') as well as without curly braces (i.e. '03b05ff4-d95d-45ed-841d-3855f77a2483'). The Id parameter is also case insensitive.

```TypeScript
import { spfi } from "@pnp/sp";
import { IField, IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/fields";

// set up sp root object
const sp = spfi(...);
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
import { spfi } from "@pnp/sp";
import { IField, IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists"
import "@pnp/sp/fields";

const sp = spfi(...);
// get the field with the title 'Author' for web
const field: IField = sp.web.fields.getByTitle("Author");
// get the field with the title 'Title' for list 'My List'
const field2: IFieldInfo = await sp.web.lists.getByTitle("My List").fields.getByTitle("Title")();

// we can use this 'field' variable to run more queries on the field:
const r = await field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Get Field by Internal Name or Title

You can also get a field from the collection regardless of if the string is the fields internal name or title which can be different.

```TypeScript
import { spfi } from "@pnp/sp";
import { IField, IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists"
import "@pnp/sp/fields";

const sp = spfi(...);
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
import { spfi } from "@pnp/sp";
import { IField, IFieldInfo } from "@pnp/sp/fields/types";

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// define the schema for your new field, in this case a date field with a default date of today.
const fieldSchema = `<Field ID="{03b09ff4-d99d-45ed-841d-3855f77a2483}" StaticName="MyField" Name="MyField" DisplayName="My New Field" FriendlyDisplayFormat="Disabled" Format="DateOnly" Type="DateTime" Group="My Group"><Default>[today]</Default></Field>`;

// create the new field in the web
const field:IFieldInfo = await sp.web.fields.createFieldAsXml(fieldSchema);
// create the new field in the list 'My List'
const field2:IFieldInfo = await sp.web.lists.getByTitle("My List").fields.createFieldAsXml(fieldSchema);


// log the field Id to console
console.log(field.Id);
```

### Add a New Field

Use the add method to create a new field where you define the field type

```TypeScript
import { spfi } from "@pnp/sp";
import { IField, FieldTypes, IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// create a new field called 'My Field' in web.
const field:IFieldInfo = await sp.web.fields.add("My Field", FieldTypes.Text, { FieldTypeKind: 3, Group: "My Group" });
// create a new field called 'My Field' in the list 'My List'
const field2:IFieldInfo = await sp.web.lists.getByTitle("My List").fields.add("My Field", FieldTypes.Text, { FieldTypeKind: 3, Group: "My Group" });

// log the field Id to console
console.log(field.Id);
```

### Add a Site Field to a List

Use the createFieldAsXml method to add a site field to a list.

```TypeScript
import { spfi } from "@pnp/sp";
import { FieldTypes, IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// create a new field called 'My Field' in web.
const field:IFieldInfo = await sp.web.fields.add("My Field", FieldTypes.Text, { FieldTypeKind: 3, Group: "My Group" });
// add the site field 'My Field' to the list 'My List'
const r:IFieldInfo = await sp.web.lists.getByTitle("My List").fields.createFieldAsXml(field.SchemaXml as string);

// log the field Id to console
console.log(r.Id);
```

### Add a Text Field

Use the addText method to create a new text field.

```TypeScript
import { spfi } from "@pnp/sp";
import { FieldTypes, IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// create a new text field called 'My Field' in web.
const field:IFieldInfo = await sp.web.fields.addText("My Field", { MaxLength: 255, Group: "My Group" });
// create a new text field called 'My Field' in the list 'My List'.
const field2:IFieldInfo = await sp.web.lists.getByTitle("My List").fields.addText("My Field", { MaxLength: 255, Group: "My Group" });

// log the field Id to console
console.log(field.Id);
```

### Add a Calculated Field

Use the addCalculated method to create a new calculated field.

```TypeScript
import { spfi } from "@pnp/sp";
import { DateTimeFieldFormatType, FieldTypes, IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// create a new calculated field called 'My Field' in web
const field:IFieldInfo = await sp.web.fields.addCalculated("My Field", { Formula: "=Modified+1", DateFormat: DateTimeFieldFormatType.DateOnly, FieldTypeKind: FieldTypes.Calculated, Group: "MyGroup" });
// create a new calculated field called 'My Field' in the list 'My List'
const field2:IFieldInfo = await sp.web.lists.getByTitle("My List").fields.addCalculated("My Field", { Formula: "=Modified+1", DateFormat:  DateTimeFieldFormatType.DateOnly, FieldTypeKind: FieldTypes.Calculated, Group: "MyGroup" });


// log the field Id to console
console.log(field.Id);
```

### Add a Date/Time Field

Use the addDateTime method to create a new date/time field.

```TypeScript
import { spfi } from "@pnp/sp";
import { DateTimeFieldFormatType, CalendarType, DateTimeFieldFriendlyFormatType, IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// create a new date/time field called 'My Field' in web
const field:IFieldInfo = await sp.web.fields.addDateTime("My Field", { DisplayFormat: DateTimeFieldFormatType.DateOnly, DateTimeCalendarType: CalendarType.Gregorian, FriendlyDisplayFormat: DateTimeFieldFriendlyFormatType.Disabled,  Group: "My Group" });
// create a new date/time field called 'My Field' in the list 'My List'
const field2:IFieldInfo = await sp.web.lists.getByTitle("My List").fields.addDateTime("My Field", { DisplayFormat: DateTimeFieldFormatType.DateOnly, DateTimeCalendarType: CalendarType.Gregorian, FriendlyDisplayFormat: DateTimeFieldFriendlyFormatType.Disabled, Group: "My Group" });

// log the field Id to console
console.log(field.Id);
```

### Add a Currency Field

Use the addCurrency method to create a new currency field.

```TypeScript
import { spfi } from "@pnp/sp";
import { IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// create a new currency field called 'My Field' in web
const field:IFieldInfo = await sp.web.fields.addCurrency("My Field", { MinimumValue: 0, MaximumValue: 100, CurrencyLocaleId: 1033, Group: "My Group" });
// create a new currency field called 'My Field' in list 'My List'
const field2:IFieldInfo = await sp.web.lists.getByTitle("My List").fields.addCurrency("My Field", { MinimumValue: 0, MaximumValue: 100, CurrencyLocaleId: 1033, Group: "My Group" });

// log the field Id to console
console.log(field.Id);
```

### Add an Image Field

Use the addImageField method to create a new image field.

```TypeScript
import { spfi } from "@pnp/sp";
import { FieldTypes, IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// create a new image field called 'My Field' in web.
const field:IFieldInfo = await sp.web.fields.addImageField("My Field");
// create a new image field called 'My Field' in the list 'My List'.
const field2:IFieldInfo = await sp.web.lists.getByTitle("My List").fields.addImageField("My Field");

// log the field Id to console
console.log(field.Id);
```

### Add a Multi-line Text Field

Use the addMultilineText method to create a new multi-line text field.
>For Enhanced Rich Text mode, see the next section.

```TypeScript
import { spfi } from "@pnp/sp";
import { FieldTypes, IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// create a new multi-line text field called 'My Field' in web
const field:IFieldInfo = await sp.web.fields.addMultilineText("My Field", { NumberOfLines: 6, RichText: true, RestrictedMode: false, AppendOnly: false, AllowHyperlink: true, Group: "My Group" });
// create a new multi-line text field called 'My Field' in list 'My List'
const field2:IFieldInfo = await sp.web.lists.getByTitle("My List").fields.addMultilineText("My Field", { NumberOfLines: 6, RichText: true, RestrictedMode: false, AppendOnly: false, AllowHyperlink: true, Group: "My Group" });

// log the field Id to console
console.log(field.Id);
```

### Add a Multi-line Text Field with Enhanced Rich Text

The REST endpoint doesn't support setting the `RichTextMode` field therefore you will need to revert to Xml to create the field. The following is an example that will create a multi-line text field in Enhanced Rich Text mode.

```TypeScript
import { spfi } from "@pnp/sp";
import { FieldTypes, IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

//Create a new multi-line text field called 'My Field' in web
const field:IFieldInfo = await sp.web.lists.getByTitle("My List").fields.createFieldAsXml(
    `<Field Type="Note" Name="MyField" DisplayName="My Field" Required="FALSE" RichText="TRUE" RichTextMode="FullHtml" />`
);

// log the field Id to console
console.log(field.Id);
```

### Add a Number Field

Use the addNumber method to create a new number field.

```TypeScript
import { spfi } from "@pnp/sp";
import { FieldTypes, IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// create a new number field called 'My Field' in web
const field:IFieldInfo = await sp.web.fields.addNumber("My Field", { MinimumValue: 1, MaximumValue: 100, Group: "My Group" });
// create a new number field called 'My Field' in list 'My List'
const field2:IFieldInfo = await sp.web.lists.getByTitle("My List").fields.addNumber("My Field", { MinimumValue: 1, MaximumValue: 100, Group: "My Group" });

// log the field Id to console
console.log(field.Id);
```

### Add a URL Field

Use the addUrl method to create a new url field.

```TypeScript
import { spfi } from "@pnp/sp";
import { UrlFieldFormatType, IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// create a new url field called 'My Field' in web
const field:IFieldInfo = await sp.web.fields.addUrl("My Field", { DisplayFormat: UrlFieldFormatType.Hyperlink, Group: "My Group" });
// create a new url field called 'My Field' in list 'My List'
const field2:IFieldInfo = await sp.web.lists.getByTitle("My List").fields.addUrl("My Field", { DisplayFormat: UrlFieldFormatType.Hyperlink, Group: "My Group" });

// log the field Id to console
console.log(field);
```

### Add a User Field

Use the addUser method to create a new user field.

```TypeScript
import { spfi } from "@pnp/sp";
import { FieldUserSelectionMode, IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// create a new user field called 'My Field' in web
const field:IFieldInfo = await sp.web.fields.addUser("My Field", { SelectionMode: FieldUserSelectionMode.PeopleOnly, Group: "My Group" });
// create a new user field called 'My Field' in list 'My List'
const field2:IFieldInfo = await sp.web.lists.getByTitle("My List").fields.addUser("My Field", { SelectionMode: FieldUserSelectionMode.PeopleOnly, Group: "My Group" });

// log the field Id to console
console.log(field.Id);

// **
// Adding a lookup that supports multiple values takes two calls:
const fieldAdd = await sp.web.fields.addUser("Multi User Field", { SelectionMode: FieldUserSelectionMode.PeopleOnly });
await sp.web.fields.getById(fieldAdd.Id).update({ AllowMultipleValues: true }, "SP.FieldUser");
```

### Add a Lookup Field

Use the addLookup method to create a new lookup field.

```TypeScript
import { spfi } from "@pnp/sp";
import { FieldTypes, IFieldInfo } from "@pnp/sp/fields/types";

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

const list = await sp.web.lists.getByTitle("My Lookup List")();
// create a new lookup field called 'My Field' based on an existing list 'My Lookup List' showing 'Title' field in web.
const field = await sp.web.fields.addLookup("My Field", { LookupListId: list.Id, LookupFieldName: "Title" });
// create a new lookup field called 'My Field' based on an existing list 'My Lookup List' showing 'Title' field in list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.addLookup("My Field", {LookupListId: list.Id, LookupFieldName: "Title"});

// log the field Id to console
console.log(field.Id);

// **
// Adding a lookup that supports multiple values takes two calls:
const fieldAdd = await sp.web.fields.addLookup("Multi Lookup Field", { LookupListId: list.Id, LookupFieldName: "Title" });
await sp.web.fields.getById(fieldAdd.Id).update({ AllowMultipleValues: true }, "SP.FieldLookup");
```

### Add a Choice Field

Use the addChoice method to create a new choice field.

```TypeScript
import { spfi } from "@pnp/sp";
import { ChoiceFieldFormatType } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

const choices = [`ChoiceA`, `ChoiceB`, `ChoiceC`];
// create a new choice field called 'My Field' in web
const field = await sp.web.fields.addChoice("My Field", { Choices: choices, EditFormat: ChoiceFieldFormatType.Dropdown, FillInChoice: false, Group: "My Group" });
// create a new choice field called 'My Field' in list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.addChoice("My Field", { Choices: choices, EditFormat: ChoiceFieldFormatType.Dropdown, FillInChoice: false, Group: "My Group" });

// log the field Id to console
console.log(field.Id);
```

### Add a Multi-Choice Field

Use the addMultiChoice method to create a new multi-choice field.

```TypeScript
import { spfi } from "@pnp/sp";
import { ChoiceFieldFormatType } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

const choices = [`ChoiceA`, `ChoiceB`, `ChoiceC`];
// create a new multi-choice field called 'My Field' in web
const field = await sp.web.fields.addMultiChoice("My Field", { Choices: choices, FillInChoice: false, Group: "My Group" });
// create a new multi-choice field called 'My Field' in list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.addMultiChoice("My Field", { Choices: choices, FillInChoice: false, Group: "My Group" });

// log the field Id to console
console.log(field.Id);
```

### Add a Boolean Field

Use the addBoolean method to create a new boolean field.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// create a new boolean field called 'My Field' in web
const field = await sp.web.fields.addBoolean("My Field", { Group: "My Group" });
// create a new boolean field called 'My Field' in list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.addBoolean("My Field", { Group: "My Group" });

// log the field Id to console
console.log(field.Id);
```

### Add a Dependent Lookup Field

Use the addDependentLookupField method to create a new dependent lookup field.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

const field = await sp.web.fields.addLookup("My Field", { LookupListId: list.Id, LookupFieldName: "Title" });
// create a new dependent lookup field called 'My Dep Field' showing 'Description' based on an existing 'My Field' lookup field in web.
const fieldDep = await sp.web.fields.addDependentLookupField("My Dep Field", field.Id as string, "Description");
// create a new dependent lookup field called 'My Dep Field' showing 'Description' based on an existing 'My Field' lookup field in list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.addLookup("My Field", { LookupListId: list.Id, LookupFieldName: "Title" });
const fieldDep2 = await sp.web.lists.getByTitle("My List").fields.addDependentLookupField("My Dep Field", field2.Id as string, "Description");

// log the fieldDep Id to console
console.log(fieldDep.Id);
```

### Add a Location Field

Use the addLocation method to create a new location field.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// create a new location field called 'My Field' in web
const field = await sp.web.fields.addLocation("My Field", { Group: "My Group" });
// create a new location field called 'My Field' in list 'My List'
const field2 = await sp.web.lists.getByTitle("My List").fields.addLocation("My Field", { Group: "My Group" });

// log the field Id to console
console.log(field.Id);
```

### Delete a Field

Use the delete method to delete a field.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/fields";

const sp = spfi(...);

await sp.web.fields.addBoolean("Temp Field", { Group: "My Group" });
await sp.web.fields.addBoolean("Temp Field 2", { Group: "My Group" });
await sp.web.lists.getByTitle("My List").fields.addBoolean("Temp Field", { Group: "My Group" });
await sp.web.lists.getByTitle("My List").fields.addBoolean("Temp Field 2", { Group: "My Group" });

// delete one or more fields from web, returns boolean
const result = await sp.web.fields.getByTitle("Temp Field").delete();
const result2 = await sp.web.fields.getByTitle("Temp Field 2").delete();


// delete one or more fields from list 'My List', returns boolean
const result = await sp.web.lists.getByTitle("My List").fields.getByTitle("Temp Field").delete();
const result2 = await sp.web.lists.getByTitle("My List").fields.getByTitle("Temp Field 2").delete();
```

### Update a Field

Use the update method to update a field.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// update the field called 'My Field' with a description in web, returns IFieldInfo
const fieldUpdate = await sp.web.fields.getByTitle("My Field").update({ Description: "My Description" });
// update the field called 'My Field' with a description in list 'My List', returns IFieldInfo
const fieldUpdate2 = await sp.web.lists.getByTitle("My List").fields.getByTitle("My Field").update({ Description: "My Description" });

// if you need to update a field with properties for a specific field type you can optionally include the field type as a second param
// if you do not include it we will look up the type, but that adds a call to the server
const fieldUpdate2 = await sp.web.lists.getByTitle("My List").fields.getByTitle("My Look up Field").update({ RelationshipDeleteBehavior: 1 }, "SP.FieldLookup");
```

### Show a Field in the Display Form

Use the setShowInDisplayForm method to add a field to the display form.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// show field called 'My Field' in display form throughout web
await sp.web.fields.getByTitle("My Field").setShowInDisplayForm(true);
// show field called 'My Field' in display form for list 'My List'
await sp.web.lists.getByTitle("My List").fields.getByTitle("My Field").setShowInDisplayForm(true);
```

### Show a Field in the Edit Form

Use the setShowInEditForm method to add a field to the edit form.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// show field called 'My Field' in edit form throughout web
await sp.web.fields.getByTitle("My Field").setShowInEditForm(true);
// show field called 'My Field' in edit form for list 'My List'
await sp.web.lists.getByTitle("My List").fields.getByTitle("My Field").setShowInEditForm(true);
```

### Show a Field in the New Form

Use the setShowInNewForm method to add a field to the display form.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";

const sp = spfi(...);

// show field called 'My Field' in new form throughout web
await sp.web.fields.getByTitle("My Field").setShowInNewForm(true);
// show field called 'My Field' in new form for list 'My List'
await sp.web.lists.getByTitle("My List").fields.getByTitle("My Field").setShowInNewForm(true);
```
