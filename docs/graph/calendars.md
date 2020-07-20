# @pnp/graph/calendars

 Calendars exist in Outlook and can belong to either a user or group. With `@pnp/graph@<=2.0.6 `, only events for a user and group's default calendar could be fetched/created/updated. In versions `2.0.7` and up, all calendars and their events can be fetched.

More information can be found in the official Graph documentation:

- [Calendar Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/calendar?view=graph-rest-1.0)
- [Event Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/event?view=graph-rest-1.0)

## Get All Calendars For a User

```ts
import { graph } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const calendars = await graph.users.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').calendars();
```

## Get a Specific Calendar For a User

```ts
import { graph } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const CALENDAR_ID = 'AQMkAGZjNmY0MDN3LRI3YTYtNDQAFWQtOWNhZC04MmY3MGYxODkeOWUARgAAA-xUBMMopY1NkrWA0qGcXHsHAG4I-wMXjoRMkgRnRetM5oIAAAIBBgAAAG4I-wMXjoRMkgRnRetM5oIAAAIsYgAAAA==';

const calendar = await graph.users.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').calendars.getById(CALENDAR_ID)();
```

## Get a User's Default Calendar

```ts
import { graph } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const calendar = await graph.users.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').calendar();
```

## Get Events For a User's Default Calendar

```ts
import { graph } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/users';

// You can do one of
const events = await graph.users.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').calendar.events();
// or
const events = await graph.users.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').events();
```

## Get Calendar for a Group

```ts
import { graph } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/groups';

const calendar = await graph.groups.getById('21aaf779-f6d8-40bd-88c2-4a03f456ee82').calendar();
```

## Get Events for a Group

```ts
import { graph } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/groups';

// You can do one of
const events = await graph.groups.getById('21aaf779-f6d8-40bd-88c2-4a03f456ee82').calendar.events();
// or
const events = await graph.groups.getById('21aaf779-f6d8-40bd-88c2-4a03f456ee82').events();
```

## Create Events

This will work on any `IEvents` objects, ie anything accessed using an `events` key.

```ts
import { graph } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/users';

await graph.users.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').calendar.events.add(
{
  "subject": "Let's go for lunch",
  "body": {
    "contentType": "HTML",
    "content": "Does late morning work for you?"
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
  ]
});
```

## Update Events

This will work on any `IEvents` objects, ie anything accessed using an `events` key. 

```ts
import { graph } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const EVENT_ID = 'BBMkAGZjNmY6MDM3LWI3YTYtNERhZC05Y2FkLTgyZjcwZjE4OTI5ZQBGAAAAAAD8VQTDKKWNTY61gNKhnFzLBwBuCP8DF46ETJIEZ0XrTOaCAAAAAAENAABuCP8DF46ETJFEZ0EnTOaCAAFvdoJvAAA=';

await graph.users.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').calendar.events.getById(EVENT_ID).update({
    reminderMinutesBeforeStart: 99,
});
```