# @pnp/sp/fields

Fields allow you to store typed information within a SharePoint list. There are many types of fields and the library seeks to simplify working with the most common types. Fields exist in both site collections (site columns) or lists (list columns) and you can add/modify/delete them at either of these levels.

## Get Fields

```TypeScript
import pnp from "@pnp/sp";

let web = pnp.sp.web;

// get all the fields in a web
web.fields.get().then(f => {

    console.log(f);
});

// you can use odata operators on the fields collection
web.fields.select("Title", "InternalName", "TypeAsString").top(10).orderBy("Id").get().then(f => {

    console.log(f);
});

// get all the available fields in a web (includes parent web's fields)
web.availablefields.get().then(f => {

    console.log(f);
});

// get the fields in a list
web.lists.getByTitle("MyList").fields.get().then(f => {

    console.log(f);
});

// you can also get individual fields using getById, getByTitle, or getByInternalNameOrTitle
web.fields.getById("dee9c205-2537-44d6-94e2-7c957e6ebe6e").get().then(f => {

    console.log(f);
});

web.fields.getByTitle("MyField4").get().then(f => {

    console.log(f);
});

web.fields.getByInternalNameOrTitle("MyField4").get().then(f => {

    console.log(f);
});
```

## Add Fields

You can add fields using the add, createFieldAsXml, or one of the type specific methods. Functionally there is no difference, however one method may be easier given a certain scenario.

```TypeScript
import pnp from "@pnp/sp";

let web = pnp.sp.web;

// if you use add you _must_ include the correct FieldTypeKind in the extended properties
web.fields.add("MyField1", "SP.FieldText", { 
    Group: "~Example",
    FieldTypeKind: 2,
    Filterable: true,
    Hidden: false,
    EnforceUniqueValues: true,
}).then(f => {

    console.log(f);
});

// you can also use the addText or any of the other type specific methods on the collection
web.fields.addText("MyField2", 75, { 
    Group: "~Example"
}).then(f => {

    console.log(f);
});

// if you have the field schema (for example from an old elements file) you can use createFieldAsXml
let xml = `<Field DisplayName="MyField4" Type="Text" Required="FALSE" StaticName="MyField4" Name="MyField4" MaxLength="125" Group="~Example" />`;

web.fields.createFieldAsXml(xml).then(f => {

    console.log(f);
});

// the same operations work on a list's fields collection
web.lists.getByTitle("MyList").fields.addText("MyField5", 100).then(f => {

    console.log(f);
});
```

## Update a Field

You can also update the properties of a field in both webs and lists, but not all properties are able to be updated after creation. You can review [this list](https://msdn.microsoft.com/en-us/library/office/dn600182.aspx#bk_FieldProperties) for details.

```TypeScript
import pnp from "@pnp/sp";

let web = pnp.sp.web;

web.fields.getByTitle("MyField4").update({ 
    Description: "A new description",
 }).then(f => {

    console.log(f);
});
```

## Delete a Field

```TypeScript
import pnp from "@pnp/sp";

let web = pnp.sp.web;

web.fields.getByTitle("MyField4").delete().then(f => {

    console.log(f);
});
```
