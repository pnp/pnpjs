# @pnp/sp/items

## GET

Getting items from a list is one of the basic actions that most applications require. This is made easy through the library and the following examples demonstrate these actions.

### Basic Get

```TypeScript
import pnp from "@pnp/sp";

// get all the items from a list
pnp.sp.web.lists.getByTitle("My List").items.get().then((items: any[]) => {
    console.log(items);
});

// get a specific item by id
pnp.sp.web.lists.getByTitle("My List").items.getById(1).get().then((item: any) => {
    console.log(item);
});

// use odata operators for more efficient queries
pnp.sp.web.lists.getByTitle("My List").items.select("Title", "Description").top(5).orderBy("Modified", true).get().then((items: any[]) => {
    console.log(items);
});
```

### Retrieving Lookup Fields

When working with lookup fields you need to use the expand operator along with select to get the related fields from the lookup column. This works for both the items collection and item instances.

```TypeScript
pnp.sp.web.lists.getByTitle("LookupList").items.select("Title", "Lookup/Title", "Lookup/ID").expand("Lookup").get().then((items: any[]) => {
    console.log(items);
});

pnp.sp.web.lists.getByTitle("LookupList").items.getById(1).select("Title", "Lookup/Title", "Lookup/ID").expand("Lookup").get().then((item: any) => {
    console.log(item);
});
```

### Retrieving PublishingPageImage

The PublishingPageImage and some other publishing-related fields aren't stored in normal fields, rather in the MetaInfo field. To get these values you need to use the technique shown below, and originally outlined in [this thread](https://github.com/SharePoint/PnP-JS-Core/issues/178). Note that a lot of information can be stored in this field so will pull back potentially a significant amount of data, so limit the rows as possible to aid performance.

```TypeScript
import { Web } from "@pnp/sp";

const w = new Web("https://{publishing site url}");

w.lists.getByTitle("Pages").items
    .select("Title", "FileRef", "FieldValuesAsText/MetaInfo")
    .expand("FieldValuesAsText")
    .get().then(r => {

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
    }).catch(e => { console.error(e); });
```

## Add Items

There are several ways to add items to a list. The simplest just uses the _add_ method of the items collection passing in the properties as a plain object.

```TypeScript
import { default as pnp, ItemAddResult } from "@pnp/sp";

// add an item to the list
pnp.sp.web.lists.getByTitle("My List").items.add({
    Title: "Title",
    Description: "Description"
}).then((iar: ItemAddResult) => {
    console.log(iar);
});
```

### Content Type

You can also set the content type id when you create an item as shown in the example below:

```TypeScript
pnp.sp.web.lists.getById("4D5A36EA-6E84-4160-8458-65C436DB765C").items.add({
    Title: "Test 1",
    ContentTypeId: "0x01030058FD86C279252341AB303852303E4DAF"
});
```

### User Fields

There are two types of user fields, those that allow a single value and those that allow multiple. For both types, you first need to determine the Id field name, which you can do by doing a GET REST request on an existing item. Typically the value will be the user field internal name with "Id" appended. So in our example, we have two fields User1 and User2 so the Id fields are User1Id and User2Id.

Next, you need to remember there are two types of user fields, those that take a single value and those that allow multiple - these are updated in different ways. For single value user fields you supply just the user's id. For multiple value fields, you need to supply an object with a "results" property and an array. Examples for both are shown below.

```TypeScript
pnp.sp.web.lists.getByTitle("PeopleFields").items.add({
    Title: Util.getGUID(),
    User1Id: 9, // allows a single user
    User2Id: { 
        results: [ 16, 45 ] // allows multiple users
    }
}).then(i => {
    console.log(i);
});
```

### Lookup Fields

What is said for User Fields is, in general, relevant to Lookup Fields:
- Lookup Field types:
  - Single-valued lookup
  - Multiple-valued lookup
