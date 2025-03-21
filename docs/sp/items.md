# @pnp/sp/items

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## GET

Getting items from a list is one of the basic actions that most applications require. This is made easy through the library and the following examples demonstrate these actions.

### Basic Get

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

// get all the items from a list
const items: any[] = await sp.web.lists.getByTitle("My List").items();
console.log(items);

// get a specific item by id.
const item: any = await sp.web.lists.getByTitle("My List").items.getById(1)();
console.log(item);

// use odata operators for more efficient queries
const items2: any[] = await sp.web.lists.getByTitle("My List").items.select("Title", "Description").top(5).orderBy("Modified", true)();
console.log(items2);
```

### Get Paged Items

Working with paging can be a challenge as it is based on skip tokens and item ids, something that is hard to guess at runtime. To simplify things you can use the Async Iterator functionality on the Items class to assist. For advanced paging techniques using the Async Iterator, please review [Async Paging]('../concepts/async-paging.md')

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

//using async iterator in combination with top() to get pages of items in chunks of up to 5000, if left off returns 100 items per loop.
for await (const items of sp.web.lists.getByTitle("BigList").items.top(10)) {
  console.log(items); //array of 10 items
  break; // closes the iterator, returns -- stops retrieving pages
} 

// One example of how to type "items"
let items: IMyItem;
for await (items of sp.web.lists.getByTitle("BigList").items()) {
  //...process item batch...
}
```

### getListItemChangesSinceToken

The GetListItemChangesSinceToken method allows clients to track changes on a list. Changes, including deleted items, are returned along with a token that represents the moment in time when those changes were requested. By including this token when you call GetListItemChangesSinceToken, the server looks for only those changes that have occurred since the token was generated. Sending a GetListItemChangesSinceToken request without including a token returns the list schema, the full list contents and a token.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";

const sp = spfi(...);

// Using RowLimit. Enables paging
const changes = await sp.web.lists.getByTitle("BigList").getListItemChangesSinceToken({RowLimit: '5'});

// Use QueryOptions to make a XML-style query.
// Because it's XML we need to escape special characters
// Instead of & we use &amp; in the query
const changes = await sp.web.lists.getByTitle("BigList").getListItemChangesSinceToken({QueryOptions: '<Paging ListItemCollectionPositionNext="Paged=TRUE&amp;p_ID=5" />'});

// Get everything. Using null with ChangeToken gets everything
const changes = await sp.web.lists.getByTitle("BigList").getListItemChangesSinceToken({ChangeToken: null});

```

### Retrieving Lookup Fields

When working with lookup fields you need to use the expand operator along with select to get the related fields from the lookup column. This works for both the items collection and item instances.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

const items = await sp.web.lists.getByTitle("LookupList").items.select("Title", "Lookup/Title", "Lookup/ID").expand("Lookup")();
console.log(items);

const item = await sp.web.lists.getByTitle("LookupList").items.getById(1).select("Title", "Lookup/Title", "Lookup/ID").expand("Lookup")();
console.log(item);
```

### Filter using Metadata fields

To filter on a metadata field you must use the getItemsByCAMLQuery method as $filter does not support these fields.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";

const sp = spfi(...);

const r = await sp.web.lists.getByTitle("TaxonomyList").getItemsByCAMLQuery({
    ViewXml: `<View><Query><Where><Eq><FieldRef Name="MetaData"/><Value Type="TaxonomyFieldType">Term 2</Value></Eq></Where></Query></View>`,
});
```

### Filter using fluent filter

>Note: This feature is currently in preview and may not work as expected.

PnPjs supports a fluent filter for all OData endpoints, including the items endpoint. this allows you to write a strongly fluent filter that will be parsed into an OData filter.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";

const sp = spfi(...);

const r = await  sp.web.lists.filter(l => l.number("ItemCount").greaterThan(5000))();
```

The following field types are supported in the fluent filter:

- Text
- Choice
- MultiChoice
- Number
- Date
- Boolean
- Lookup
- LookupId

The following operations are supported in the fluent filter:

| Field Type           | Operators/Values                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------- |
| All field types      | `equals`, `notEquals`, `in`, `notIn`                                                         |
| Text & choice fields | `startsWith`, `contains`                                                                     |
| Numeric fields       | `greaterThan`, `greaterThanOrEquals`, `lessThan`, `lessThanOrEquals`                         |
| Date fields          | `greaterThan`, `greaterThanOrEquals`, `lessThan`, `lessThanOrEquals`, `isBetween`, `isToday` |
| Boolean fields       | `isTrue`, `isFalse`, `isFalseOrNull`                                                         |
| Lookup               | `id`, Text and Number field types                                                            |

#### Complex Filter

For all the regular endpoints, the fluent filter will infer the type automatically, but for the list items filter, you'll need to provide your own types to make the parser work.

