# @pnp/graph/calendars

More information can be found in the official Graph documentation:

- [Calendar Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/calendar?view=graph-rest-1.0)
- [Event Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/event?view=graph-rest-1.0)

## ICalendar, ICalendars, ICalendarGroup, ICalendarGroups, ICalendarPermission, ICalendarPermissions, ICalendarView, IEvent, IEvents, IForwardEvent, IGetScheduleRequest

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Calendars
### Get All Calendars For a User

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const calendars = await graph.users.getById('user@tenant.onmicrosoft.com').calendars();

const myCalendars = await graph.me.calendars();

```
### Get a Specific Calendar For a User

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const CALENDAR_ID = 'AQMkAGZjNmY0MDN3LRI3YTYtNDQAFWQtOWNhZC04MmY3MGYxODkeOWUARgAAA-xUBMMopY1NkrWA0qGcXHsHAG4I-wMXjoRMkgRnRetM5oIAAAIBBgAAAG4I-wMXjoRMkgRnRetM5oIAAAIsYgAAAA==';

const calendar = await graph.users.getById('user@tenant.onmicrosoft.com').calendars.getById(CALENDAR_ID)();

const myCalendar = await graph.me.calendars.getById(CALENDAR_ID)();

```
### Get a User's Default Calendar

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const calendar = await graph.users.getById('user@tenant.onmicrosoft.com').calendar();

const myCalendar = await graph.me.calendar();
```

### Get Calendar for a Group

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/groups';

const graph = graph.using(SPFx(this.context));

const calendar = await graph.groups.getById('21aaf779-f6d8-40bd-88c2-4a03f456ee82').calendar();
```
### Get free/busy schedule

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const schedule = await graph.me.calendar.getSchedule({
    schedules: ["martha@contoso.com", "user@contoso.com"],
    startTime: {
        dateTime: "2019-03-15T09:00:00",
        timeZone: "Pacific Standard Time",
    },
    endTime: {
        dateTime: "2019-03-15T18:00:00",
        timeZone: "Pacific Standard Time",
    },
    availabilityViewInterval: 60
})

```
### Find Meeting Times

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const meetingTimes = await graph.users.getById('user@contoso.com').findMeetingTimes({
  attendees: [
      {
          type: "required",
          emailAddress: {
            name: "User",
            address: 'user@contoso.com'
          }
      }
    ],
    timeConstraint: {
      activityDomain:"work",
      timeSlots: [
        {
          start: {
            dateTime: "2019-04-16T09:00:00",
            timeZone: "Pacific Standard Time"
          },
          end: {
            dateTime: "2019-04-18T17:00:00",
            timeZone: "Pacific Standard Time"
          }
        }
      ]
    },
    meetingDuration: "PT1H",
    minimumAttendeePercentage: 100
  }
);

```
### Reminder View

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const view = await graph.users.getById('user@contoso.com').reminderView("2024-04-15T12:00:00", "2024-04-15T14:00:00")

```

## Events
### Get Events For a User's Default Calendar

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

// You can get the default calendar events
const events = await graph.users.getById('user@tenant.onmicrosoft.com').calendar.events();
// or get all events for the user
const events = await graph.users.getById('user@tenant.onmicrosoft.com').events();

// You can get my default calendar events
const events = await graph.me.calendar.events();
// or get all events for me
const events = await graph.me.events();
```

### Get Events for a Group

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/groups';

const graph = graphfi(...);

