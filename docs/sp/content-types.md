# @pnp/sp/content-types

Content Types are used to define sets of columns in SharePoint.

## IContentTypes

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 1|import { sp } from "@pnp/sp";<br />import { Webs, IWebs } from "@pnp/sp/webs";<br />import { ContentTypes, IContentTypes } from "@pnp/sp/content-types";|
|Selective 2|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br />import "@pnp/sp/content-types";|
|Preset: All|import { sp, ContentTypes, IContentTypes } from "@pnp/sp/presets/all";|

### Add an existing Content Type to a collection

The following example shows how to add the built in Picture Content Type to the Documents library.

```TypeScript
sp.web.lists.getByTitle("Documents").contentTypes.addAvailableContentType("0x010102");
```

### Get a Content Type by Id

```TypeScript
const d: IContentType = await sp.web.contentTypes.getById("0x01")();

// log content type name to console
console.log(d.name);
```

### Add a new Content Type

To add a new Content Type to a collection, parameters id and name are required. For more information on creating content type IDs reference the [Microsoft Documentation](https://docs.microsoft.com/en-us/previous-versions/office/developer/sharepoint-2010/aa543822(v=office.14)). While this documentation references SharePoint 2010 the structure of the IDs has not changed.

```TypeScript
sp.web.contentTypes.add("0x01008D19F38845B0884EBEBE239FDF359184", "My Content Type");
```

It is also possible to provide a description and group parameter. For other settings, we can use the parameter named 'additionalSettings' which is a TypedHash, meaning you can send whatever properties you'd like in the body (provided that the property is supported by the SharePoint API).

```TypeScript
//Adding a content type with id, name, description, group and setting it to read only mode (using additionalsettings)
sp.web.contentTypes.add("0x01008D19F38845B0884EBEBE239FDF359184", "My Content Type", "This is my content type.", "_PnP Content Types", { ReadOnly: true });
```

## IContentType

|Scenario|Import Statement|
|--|--|
|Selective 1|import { sp } from "@pnp/sp";<br />import { ContentType, IContentType } from "@pnp/sp/content-types";|
|Selective 2|import { sp } from "@pnp/sp";<br />import "@pnp/sp/content-types";|
|Preset: All|import { sp, ContentType, IContentType } from "@pnp/sp/presets/all";|

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

### Get the field links

Use this method to get a collection containing all the field links (SP.FieldLink) for a Content Type.

```TypeScript
// get field links from built in Content Type Document (Id: "0x0101")
const d = await sp.web.contentTypes.getById("0x0101").fieldLinks();

// log collection of fieldlinks to console
console.log(d);
```

### Get Content Type fields

To get a collection with all fields on the Content Type, simply use this method.

```TypeScript
// get fields from built in Content Type Document (Id: "0x0101")
const d = await sp.web.contentTypes.getById("0x0101").fields();

// log collection of fields to console
console.log(d);
```

### Get parent Content Type

```TypeScript
// get parent Content Type from built in Content Type Document (Id: "0x0101")
const d = await sp.web.contentTypes.getById("0x0101").parent();

// log name of parent Content Type to console
console.log(d.Name)
```

### Get Content Type Workflow associations

```TypeScript
// get workflow associations from built in Content Type Document (Id: "0x0101")
const d = await sp.web.contentTypes.getById("0x0101").workflowAssociations();

// log collection of workflow associations to console
console.log(d);
```
