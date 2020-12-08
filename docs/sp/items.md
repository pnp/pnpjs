# @pnp/sp/items

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 1|import { sp } from "@pnp/sp";<br />import "@pnp/sp/webs";<br />import "@pnp/sp/lists";<br />import "@pnp/sp/items";<br />
|Preset: All|import { sp } from "@pnp/sp/presets/all";|
|Preset: Core|import { sp } from "@pnp/sp/presets/core";|

## GET

Getting items from a list is one of the basic actions that most applications require. This is made easy through the library and the following examples demonstrate these actions.

### Basic Get

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

// get all the items from a list
const items: any[] = await sp.web.lists.getByTitle("My List").items.get();
console.log(items);

// get a specific item by id.
const item: any = await sp.web.lists.getByTitle("My List").items.getById(1).get();
console.log(item);

// use odata operators for more efficient queries
const items2: any[] = await sp.web.lists.getByTitle("My List").items.select("Title", "Description").top(5).orderBy("Modified", true).get();
console.log(items2);
```

### Get Paged Items

Working with paging can be a challenge as it is based on skip tokens and item ids, something that is hard to guess at runtime. To simplify things you can use the getPaged method on the Items class to assist. Note that there isn't a way to move backwards in the collection, this is by design. The pattern you should use to support backwards navigation in the results is to cache the results into a local array and use the standard array operators to get previous pages. Alternatively you can append the results to the UI, but this can have performance impact for large result sets.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

// basic case to get paged items form a list
let items = await sp.web.lists.getByTitle("BigList").items.getPaged();

// you can also provide a type for the returned values instead of any
let items = await sp.web.lists.getByTitle("BigList").items.getPaged<{Title: string}[]>();

// the query also works with select to choose certain fields and top to set the page size
let items = await sp.web.lists.getByTitle("BigList").items.select("Title", "Description").top(50).getPaged<{Title: string}[]>();

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
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";

// Using RowLimit. Enables paging
let changes = await sp.web.lists.getByTitle("BigList").getListItemChangesSinceToken({RowLimit: '5'});

// Use QueryOptions to make a XML-style query.
// Because it's XML we need to escape special characters
// Instead of & we use &amp; in the query
let changes = await sp.web.lists.getByTitle("BigList").getListItemChangesSinceToken({QueryOptions: '<Paging ListItemCollectionPositionNext="Paged=TRUE&amp;p_ID=5" />'});

// Get everything. Using null with ChangeToken gets everything
let changes = await sp.web.lists.getByTitle("BigList").getListItemChangesSinceToken({ChangeToken: null});

```

### Get All Items

Using the items collection's getAll method you can get all of the items in a list regardless of the size of the list. Sample usage is shown below. Only the odata operations top, select, and filter are supported. usingCaching and inBatch are ignored - you will need to handle caching the results on your own. This method will write a warning to the Logger and should not frequently be used. Instead the standard paging operations should be used.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

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
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const items = await sp.web.lists.getByTitle("LookupList").items.select("Title", "Lookup/Title", "Lookup/ID").expand("Lookup").get();
console.log(items);

const item = await sp.web.lists.getByTitle("LookupList").items.getById(1).select("Title", "Lookup/Title", "Lookup/ID").expand("Lookup").get();
console.log(item);
```

### Filter using Metadata fields

To filter on a metadata field you must use the getItemsByCAMLQuery method as $filter does not support these fields.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";

const r = await sp.web.lists.getByTitle("TaxonomyList").getItemsByCAMLQuery({
    ViewXml: `<View><Query><Where><Eq><FieldRef Name="MetaData"/><Value Type="TaxonomyFieldType">Term 2</Value></Eq></Where></Query></View>`,
});
```

### Retrieving PublishingPageImage

The PublishingPageImage and some other publishing-related fields aren't stored in normal fields, rather in the MetaInfo field. To get these values you need to use the technique shown below, and originally outlined in [this thread](https://github.com/SharePoint/PnP-JS-Core/issues/178). Note that a lot of information can be stored in this field so will pull back potentially a significant amount of data, so limit the rows as possible to aid performance.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from "@pnp/sp/webs";
try {
  const w = Web("https://{publishing site url}");
  const r = await w.lists.getByTitle("Pages").items
    .select("Title", "FileRef", "FieldValuesAsText/MetaInfo")
    .expand("FieldValuesAsText")
    .get();

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
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItemAddResult } from "@pnp/sp/items";

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
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

