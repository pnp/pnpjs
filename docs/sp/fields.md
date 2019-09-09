# @pnp/sp/lists

Fields in SharePoint can be applied to both webs and lists. When referencing a webs' fields you are effectively looking at site columns which are common fields that can be utilized in any list/library in the site. When referencing a lits' fields you are looking at the fields only associated to that particular list.

## IFields

[![](https://img.shields.io/badge/Invokable-informational.svg)](../invokable.md) [![](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../selective-imports.md)

|Scenario|Import Statement|
|--|--|
|Selective 1|import { sp } from "@pnp/sp";<br />import { Webs, IWebs } from "@pnp/sp/src/webs"; <br />import { Fields, IFields } from "@pnp/sp/src/fields";|
|Selective 2|import { sp } from "@pnp/sp";<br />import "@pnp/sp/src/webs";<br />import "@pnp/sp/src/fields";|
|Preset: All|import { sp, Fields, IFields } from "@pnp/sp/presets/all";|
|Preset: Core|import { sp, Fields, IFields } from "@pnp/sp/presets/core";|

### Get Field by Id

Gets a field from the collection by id (guid). Note that the library will handle a guid formatted with curly braces (i.e. '{03b05ff4-d95d-45ed-841d-3855f77a2483}') as well as without curly braces (i.e. '03b05ff4-d95d-45ed-841d-3855f77a2483'). The Id parameter is also case insensitive.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/fields";

// get the field by Id
const field = sp.web.fields.getById("03b05ff4-d95d-45ed-841d-3855f77a2483");

// we can use this 'field' variable to execute more queries on the field:
const r = await field.select("Title")();

// show the response from the server
console.log(r.Title);
```

### Get Field by Title

You can also get a field from the collection by title.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/fields";

// get the field with the title 'Author'
const field = sp.web.fields.getByTitle("Author");

// we can use this 'field' variable to run more queries on the field:
const r = await field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Get Field by Internal Name or Title

You can also get a field from the collection regardless of if the string is the fields internal name or title which can be different.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/fields";

// get the field with the internal name 'ModifiedBy'
const field = sp.web.fields.getByInternalNameOrTitle("ModifiedBy");

// we can use this 'field' variable to run more queries on the field:
const r = await field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Create a Field using an XML schema

Create a new field by defining an XML schema that assigns all the properties for the field.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/fields";

// define the schema for your new field
const fieldSchema = `<Field ID="{03b09ff4-d99d-45ed-841d-3855f77a2483}" \
      Name="MyField" DisplayName="My New Field" \
      Type="Currency" Decimals="2" Min="0" Required="FALSE" Group="My Group" />`;

// create the new field in the web
const field = await sp.web.fields.createFieldAsXml(testFieldSchema);

// we can use this 'field' variable to run more queries on the list:
const r = await field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a Field

Use the add method to create a new field where you define the field type

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/fields";

// create a new field called 'My Field'
const field = await sp.web.fields.add("My Field", "SP.FieldText", { FieldTypeKind: 3, Group: "My Group" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a Text Field

Use the add method to create a new text field.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/fields";

// create a new text field called 'My Field'
const field = await sp.web.fields.addText("My Field", 255, { Group: "My Group" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a Calculated Field

Use the add method to create a new calculated field.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/fields";

// create a new calculated field called 'My Field'
const field = await sp.web.fields.addCalculated("My Field", "=Modified+1", DateTimeFieldFormatType.DateOnly, FieldTypes.DateTime, { Group: "MyGroup" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a Date/Time Field

Use the add method to create a new date/time field.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/fields";

// create a new date/time field called 'My Field'
const field = await sp.web.fields.addDateTime("My Field", DateTimeFieldFormatType.DateOnly, CalendarType.Gregorian, DateTimeFieldFriendlyFormatType.Disabled, { Group: "My Group" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.select("Id")();

// log the field Id to console
console.log(r.Id);
```

### Add a Currency Field

Use the add method to create a new currency field.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/fields";

// create a new date/time field called 'My Field'
const field = await sp.web.fields.addCurrency("My Field", 0, 100, 1033, { Group: "My Group" });

// we can use this 'field' variable to run more queries on the field:
const r = await field.select("Id")();

// log the field Id to console
console.log(r.Id);
```