- `Id` suffix should be appended to the end of lookup's `EntityPropertyName` in payloads
- Numeric Ids for lookups' items should be passed as values

```TypeScript
pnp.sp.web.lists.getByTitle("LookupFields").items.add({
    Title: Util.getGUID(),
    LookupFieldId: 2,       // allows a single lookup value
    MuptiLookupFieldId: { 
        results: [ 1, 56 ]  // allows multiple lookup value
    }
}).then(console.log).catch(console.log);
```

### Add Multiple Items

```TypeScript
import pnp from "@pnp/sp";

let list = pnp.sp.web.lists.getByTitle("rapidadd");

list.getListItemEntityTypeFullName().then(entityTypeFullName => {

    let batch = pnp.sp.web.createBatch();

    list.items.inBatch(batch).add({ Title: "Batch 6" }, entityTypeFullName).then(b => {
        console.log(b);
    });

    list.items.inBatch(batch).add({ Title: "Batch 7" }, entityTypeFullName).then(b => {
        console.log(b);
    });

    batch.execute().then(d => console.log("Done"));
});
```

## Update

The update method is very similar to the add method in that it takes a plain object representing the fields to update. The property names are the internal names of the fields. If you aren't sure you can always do a get request for an item in the list and see the field names that come back - you would use these same names to update the item.

```TypeScript
import pnp from "@pnp/sp";

let list = pnp.sp.web.lists.getByTitle("MyList");

list.items.getById(1).update({
    Title: "My New Title",
    Description: "Here is a new description"
}).then(i => {
    console.log(i);
});
```

### Getting and updating a collection using filter

```TypeScript
import pnp from "@pnp/sp";

// you are getting back a collection here
pnp.sp.web.lists.getByTitle("MyList").items.top(1).filter("Title eq 'A Title'").get().then((items: any[]) => {
    // see if we got something
    if (items.length > 0) {
        pnp.sp.web.lists.getByTitle("MyList").items.getById(items[0].Id).update({
            Title: "Updated Title",
        }).then(result => {
            // here you will have updated the item
            console.log(JSON.stringify(result));
        });
    }
});
```

### Update Multiple Items

This approach avoids multiple calls for the same list's entity type name.

```TypeScript
import pnp from "@pnp/sp";

let list = pnp.sp.web.lists.getByTitle("rapidupdate");

list.getListItemEntityTypeFullName().then(entityTypeFullName => {

    let batch = pnp.sp.web.createBatch();

    // note requirement of "*" eTag param - or use a specific eTag value as needed
    list.items.getById(1).inBatch(batch).update({ Title: "Batch 6" }, "*", entityTypeFullName).then(b => {
        console.log(b);
    });

    list.items.getById(2).inBatch(batch).update({ Title: "Batch 7" }, "*", entityTypeFullName).then(b => {
        console.log(b);
    });

    batch.execute().then(d => console.log("Done"));
});
```

## Delete

Delete is as simple as calling the .delete method. It optionally takes an eTag if you need to manage concurrency.

```TypeScript
import pnp from "@pnp/sp";

let list = pnp.sp.web.lists.getByTitle("MyList");

list.items.getById(1).delete().then(_ => {});
```

## Resolving field names

It's a very common mistake trying wrong field names in the requests.
Field's `EntityPropertyName` value should be used.

The easiest way to get know EntityPropertyName is to use the following snippet:

```TypeScript
pnp.sp.web.lists
  .getByTitle('[Lists_Title]')
  .fields
  .select('Title, EntityPropertyName')
  .filter(`Hidden eq false and Title eq '[Field's_Display_Name]'`)
  .get()
  .then(response => {
    console.log(response.map(field => {
      return {
        Title: field.Title,
	EntityPropertyName: field.EntityPropertyName
      };
    }));
  })
  .catch(console.log);
```

Lookup fields' names should be ended with additional `Id` suffix. E.g. for `Editor` EntityPropertyName `EditorId` should be used. 