You can use the `and` and `or` operators to create complex filters that nest different grouping.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

interface ListItem extends IListItem {
    FirstName: string;
    LastName: string;
    Age: number;
    Manager: IListItem;
    StartDate: Date;
}


// Get all employees named John
const r = await sp.web.lists.getByTitle("ListName").items.filter<ListItem>(f => f.text("FirstName").equal("John"))();

// Get all employees not named John who are over 30
const r1 = await sp.web.lists.getByTitle("ListName").items.filter<ListItem>(f => f.text("FirstName").notEquals("John").and().number("Age").greaterThan(30))();

// Get all employees that are named John Doe or Jane Doe
const r2 = await sp.web.lists.getByTitle("ListName").items.filter<ListItem>(f => f.or(
    f.and(
        f.text("FirstName").equals("John"),
        f.text("LastName").equals("Doe")
    ),
    f.and(
        f.text("FirstName").equals("Jane"),
        f.text("LastName").equals("Doe")
    )
))();

// Get all employees who are managed by John and start today
const r3 = await sp.web.lists.getByTitle("ListName").items.filter<ListItem>(f => f.lookup("Manager").text("FirstName").equals("John").and().date("StartDate").isToday())();
```

### Retrieving PublishingPageImage

The PublishingPageImage and some other publishing-related fields aren't stored in normal fields, rather in the MetaInfo field. To get these values you need to use the technique shown below, and originally outlined in [this thread](https://github.com/SharePoint/PnP-JS-Core/issues/178). Note that a lot of information can be stored in this field so will pull back potentially a significant amount of data, so limit the rows as possible to aid performance.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from "@pnp/sp/webs";

try {
  const sp = spfi("https://{publishing site url}").using(SPFx(this.context));

  const r = await sp.web.lists.getByTitle("Pages").items
    .select("Title", "FileRef", "FieldValuesAsText/MetaInfo")
    .expand("FieldValuesAsText")
    ();

  // look through the returned items.
  for (var i = 0; i < r.length; i++) {

    // the title field value
    console.log(r[i].Title);

    // find the value in the MetaInfo string using regex
    const matches = /PublishingPageImage:SW\|(.*?)\r\n/ig.exec(r[i].FieldValuesAsText.MetaInfo);
    if (matches !== null && matches.length > 1) {

      // this wil be the value of the PublishingPageImage field
      console.log(matches[1]);
    }
  }
}
catch (e) {
  console.error(e);
}
```

## Add Items

There are several ways to add items to a list. The simplest just uses the _add_ method of the items collection passing in the properties as a plain object.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

// add an item to the list
const item = await sp.web.lists.getByTitle("My List").items.add({
  Title: "Title",
  Description: "Description"
});

console.log(item);
```

### Content Type

You can also set the content type id when you create an item as shown in the example below. For more information on content type IDs reference the [Microsoft Documentation](https://docs.microsoft.com/en-us/previous-versions/office/developer/sharepoint-2010/aa543822(v=office.14)). While this documentation references SharePoint 2010 the structure of the IDs has not changed.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

await sp.web.lists.getById("4D5A36EA-6E84-4160-8458-65C436DB765C").items.add({
    Title: "Test 1",
    ContentTypeId: "0x01030058FD86C279252341AB303852303E4DAF"
});
```

### User Fields

There are two types of user fields, those that allow a single value and those that allow multiple. For both types, you first need to determine the Id field name, which you can do by doing a GET REST request on an existing item. Typically the value will be the user field internal name with "Id" appended. So in our example, we have two fields User1 and User2 so the Id fields are User1Id and User2Id.

Next, you need to remember there are two types of user fields, those that take a single value and those that allow multiple - these are updated in different ways. For single value user fields you supply just the user's id. For multiple value fields, you need to supply an array. Examples for both are shown below.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { getGUID } from "@pnp/core";

const sp = spfi(...);

const i = await sp.web.lists.getByTitle("PeopleFields").items.add({
  Title: getGUID(),
  User1Id: 9, // allows a single user
  User2Id: [16, 45] // allows multiple users
});

console.log(i);
```

If you want to update or add user field values when using **validateUpdateListItem** you need to use the form shown below. You can specify multiple values in the array.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

const result = await sp.web.lists.getByTitle("UserFieldList").items.getById(1).validateUpdateListItem([{
    FieldName: "UserField",
    FieldValue: JSON.stringify([{ "Key": "i:0#.f|membership|person@tenant.com" }]),
},
{
    FieldName: "Title",
    FieldValue: "Test - Updated",
}]);
```

### Lookup Fields

What is said for User Fields is, in general, relevant to Lookup Fields:

- Lookup Field types:
  - Single-valued lookup
  - Multiple-valued lookup