await sp.web.lists.getById("4D5A36EA-6E84-4160-8458-65C436DB765C").items.add({
    Title: "Test 1",
    ContentTypeId: "0x01030058FD86C279252341AB303852303E4DAF"
});
```

### User Fields

There are two types of user fields, those that allow a single value and those that allow multiple. For both types, you first need to determine the Id field name, which you can do by doing a GET REST request on an existing item. Typically the value will be the user field internal name with "Id" appended. So in our example, we have two fields User1 and User2 so the Id fields are User1Id and User2Id.

Next, you need to remember there are two types of user fields, those that take a single value and those that allow multiple - these are updated in different ways. For single value user fields you supply just the user's id. For multiple value fields, you need to supply an object with a "results" property and an array. Examples for both are shown below.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { getGUID } from "@pnp/common";

const i = await sp.web.lists.getByTitle("PeopleFields").items.add({
  Title: getGUID(),
  User1Id: 9, // allows a single user
  User2Id: {
    results: [16, 45] // allows multiple users
  }
});

console.log(i);
```

If you want to update or add user field values when using **validateUpdateListItem** you need to use the form shown below. You can specify multiple values in the array.

```TypeScript
import { sp } from "@pnp/sp";

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
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { getGUID } from "@pnp/common";

await sp.web.lists.getByTitle("LookupFields").items.add({
    Title: getGUID(),
    LookupFieldId: 2,       // allows a single lookup value
    MultiLookupFieldId: {
        results: [ 1, 56 ]  // allows multiple lookup value
    }
});
```

### Add Multiple Items

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

let list = sp.web.lists.getByTitle("rapidadd");

const entityTypeFullName = await list.getListItemEntityTypeFullName()

let batch = sp.web.createBatch();

list.items.inBatch(batch).add({ Title: "Batch 6" }, entityTypeFullName).then(b => {
  console.log(b);
});

list.items.inBatch(batch).add({ Title: "Batch 7" }, entityTypeFullName).then(b => {
  console.log(b);
});

await batch.execute();
console.log("Done");
```

## Update

The update method is very similar to the add method in that it takes a plain object representing the fields to update. The property names are the internal names of the fields. If you aren't sure you can always do a get request for an item in the list and see the field names that come back - you would use these same names to update the item.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

let list = sp.web.lists.getByTitle("MyList");

const i = await list.items.getById(1).update({
  Title: "My New Title",
  Description: "Here is a new description"
});

console.log(i);
```

### Getting and updating a collection using filter

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

// you are getting back a collection here
const items: any[] = await sp.web.lists.getByTitle("MyList").items.top(1).filter("Title eq 'A Title'").get();

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
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

let list = sp.web.lists.getByTitle("rapidupdate");

const entityTypeFullName = await list.getListItemEntityTypeFullName()

let batch = sp.web.createBatch();

// note requirement of "*" eTag param - or use a specific eTag value as needed
list.items.getById(1).inBatch(batch).update({ Title: "Batch 6" }, "*", entityTypeFullName).then(b => {
  console.log(b);
});

list.items.getById(2).inBatch(batch).update({ Title: "Batch 7" }, "*", entityTypeFullName).then(b => {
  console.log(b);
});

await batch.execute();
console.log("Done")

```

## Recycle

To send an item to the recycle bin use recycle.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

let list = sp.web.lists.getByTitle("MyList");

const recycleBinIdentifier = await list.items.getById(1).recycle();
```

## Delete

Delete is as simple as calling the .delete method. It optionally takes an eTag if you need to manage concurrency.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

let list = sp.web.lists.getByTitle("MyList");

await list.items.getById(1).delete();
```

## Delete With Params

_Added in 2.0.9_

Deletes the item object with options.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

let list = sp.web.lists.getByTitle("MyList");

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
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";

const response =
  await sp.web.lists
    .getByTitle('[Lists_Title]')
    .fields
    .select('Title, EntityPropertyName')
    .filter(`Hidden eq false and Title eq '[Field's_Display_Name]'`)
    .get();

console.log(response.map(field => {
  return {
    Title: field.Title,
    EntityPropertyName: field.EntityPropertyName
  };
}));
```

Lookup fields' names should be ended with additional `Id` suffix. E.g. for `Editor` EntityPropertyName `EditorId` should be used.

### getParentInfos

_Added in 2.0.12_

Gets information about an item, including details about the parent list, parent list root folder, and parent web.

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/items";

const item: any = await sp.web.lists.getByTitle("My List").items.getById(1).get();
await item.getParentInfos();
```  