// You can do one of
const events = await graph.groups.getById('21aaf779-f6d8-40bd-88c2-4a03f456ee82').calendar.events();
// or
const events = await graph.groups.getById('21aaf779-f6d8-40bd-88c2-4a03f456ee82').events();
```

### Get Events By ID
You can use .events.getById to search through all the events in all calendars or narrow the request to a specific calendar.

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const CalendarID = 'AQMkAGZjNmY0MDN3LRI3YTYtNDQAFWQtOWNhZC04MmY3MGYxODkeOWUARgAAA==';

const EventID = 'AQMkAGZjNmY0MDN3LRI3YTYtNDQAFWQtOWNhZC04MmY3MGYxODkeOWUARgAAA-xUBMMopY1NkrWA0qGcXHsHAG4I-wMXjoRMkgRnRetM5oIAAAIBBgAAAG4I-wMXjoRMkgRnRetM5oIAAAIsYgAAAA==';

// Get events by ID
const event = await graph.users.getById('user@tenant.onmicrosoft.com').events.getByID(EventID);

const events = await graph.me.events.getByID(EventID);

// Get an event by ID from a specific calendar
const event = await graph.users.getById('user@tenant.onmicrosoft.com').calendars.getByID(CalendarID).events.getByID(EventID);

const events = await graph.me.calendars.getByID(CalendarID).events.getByID(EventID);

```
### Create Event

This will work on any `IEvents` objects (e.g. anything accessed using an `events` key).

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

