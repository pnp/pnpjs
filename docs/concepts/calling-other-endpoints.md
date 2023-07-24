# Calling other endpoints not currently implemented in PnPjs library

If you find that there are endpoints that have not yet been implemented, or have changed in such a way that there are issues using the implemented endpoint, you can still make those calls and take advantage of the plumbing provided by the library.

## SharePoint

To issue calls against the SharePoint REST endpoints you would use one of the existing [operations](https://github.com/pnp/pnpjs/blob/version-3/packages/sp/operations.ts):

- spGet
- spPost
- spDelete
- spPatch
and the extended post methods with additional headers.
- spPostMerge
- spPostDelete
- spPostDeleteETag

To construct a call you will need to pass, to the operation call an SPQueryable and optionally a RequestInit object which will be merged with any existing registered init object. To learn more about queryable and the options for constructing one, check out the [documentation](../queryable/queryable.md).

Below are a couple of examples to get you started.

### Example spGet

Let's pretend that the getById method didn't exist on a lists items. The example below shows two methods for constructing our SPQueryable method.

The first is the easiest to use because, as the queryable documentation tells us, this will maintain all the registered observers on the original queryable instance. We would start with the queryable object closest to the endpoint we want to use, in this case `list`. We do this because we need to construct the full URL that will be called. Using `list` in this instance gives us the first part of the URL (e.g. `https://contoso.sharepoint.com/sites/testsite/_api/web/lists/getByTitle('My List')`) and then we can construct the remainder of the call by passing in a string.

The second method essentially starts from scratch where the user constructs the entire url and then registers observers on the SPQuerable instance. Then uses spGet to execute the call. There are many other variations to arrive at the same outcome, all are dependent on your requirements.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import { spGet, SPQueryable, SPFx, AssignFrom } from "@pnp/sp";

// Establish SPFI instance passing in the appropriate behavior to register the initial observers.
const sp = spfi(...);

// create an instance of the items queryable

const list = sp.web.lists.getByTitle("My List");

// get the item with an id of 1, easiest method
const item: any = await spGet(SPQueryable(list, "items(1)"));

// get the item with an id of 1, constructing a new queryable and registering behaviors
const spQueryable = SPQueryable("https://contoso.sharepoint.com/sites/testsite/_api/web/lists/getByTitle('My List')/items(1)").using(SPFx(this.context));

// ***or***

// For v3 the full url is require for SPQuerable when providing just a string
const spQueryable = SPQueryable("https://contoso.sharepoint.com/sites/testsite/_api/web/lists/getByTitle('My List')/items(1)").using(AssignFrom(sp));

// and then use spQueryable to make the request
const item: any = await spGet(spQueryable);
```

The resulting call will be to the endpoint:
`https://contoso.sharepoint.com/sites/testsite/_api/web/lists/getByTitle('My List')/items(1)`

### Example spPost

Let's now pretend that we need to get the changes on a list and want to call the `getchanges` method off list.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import { IChangeQuery, spPost, SPQueryable } from "@pnp/sp";
import { body } from "@pnp/queryable";

// Establish SPFI instance passing in the appropriate behavior to register the initial observers.
const sp = spfi(...);


// build the changeQuery object, here we look att changes regarding Add, DeleteObject and Restore
const query: IChangeQuery = {
    Add: true,
    ChangeTokenEnd: null,
    ChangeTokenStart: null,
    DeleteObject: true,
    Rename: true,
    Restore: true,
};

// create an instance of the items queryable
const list = sp.web.lists.getByTitle("My List");

// get the item with an id of 1
const changes: any = await spPost(SPQueryable(list, "getchanges"), body({query}));

```

The resulting call will be to the endpoint:
`https://contoso.sharepoint.com/sites/testsite/_api/web/lists/getByTitle('My List')/getchanges`

## Microsoft Graph

To issue calls against the Microsoft Graph REST endpoints you would use one of the existing [operations](https://github.com/pnp/pnpjs/blob/version-3/packages/graph/operations.ts):

- graphGet
- graphPost
- graphDelete
- graphPatch
- graphPut

To construct a call you will need to pass, to the operation call an GraphQueryable and optionally a RequestInit object which will be merged with any existing registered init object. To learn more about queryable and the options for constructing one, check out the [documentation](../queryable/queryable.md).

Below are a couple of examples to get you started.

### Example graphGet

Here's an example for getting the chats for a particular user. This uses the simplest method for constructing the graphQueryable which is to start with a instance of a queryable that is close to the endpoint we want to call, in this case `user` and then adding the additional path as a string. For a more advanced example see `spGet` above.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import { GraphQueryable, graphGet } from "@pnp/graph";

// Establish GRAPHFI instance passing in the appropriate behavior to register the initial observers.
const graph = graphfi(...);

// create an instance of the user queryable
const user = graph.users.getById('jane@contoso.com');

// get the chats for the user
const chat: any = await graphGet(GraphQueryable(user, "chats"));
```

The results call will be to the endpoint:
`https://graph.microsoft.com/v1.0/users/jane@contoso.com/chats`

### Example graphPost

This is an example of adding an event to a calendar.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/calendars";
import { GraphQueryable, graphPost } from "@pnp/graph";
import { body, InjectHeaders } from "@pnp/queryable";

// Establish GRAPHFI instance passing in the appropriate behavior to register the initial observers.
const graph = graphfi(...);

// create an instance of the user queryable
const calendar = graph.users.getById('jane@contoso.com').calendar;

const props = {
  "subject": "Let's go for lunch",
  "body": {
    "contentType": "HTML",
    "content": "Does noon work for you?"
  },
  "start": {
      "dateTime": "2017-04-15T12:00:00",
      "timeZone": "Pacific Standard Time"
  },
  "end": {
      "dateTime": "2017-04-15T14:00:00",
      "timeZone": "Pacific Standard Time"
  },
  "location":{
      "displayName":"Harry's Bar"
  },
  "attendees": [
    {
      "emailAddress": {
        "address":"samanthab@contoso.onmicrosoft.com",
        "name": "Samantha Booth"
      },
      "type": "required"
    }
  ],
  "allowNewTimeProposals": true,
  "transactionId":"7E163156-7762-4BEB-A1C6-729EA81755A7"
};

// custom request init to add timezone header.
const graphQueryable = GraphQueryable(calendar, "events").using(InjectHeaders({
    "Prefer": 'outlook.timezone="Pacific Standard Time"',
}));

// adds a new event to the user's calendar
const event: any = await graphPost(graphQueryable, body(props));
```

The results call will be to the endpoint:
`https://graph.microsoft.com/v1.0/users/jane@contoso.com/calendar/events`

## Advanced Scenario

If you find you need to create an instance of Queryable (for either graph or SharePoint) that would hang off the root of the url you can use the `AssignFrom` or `CopyFrom` [behaviors](../core/behaviors.md).

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import { GraphQueryable, graphPost } from "@pnp/graph";
import { body, InjectHeaders } from "@pnp/queryable";
import { AssignFrom } from "@pnp/core";

// Establish GRAPHFI instance passing in the appropriate behavior to register the initial observers.
const graph = graphfi(...);

const chatsQueryable = GraphQueryable("chats").using(AssignFrom(graph.me));

const chat: any = await graphPost(chatsQueryable, body(chatBody));
```

The results call will be to the endpoint:
`https://graph.microsoft.com/v1.0/chats`
