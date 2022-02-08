# @pnp/graph/calendars

More information can be found in the official Graph documentation:

- [Calendar Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/calendar?view=graph-rest-1.0)
- [Event Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/event?view=graph-rest-1.0)

## ICalendar, ICalendars

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

|Scenario|Import Statement|
|--|--|
|Selective 1|import { graphfi } from "@pnp/graph";<br />import "@pnp/graph/calendars";|
|Preset: All|import { graphfi } from "@pnp/graph/presets/all";|

## Get All Calendars For a User

```ts
import { graphfi } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const calendars = await graphfi().users.getById('user@tenant.onmicrosoft.com').calendars();

const myCalendars = await graphfi().me.calendars();

```

## Get a Specific Calendar For a User

```ts
import { graphfi } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const CALENDAR_ID = 'AQMkAGZjNmY0MDN3LRI3YTYtNDQAFWQtOWNhZC04MmY3MGYxODkeOWUARgAAA-xUBMMopY1NkrWA0qGcXHsHAG4I-wMXjoRMkgRnRetM5oIAAAIBBgAAAG4I-wMXjoRMkgRnRetM5oIAAAIsYgAAAA==';

const calendar = await graphfi().users.getById('user@tenant.onmicrosoft.com').calendars.getById(CALENDAR_ID)();

const myCalendar = await graphfi().me.calendars.getById(CALENDAR_ID)();
```

## Get a User's Default Calendar

```ts
import { graphfi } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const calendar = await graphfi().users.getById('user@tenant.onmicrosoft.com').calendar();

const myCalendar = await graphfi().me.calendar();
```

## Get Events For a User's Default Calendar

```ts
import { graphfi } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/users';

// You can get the default calendar events
const events = await graphfi().users.getById('user@tenant.onmicrosoft.com').calendar.events();
// or get all events for the user
const events = await graphfi().users.getById('user@tenant.onmicrosoft.com').events();

// You can get my default calendar events
const events = await graphfi().me.calendar.events();
// or get all events for me
const events = await graphfi().me.events();
```

## Get Events By ID

You can use .events.getByID to search through all the events in all calendars or narrow the request to a specific calendar.

```ts
import { graphfi } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const CalendarID = 'AQMkAGZjNmY0MDN3LRI3YTYtNDQAFWQtOWNhZC04MmY3MGYxODkeOWUARgAAA==';

const EventID = 'AQMkAGZjNmY0MDN3LRI3YTYtNDQAFWQtOWNhZC04MmY3MGYxODkeOWUARgAAA-xUBMMopY1NkrWA0qGcXHsHAG4I-wMXjoRMkgRnRetM5oIAAAIBBgAAAG4I-wMXjoRMkgRnRetM5oIAAAIsYgAAAA==';

// Get events by ID
const event = await graphfi().users.getById('user@tenant.onmicrosoft.com').events.getByID(EventID);

const events = await graphfi().me.events.getByID(EventID);

// Get an event by ID from a specific calendar
const event = await graphfi().users.getById('user@tenant.onmicrosoft.com').calendars.getByID(CalendarID).events.getByID(EventID);

const events = await graphfi().me.calendars.getByID(CalendarID).events.getByID(EventID);

```
## Create Events

This will work on any `IEvents` objects (e.g. anything accessed using an `events` key).

```ts
import { graphfi } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/users';

await graphfi().users.getById('user@tenant.onmicrosoft.com').calendar.events.add(
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

This will work on any `IEvents` objects (e.g. anything accessed using an `events` key).

```ts
import { graphfi } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const EVENT_ID = 'BBMkAGZjNmY6MDM3LWI3YTYtNERhZC05Y2FkLTgyZjcwZjE4OTI5ZQBGAAAAAAD8VQTDKKWNTY61gNKhnFzLBwBuCP8DF46ETJIEZ0XrTOaCAAAAAAENAABuCP8DF46ETJFEZ0EnTOaCAAFvdoJvAAA=';

await graphfi().users.getById('user@tenant.onmicrosoft.com').calendar.events.getById(EVENT_ID).update({
    reminderMinutesBeforeStart: 99,
});
```

## Delete Event

This will work on any `IEvents` objects (e.g. anything accessed using an `events` key).

```ts
import { graphfi } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const EVENT_ID = 'BBMkAGZjNmY6MDM3LWI3YTYtNERhZC05Y2FkLTgyZjcwZjE4OTI5ZQBGAAAAAAD8VQTDKKWNTY61gNKhnFzLBwBuCP8DF46ETJIEZ0XrTOaCAAAAAAENAABuCP8DF46ETJFEZ0EnTOaCAAFvdoJvAAA=';

await graphfi().users.getById('user@tenant.onmicrosoft.com').events.getById(EVENT_ID).delete();

await graphfi().me.events.getById(EVENT_ID).delete();
```

## Get Calendar for a Group

```ts
import { graphfi } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/groups';

const calendar = await graphfi().groups.getById('21aaf779-f6d8-40bd-88c2-4a03f456ee82').calendar();
```

## Get Events for a Group

```ts
import { graphfi } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/groups';

// You can do one of
const events = await graphfi().groups.getById('21aaf779-f6d8-40bd-88c2-4a03f456ee82').calendar.events();
// or
const events = await graphfi().groups.getById('21aaf779-f6d8-40bd-88c2-4a03f456ee82').events();
```

## Get Calendar View

Gets the events in a calendar during a specified date range.

```ts
import { graphfi } from '@pnp/graph';
import '@pnp/graph/calendars';
import '@pnp/graph/users';

// basic request, note need to invoke the returned queryable
const view = await graphfi().users.getById('user@tenant.onmicrosoft.com').calendarView("2020-01-01", "2020-03-01")();

// you can use select, top, etc to filter your returned results
const view2 = await graphfi().users.getById('user@tenant.onmicrosoft.com').calendarView("2020-01-01", "2020-03-01").select("subject").top(3)();

// you can specify times along with the dates
const view3 = await graphfi().users.getById('user@tenant.onmicrosoft.com').calendarView("2020-01-01T19:00:00-08:00", "2020-03-01T19:00:00-08:00")();

const view4 = await graphfi().me.calendarView("2020-01-01", "2020-03-01")();
```