- `Id` suffix should be appended to the end of lookups `EntityPropertyName` in payloads
- Numeric Ids for lookups' items should be passed as values

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { getGUID } from "@pnp/core";

const sp = spfi(...);

await sp.web.lists.getByTitle("LookupFields").items.add({
    Title: getGUID(),
    LookupFieldId: 2,       // allows a single lookup value
    MultiLookupFieldId: [1, 56]  // allows multiple lookup value
});
```

### Add Multiple Items

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";

const sp = spfi(...);

const [batchedSP, execute] = sp.batched();

const list = batchedSP.web.lists.getByTitle("rapidadd");

let res = [];

list.items.add({ Title: "Batch 6" }).then(r => res.push(r));

list.items.add({ Title: "Batch 7" }).then(r => res.push(r));

// Executes the batched calls
await execute();

// Results for all batched calls are available
for(let i = 0; i < res.length; i++) {
    ///Do something with the results
}
```

## Update Items

The update method is very similar to the add method in that it takes a plain object representing the fields to update. The property names are the internal names of the fields. If you aren't sure you can always do a get request for an item in the list and see the field names that come back - you would use these same names to update the item.
>Note: For updating certain types of fields, see the [Add](#add-items) examples above. The payload will be the same you will just need to replace the .add method with .getById({itemId}).update.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

const list = sp.web.lists.getByTitle("MyList");

const i = await list.items.getById(1).update({
  Title: "My New Title",
  Description: "Here is a new description"
});

console.log(i);
```

### Getting and updating a collection using filter

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

// you are getting back a collection here
const items: any[] = await sp.web.lists.getByTitle("MyList").items.top(1).filter("Title eq 'A Title'")();
// Using fluent filter
const items1: any[] = await sp.web.lists.getByTitle("MyList").items.top(1).filter(f => f.text("Title").equals("A Title"))();

// see if we got something
if (items.length > 0) {
  const updatedItem = await sp.web.lists.getByTitle("MyList").items.getById(items[0].Id).update({
    Title: "Updated Title",
  });
  
  console.log(JSON.stringify(updatedItem));
}
```

### Update Multiple Items

This approach avoids multiple calls for the same list's entity type name.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching"

const sp = spfi(...);

const [batchedSP, execute] = sp.batched();

const list = batchedSP.web.lists.getByTitle("rapidupdate");

list.items.getById(1).update({ Title: "Batch 6" }).then(b => {
  console.log(b);
});

list.items.getById(2).update({ Title: "Batch 7" }).then(b => {
  console.log(b);
});

// Executes the batched calls
await execute();

console.log("Done");
```

### Update Taxonomy field

Note: Updating Taxonomy field for a File item should be handled differently. Instead of using update(), use validateUpdateListItem(). Please see below

#### List Item

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

await sp.web.lists.getByTitle("Demo").items.getById(1).update({
    MetaDataColumn: { Label: "Demo", TermGuid: '883e4c81-e8f9-4f19-b90b-6ab805c9f626', WssId: '-1' }
});

```

#### File List Item

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";

const sp = spfi(...);

await (await sp.web.getFileByServerRelativePath("/sites/demo/DemoLibrary/File.txt").getItem()).validateUpdateListItem([{
    FieldName: "MetaDataColumn",
    FieldValue:"Demo|883e4c81-e8f9-4f19-b90b-6ab805c9f626", //Label|TermGuid
}]);
```

### Update Multi-value Taxonomy field

_Based on [this excellent article](https://www.aerieconsulting.com/blog/update-using-rest-to-update-a-multi-value-taxonomy-field-in-sharepoint) from Beau Cameron._

As he says you must update a hidden field to get this to work via REST. My meta data field accepting multiple values is called "MultiMetaData".

#### List Item

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";

const sp = spfi(...);

// first we need to get the hidden field's internal name.
// The Title of that hidden field is, in my case and in the linked article just the visible field name with "_0" appended.
const fields = await sp.web.lists.getByTitle("TestList").fields.filter("Title eq 'MultiMetaData_0'").select("Title", "InternalName")();
// Using fluent filter
const fields1 = await sp.web.lists.getByTitle("TestList").fields.filter(f => f.text("Title").equals("MultiMetaData_0")).select("Title", "InternalName")();

// get an item to update, here we just create one for testing
const newItem = await sp.web.lists.getByTitle("TestList").items.add({
  Title: "Testing",
});
// now we have to create an update object
// to do that for each field value you need to serialize each as -1;#{field label}|{field id} joined by ";#"
// update with the values you want, this also works in the add call directly to avoid a second call
const updateVal = {};
updateVal[fields[0].InternalName] = "-1;#New Term|bb046161-49cc-41bd-a459-5667175920d4;#-1;#New 2|0069972e-67f1-4c5e-99b6-24ac5c90b7c9";
// execute the update call
await sp.web.lists.getByTitle("TestList").items.getById(newItem.Id).update(updateVal);
```

#### File List Item

To update a multi-value taxonomy field on a file item, a different serialization is needed.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";

const sp = spfi(...);

const multiValueTaxonomy = {
  field: "MetaDataColumn",
  values: [
    {
      label: "Demo 1",
      guid: "bb046161-49cc-41bd-a459-5667175920d4"
    }, 
    {
      label: "Demo 2", 
      guid: "0069972e-67f1-4c5e-99b6-24ac5c90b7c9"
    }
  ]
}

// serialize values for field "MetaDataColumn"
// it needs to be serialized as {field label}|{field guid} joined by ;
const newFieldValue = multiValueTaxonomy
  .map((val) => (`${val.label}|${val.guid}`)).join(";")
// this will result to "Demo 1|bb046161-49cc-41bd-a459-5667175920d4;Demo 2|0069972e-67f1-4c5e-99b6-24ac5c90b7c9"

await (await sp.web.getFileByServerRelativePath("/sites/demo/DemoLibrary/File.txt").getItem()).validateUpdateListItem([{
    FieldName: multiValueTaxonomy.field,
    FieldValue: multiValueTaxonomy.guid, //Label|TermGuid;Label 2|TermGuid 2
}]);
```

### Update BCS Field

Please see [the issue](https://github.com/pnp/pnpjs/issues/2143) for full details.

You will need to use `validateUpdateListItem` to ensure hte BCS field is updated correctly.

```TypeScript
const update = await sp.web.lists.getByTitle("Price").items.getById(7).select('*,External').validateUpdateListItem([
      {FieldName:"External",FieldValue:"Fauntleroy Circus"},
      {FieldName:"Customers_ID", FieldValue:"__bk410024003500240054006500"}
    ]); 
```

### Update Location Field

This code shows how to update a location field's coordinates.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);
const coordinates = {
  Latitude: 47.672082,
  Longitude: -122.1409983
}

const projectId = 1;
const project = sp.web.lists.getByTitle("My List").items.getById(projectId).select("Id, ProjectLocation")()
const projectLocation = JSON.parse(project.ProjectLocation);
projectLocation.Coordinates = coordinates;
const ProjectLocation = JSON.stringify(projectLocation);
const update = await sp.web.lists.getByTitle("My List").items.getById(projectId).update({ ProjectLocation });
```

## Recycle

To send an item to the recycle bin use recycle.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

const list = sp.web.lists.getByTitle("MyList");

const recycleBinIdentifier = await list.items.getById(1).recycle();
```

## Delete

Delete is as simple as calling the .delete method. It optionally takes an eTag if you need to manage concurrency.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

const list = sp.web.lists.getByTitle("MyList");

await list.items.getById(1).delete();
```

## Delete With Params

Deletes the item object with options.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

const list = sp.web.lists.getByTitle("MyList");

await list.items.getById(1).deleteWithParams({
                BypassSharedLock: true,
            });
```

> The deleteWithParams method can only be used by accounts where UserToken.IsSystemAccount is true

## Resolving field names

It's a very common mistake trying wrong field names in the requests.
Field's `EntityPropertyName` value should be used.

The easiest way to get know EntityPropertyName is to use the following snippet:

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";

const sp = spfi(...);

const response =
  await sp.web.lists
    .getByTitle('[Lists_Title]')
    .fields
    .select('Title, EntityPropertyName')
    .filter(`Hidden eq false and Title eq '[Field's_Display_Name]'`)
    ();

