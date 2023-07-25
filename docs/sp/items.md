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

Working with paging can be a challenge as it is based on skip tokens and item ids, something that is hard to guess at runtime. To simplify things you can use the getPaged method on the Items class to assist. Note that there isn't a way to move backwards in the collection, this is by design. The pattern you should use to support backwards navigation in the results is to cache the results into a local array and use the standard array operators to get previous pages. Alternatively you can append the results to the UI, but this can have performance impact for large result sets.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi(...);

// basic case to get paged items form a list
const items = await sp.web.lists.getByTitle("BigList").items.getPaged();

// you can also provide a type for the returned values instead of any
const items = await sp.web.lists.getByTitle("BigList").items.getPaged<{Title: string}[]>();

// the query also works with select to choose certain fields and top to set the page size
const items = await sp.web.lists.getByTitle("BigList").items.select("Title", "Description").top(50).getPaged<{Title: string}[]>();

// the results object will have two properties and one method:

// the results property will be an array of the items returned
if (items.results.length > 0) {
    console.log("We got results!");

    for (let i = 0; i < items.results.length; i++) {
        // type checking works here if we specify the return type
        console.log(items.results[i].Title);
    }
}

// the hasNext property is used with the getNext method to handle paging
// hasNext will be true so long as there are additional results
if (items.hasNext) {

    // this will carry over the type specified in the original query for the results array
    items = await items.getNext();
    console.log(items.results.length);
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

### Get All Items

Using the items collection's getAll method you can get all of the items in a list regardless of the size of the list. Sample usage is shown below. Only the odata operations top, select, and filter are supported. usingCaching and inBatch are ignored - you will need to handle caching the results on your own. This method will write a warning to the Logger and should not frequently be used. Instead the standard paging operations should be used.

> In v3 there is a separate import for get-all to include the functionality. This is to remove the code from bundles for folks who do not need it.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";

const sp = spfi(...);

// basic usage
const allItems: any[] = await sp.web.lists.getByTitle("BigList").items.getAll();
console.log(allItems.length);

// set page size
const allItems: any[] = await sp.web.lists.getByTitle("BigList").items.getAll(4000);
console.log(allItems.length);

// use select and top. top will set page size and override the any value passed to getAll
const allItems: any[] = await sp.web.lists.getByTitle("BigList").items.select("Title").top(4000).getAll();
console.log(allItems.length);

// we can also use filter as a supported odata operation, but this will likely fail on large lists
const allItems: any[] = await sp.web.lists.getByTitle("BigList").items.select("Title").filter("Title eq 'Test'").getAll();
console.log(allItems.length);
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
import { IItemAddResult } from "@pnp/sp/items";

const sp = spfi(...);

// add an item to the list
const iar: IItemAddResult = await sp.web.lists.getByTitle("My List").items.add({
  Title: "Title",
  Description: "Description"
});

console.log(iar);
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

List Item
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
File List Item
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
await newItem.item.update(updateVal);
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
import "@pnp/sp/items";

const sp = spfi(...);

const item: any = await sp.web.lists.getByTitle("My List").items.getById(1)();
await item.getParentInfos();
```  
