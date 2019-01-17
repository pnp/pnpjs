# @pnp/sp/fields

Fields allow you to store typed information within a SharePoint list. There are many types of fields and the library seeks to simplify working with the most common types. Fields exist in both site collections (site columns) or lists (list columns) and you can add/modify/delete them at either of these levels.

## Get Fields

```TypeScript
import { sp } from "@pnp/sp";

let web = sp.web;

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

## Filtering Fields 

Sometimes you only want a subset of fields from the collection. Below are some examples of using the filter operator with the fields collection.

```TypeScript
import { sp } from '@pnp/sp';

const list = sp.web.lists.getByTitle('Custom');

// Fields which can be updated
const filter1 = `Hidden eq false and ReadOnlyField eq false`;
list.fields.select('InternalName').filter(filter1).get().then(fields => {
    console.log(`Can be updated: ${fields.map(f => f.InternalName).join(', ')}`);
    // Title, ...Custom, ContentType, Attachments
});
    
// Only custom field
const filter2 = `Hidden eq false and CanBeDeleted eq true`;
list.fields.select('InternalName').filter(filter2).get().then(fields => {
    console.log(`Custom fields: ${fields.map(f => f.InternalName).join(', ')}`);
    // ...Custom
});

// Application specific fields
const includeFields = [ 'Title', 'Author', 'Editor', 'Modified', 'Created' ];
const filter3 = `Hidden eq false and (ReadOnlyField eq false or (${
    includeFields.map(field => `InternalName eq '${field}'`).join(' or ')
}))`;
list.fields.select('InternalName').filter(filter3).get().then(fields => {
    console.log(`Application specific: ${fields.map(f => f.InternalName).join(', ')}`);
    // Title, ...Custom, ContentType, Modified, Created, Author, Editor, Attachments
});

// Fields in a view
list.defaultView.fields.select('Items').get().then(f => {
    const fields = (f as any).Items.results || (f as any).Items;
    console.log(`Fields in a view: ${fields.join(', ')}`);
});
```

## Add Fields

You can add fields using the add, createFieldAsXml, or one of the type specific methods. Functionally there is no difference, however one method may be easier given a certain scenario.

```TypeScript
import { sp } from "@pnp/sp";

let web = sp.web;

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

// Create a lookup field, and a dependent lookup field
web.lists.getByTitle("MyList").fields.addLookup("MyLookup", "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx", "MyLookupTargetField").then(f => {
    console.log(f);
    
    // Create the dependent lookup field
    return web.lists.getByTitle("MyList").fields.addDependentLookupField("MyLookup_ID", f.Id, "ID");
}).then(fDep => {
    console.log(fDep);
});
```

### Adding Multiline Text Fields with FullHtml

Because the RichTextMode property is not exposed to the clients we cannot set this value via the API directly. The work around is to use the createFieldAsXml method as shown below

```TypeScript
import { sp } from "@pnp/sp";

let web = sp.web;

const fieldAddResult = await web.fields.createFieldAsXml(`<Field Type="Note" Name="Content" DisplayName="Content" Required="{TRUE|FALSE}" RichText="TRUE" RichTextMode="FullHtml" />`);
```

## Update a Field

You can also update the properties of a field in both webs and lists, but not all properties are able to be updated after creation. You can review [this list](https://msdn.microsoft.com/en-us/library/office/dn600182.aspx#bk_FieldProperties) for details.

```TypeScript
import { sp } from "@pnp/sp";

let web = sp.web;

web.fields.getByTitle("MyField4").update({ 
    Description: "A new description",
 }).then(f => {

    console.log(f);
});
```

### Update a Url/Picture Field

When updating a URL or Picture field you need to include the __metadata descriptor as shown below.

```TypeScript
import { sp } from "@pnp/sp";

const data = {
    "My_Field_Name": {
        "__metadata": { "type": "SP.FieldUrlValue" },
        "Description": "A Pretty picture",
        "Url": "https://tenant.sharepoint.com/sites/dev/Style%20Library/DSC_0024.JPG",
    },
};

await sp.web.lists.getByTitle("MyListTitle").items.getById(1).update(data);
```

## Delete a Field

```TypeScript
import { sp } from "@pnp/sp";

let web = sp.web;

web.fields.getByTitle("MyField4").delete().then(f => {

    console.log(f);
});
```
