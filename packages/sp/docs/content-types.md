# @pnp/sp/content types

## Set Folder Unique Content Type Order

```TypeScript
interface OrderData {
    ContentTypeOrder: { StringValue: string }[];
    UniqueContentTypeOrder?: { StringValue: string }[];
}

const folder = sp.web.lists.getById("{list id guid}").rootFolder;

// here you need to see if there are unique content type orders already or just the default
const existingOrders = await folder.select("ContentTypeOrder", "UniqueContentTypeOrder").get<OrderData>();

const activeOrder = existingOrders.UniqueContentTypeOrder ? existingOrders.UniqueContentTypeOrder : existingOrders.ContentTypeOrder;

// manipulate the order here however you want (I am just reversing the array as an example)
const newOrder = activeOrder.reverse();

// update the content type order thusly:
await folder.update({
    UniqueContentTypeOrder: {
        __metadata: { type: "Collection(SP.ContentTypeId)" },
        results: newOrder,
    },
});
```