// Using fluent filter
const response1 =
  await sp.web.lists
    .getByTitle('[Lists_Title]')
    .fields
    .select('Title, EntityPropertyName')
    .filter(l => l.boolean("Hidden").isFalse().and().text("Title").equals("[Field's_Display_Name]"))
    ();

console.log(response.map(field => {
  return {
    Title: field.Title,
    EntityPropertyName: field.EntityPropertyName
  };
}));
```

Lookup fields' names should be ended with additional `Id` suffix. E.g. for `Editor` EntityPropertyName `EditorId` should be used.

### getParentInfos

Gets information about an item, including details about the parent list, parent list root folder, and parent web.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

const item: any = await sp.web.lists.getByTitle("My List").items.getById(1)();
await item.getParentInfos();
```  

### Get Version History

Get's the version history information for a list item

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

const itemVersions: any = await sp.web.lists.getByTitle("My List").items.getById({item id}).versions();
```

### Get Version History Item by Id

Get's the specific version information for a list item

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

const itemVersion: any = await sp.web.lists.getByTitle("My List").items.getById({item id}).versions.getById({version id})();
```

### Delete Version History Item by Id

Get's the specific version information for a list item

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

await sp.web.lists.getByTitle("My List").items.getById({item id}).versions.getById({version id}).delete({eTag});
```