await graph.users.getById('user@tenant.onmicrosoft.com').calendar.events.add(
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
### Cancel Event

This will work on any `IEvents` objects (e.g. anything accessed using an `events` key).

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const EVENT_ID = 'BBMkAGZjNmY6MDM3LWI3YTYtNERhZC05Y2FkLTgyZjcwZjE4OTI5ZQBGAAAAAAD8VQTDKKWNTY61gNKhnFzLBwBuCP8DF46ETJIEZ0XrTOaCAAAAAAENAABuCP8DF46ETJFEZ0EnTOaCAAFvdoJvAAA=';

await graph.me.events.getById(EVENT_ID).cancel();

```

### Delete Event

This will work on any `IEvents` objects (e.g. anything accessed using an `events` key).

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const EVENT_ID = 'BBMkAGZjNmY6MDM3LWI3YTYtNERhZC05Y2FkLTgyZjcwZjE4OTI5ZQBGAAAAAAD8VQTDKKWNTY61gNKhnFzLBwBuCP8DF46ETJIEZ0XrTOaCAAAAAAENAABuCP8DF46ETJFEZ0EnTOaCAAFvdoJvAAA=';

await graph.users.getById('user@tenant.onmicrosoft.com').events.getById(EVENT_ID).delete();

await graph.me.events.getById(EVENT_ID).delete();

```
### Update Event

This will work on any `IEvents` objects (e.g. anything accessed using an `events` key).

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const EVENT_ID = 'BBMkAGZjNmY6MDM3LWI3YTYtNERhZC05Y2FkLTgyZjcwZjE4OTI5ZQBGAAAAAAD8VQTDKKWNTY61gNKhnFzLBwBuCP8DF46ETJIEZ0XrTOaCAAAAAAENAABuCP8DF46ETJFEZ0EnTOaCAAFvdoJvAAA=';

await graph.users.getById('user@tenant.onmicrosoft.com').calendar.events.getById(EVENT_ID).update({
    reminderMinutesBeforeStart: 99,
});

```
### Accept Event

This will work on any `IEvents` objects (e.g. anything accessed using an `events` key).

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const EVENT_ID = 'BBMkAGZjNmY6MDM3LWI3YTYtNERhZC05Y2FkLTgyZjcwZjE4OTI5ZQBGAAAAAAD8VQTDKKWNTY61gNKhnFzLBwBuCP8DF46ETJIEZ0XrTOaCAAAAAAENAABuCP8DF46ETJFEZ0EnTOaCAAFvdoJvAAA=';

//accept(comment, sendResponse)
await graph.me.events.getById(EVENT_ID).accept("I will be there!", true);

```
### Tentatively Accept Event

This will work on any `IEvents` objects (e.g. anything accessed using an `events` key).

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const EVENT_ID = 'BBMkAGZjNmY6MDM3LWI3YTYtNERhZC05Y2FkLTgyZjcwZjE4OTI5ZQBGAAAAAAD8VQTDKKWNTY61gNKhnFzLBwBuCP8DF46ETJIEZ0XrTOaCAAAAAAENAABuCP8DF46ETJFEZ0EnTOaCAAFvdoJvAAA=';

//tentativelyAccept(comment?, sendResponse?, proposedNewTime?)
await graph.me.events.getById(EVENT_ID).tentativelyAccept("I may not be available.", true);

```
### Decline Event

This will work on any `IEvents` objects (e.g. anything accessed using an `events` key).

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const EVENT_ID = 'BBMkAGZjNmY6MDM3LWI3YTYtNERhZC05Y2FkLTgyZjcwZjE4OTI5ZQBGAAAAAAD8VQTDKKWNTY61gNKhnFzLBwBuCP8DF46ETJIEZ0XrTOaCAAAAAAENAABuCP8DF46ETJFEZ0EnTOaCAAFvdoJvAAA=';

//decline(comment?, sendResponse?, proposedNewTime?)
await graph.me.events.getById(EVENT_ID).decline();

```
### Forward Event

This will work on any `IEvents` objects (e.g. anything accessed using an `events` key).

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const EVENT_ID = 'BBMkAGZjNmY6MDM3LWI3YTYtNERhZC05Y2FkLTgyZjcwZjE4OTI5ZQBGAAAAAAD8VQTDKKWNTY61gNKhnFzLBwBuCP8DF46ETJIEZ0XrTOaCAAAAAAENAABuCP8DF46ETJFEZ0EnTOaCAAFvdoJvAAA=';

await graph.me.events.getById(EVENT_ID).forward(
    {
    ToRecipients:[
        {
          EmailAddress: {
            Address:"danas@contoso.com",
            Name:"Dana Swope"
          }
        }
      ],
    Comment: "Dana, hope you can make this meeting."
  }
)

```
### Dimiss Reminder

This will work on any `IEvents` objects (e.g. anything accessed using an `events` key).

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const EVENT_ID = 'BBMkAGZjNmY6MDM3LWI3YTYtNERhZC05Y2FkLTgyZjcwZjE4OTI5ZQBGAAAAAAD8VQTDKKWNTY61gNKhnFzLBwBuCP8DF46ETJIEZ0XrTOaCAAAAAAENAABuCP8DF46ETJFEZ0EnTOaCAAFvdoJvAAA=';

await graph.me.events.getById(EVENT_ID).dismissReminder();

```
### Snooze Reminder

This will work on any `IEvents` objects (e.g. anything accessed using an `events` key).

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const EVENT_ID = 'BBMkAGZjNmY6MDM3LWI3YTYtNERhZC05Y2FkLTgyZjcwZjE4OTI5ZQBGAAAAAAD8VQTDKKWNTY61gNKhnFzLBwBuCP8DF46ETJIEZ0XrTOaCAAAAAAENAABuCP8DF46ETJFEZ0EnTOaCAAFvdoJvAAA=';

await graph.me.events.getById(EVENT_ID).snoozeReminder();

```
### Get Event Instances

Get the instances (occurrences) of an event for a specified time range.

If the event is a `seriesMaster` type, this returns the occurrences and exceptions of the event in the specified time range.

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);
const event = graph.me.events.getById('');
// basic request, note need to invoke the returned queryable
const instances = await event.instances("2020-01-01", "2020-03-01")();
// you can use select, top, etc to filter your returned results
const instances2 = await event.instances("2020-01-01", "2020-03-01").select("subject").top(3)();
// you can specify times along with the dates
const instance3 = await event.instances("2020-01-01T19:00:00-08:00", "2020-03-01T19:00:00-08:00")(); 
```

### Event Attachments

See [Attachments](./attachments.md)

### Event Messages

See [Messages](./mail-messages.md);

## Calendar View
### Get Calendar View

Gets the events in a calendar during a specified date range.

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

// basic request, note need to invoke the returned queryable
const view = await graph.users.getById('user@tenant.onmicrosoft.com').calendarView("2020-01-01", "2020-03-01")();

// you can use select, top, etc to filter your returned results
const view2 = await graph.users.getById('user@tenant.onmicrosoft.com').calendarView("2020-01-01", "2020-03-01").select("subject").top(3)();

// you can specify times along with the dates
const view3 = await graph.users.getById('user@tenant.onmicrosoft.com').calendarView("2020-01-01T19:00:00-08:00", "2020-03-01T19:00:00-08:00")();

const view4 = await graph.me.calendarView("2020-01-01", "2020-03-01")();
```

### Get Delta

Gets the events in a calendar view that have been added, deleted, updated

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const delta = await graph.users.getById('user@tenant.onmicrosoft.com').calendarView("2020-01-01", "2020-03-01").delta()

```
## Places

See [Places](./places.md);

### Find Rooms

Gets the `emailAddress` objects that represent all the meeting rooms in the user's tenant or in a specific room list.

![Beta Endpoint](https://img.shields.io/badge/Endpoint-Beta-blueviolet.svg)

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);
// basic request, note need to invoke the returned queryable
const rooms1 = await graph.users.getById('user@tenant.onmicrosoft.com').findRooms()();
// you can pass a room list to filter results
const rooms2 = await graph.users.getById('user@tenant.onmicrosoft.com').findRooms('roomlist@tenant.onmicrosoft.com')();
// you can use select, top, etc to filter your returned results
const rooms3 = await graph.users.getById('user@tenant.onmicrosoft.com').findRooms().select('name').top(10)();
```

## Calendar Groups

### Get Calendar Groups

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const calendarGroups = await graph.me.calendarGroups();

```
### Get Calendar Group By ID

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const CALENDAR_GROUPID = 'AQMkAGZjNmY0MDN3LRI3YTYtNDQAFWQtOWNhZC04MmY3MGYxODkeOWUARgAAA-xUBMMopY1NkrWA0qGcXHsHAG4I-wMXjoRMkgRnRetM5oIAAAIBBgAAAG4I-wMXjoRMkgRnRetM5oIAAAIsYgAAAA==';

const calendarGroup = await graph.me.calendarGroups.getById(CALENDAR_GROUPID)();

```
### Create Calendar Group

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const calendarGroup = await graph.me.calendarGroups.add({
  name: "Test Group"
});

```
### Delete Calendar Group

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const CALENDAR_GROUPID = 'AQMkAGZjNmY0MDN3LRI3YTYtNDQAFWQtOWNhZC04MmY3MGYxODkeOWUARgAAA-xUBMMopY1NkrWA0qGcXHsHAG4I-wMXjoRMkgRnRetM5oIAAAIBBgAAAG4I-wMXjoRMkgRnRetM5oIAAAIsYgAAAA==';

await graph.me.calendarGroups.getById(CALENDAR_GROUPID).delete();

```
### Update Calendar Group

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const CALENDAR_GROUPID = 'AQMkAGZjNmY0MDN3LRI3YTYtNDQAFWQtOWNhZC04MmY3MGYxODkeOWUARgAAA-xUBMMopY1NkrWA0qGcXHsHAG4I-wMXjoRMkgRnRetM5oIAAAIBBgAAAG4I-wMXjoRMkgRnRetM5oIAAAIsYgAAAA==';

await graph.me.calendarGroups.getById(CALENDAR_GROUPID).update({
  name: "New Group Name"
});

```
### Get Calendars in Calendar Group

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const CALENDAR_GROUPID = 'AQMkAGZjNmY0MDN3LRI3YTYtNDQAFWQtOWNhZC04MmY3MGYxODkeOWUARgAAA-xUBMMopY1NkrWA0qGcXHsHAG4I-wMXjoRMkgRnRetM5oIAAAIBBgAAAG4I-wMXjoRMkgRnRetM5oIAAAIsYgAAAA==';

const calendars = await graph.me.calendarGroups.getById(CALENDAR_GROUPID).calendars();

```
### Create Calendar in Calendar Group

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const CALENDAR_GROUPID = 'AQMkAGZjNmY0MDN3LRI3YTYtNDQAFWQtOWNhZC04MmY3MGYxODkeOWUARgAAA-xUBMMopY1NkrWA0qGcXHsHAG4I-wMXjoRMkgRnRetM5oIAAAIBBgAAAG4I-wMXjoRMkgRnRetM5oIAAAIsYgAAAA==';

const calendar = await graph.me.calendarGroups.getById(CALENDAR_GROUPID).calendars.add({
    name: "New Calendar"
});

```
## Calendar Permissions

### Get Calendar Permissions

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const CALENDAR_ID = 'AQMkAGZjNmY0MDN3LRI3YTYtNDQAFWQtOWNhZC04MmY3MGYxODkeOWUARgAAA-xUBMMopY1NkrWA0qGcXHsHAG4I-wMXjoRMkgRnRetM5oIAAAIBBgAAAG4I-wMXjoRMkgRnRetM5oIAAAIsYgAAAA==';

const permissions = await graph.me.calendars.getById(CALENDAR_ID).calendarPermissions();
```
### Get Calendar Permission By Id

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const CALENDAR_ID = 'AQMkAGZjNmY0MDN3LRI3YTYtNDQAFWQtOWNhZC04MmY3MGYxODkeOWUARgAAA-xUBMMopY1NkrWA0qGcXHsHAG4I-wMXjoRMkgRnRetM5oIAAAIBBgAAAG4I-wMXjoRMkgRnRetM5oIAAAIsYgAAAA==';

const permissions = await graph.me.calendars.getById(CALENDAR_ID).calendarPermissions.getById(`{permissionId}`)();

```

### Create Calendar Permission

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const CALENDAR_ID = 'AQMkAGZjNmY0MDN3LRI3YTYtNDQAFWQtOWNhZC04MmY3MGYxODkeOWUARgAAA-xUBMMopY1NkrWA0qGcXHsHAG4I-wMXjoRMkgRnRetM5oIAAAIBBgAAAG4I-wMXjoRMkgRnRetM5oIAAAIsYgAAAA==';

const permissions = await graph.me.calendars.getById(CALENDAR_ID).calendarPermissions.add({
  {
      emailAddress: {
          address: 'MarthaM@contoso.com',
          name: "Martha Marie"
      },
      allowedRoles: ["read"],
      role: "read"
  }
});

```
### Delete Calendar Permission

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const CALENDAR_ID = 'AQMkAGZjNmY0MDN3LRI3YTYtNDQAFWQtOWNhZC04MmY3MGYxODkeOWUARgAAA-xUBMMopY1NkrWA0qGcXHsHAG4I-wMXjoRMkgRnRetM5oIAAAIBBgAAAG4I-wMXjoRMkgRnRetM5oIAAAIsYgAAAA==';

await graph.me.calendars.getById(CALENDAR_ID).calendarPermissions.getById(`{permissionId}`).delete();

```

### Update Calendar Permission

```TypeScript
import { graphfi } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

const graph = graphfi(...);

const CALENDAR_ID = 'AQMkAGZjNmY0MDN3LRI3YTYtNDQAFWQtOWNhZC04MmY3MGYxODkeOWUARgAAA-xUBMMopY1NkrWA0qGcXHsHAG4I-wMXjoRMkgRnRetM5oIAAAIBBgAAAG4I-wMXjoRMkgRnRetM5oIAAAIsYgAAAA==';

const permissions = await graph.me.calendars.getById(CALENDAR_ID).calendarPermissions.update({
  {
      emailAddress: {
          address: 'MarthaM@contoso.com',
          name: "Martha Marie"
      },
      role: "read",
      allowedRoles: ["read", "write"]
  }
});

```