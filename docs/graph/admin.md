# @pnp/graph/admin

The ability to work with Microsoft Graph Admin APIs

## Admin, IAdmin, SharePointSettings, ISharePointSettings, ServiceAnnouncements, IServiceAccouncements, PeopleAdmin, IPeopleAdmin

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  


## SharePoint Settings
### Get SharePoint Tenant Settings

Using sharePointSettings() you can retrieve the SharePoint Tenant Settings

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

const settings = await graph.admin.sharepoint.settings();

```
### Update SharePoint Tenant Settings

Update SharePoint Tenant Settings

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

const settings = await graph.admin.sharepoint.settings.update({deletedUserPersonalSiteRetentionPeriodInDays: 5, isCommentingOnSitePagesEnabled: true});

```

## People

### Get People Settings

Represents a setting to control people-related admin settings in the tenant.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

const peopleSettings = await graph.admin.people();

```
### Get People Pronoun Settings

Represents the settings that manage the support of pronouns in an organization.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

const pronounSettings = await graph.admin.people.pronounSettings();

```
### Update People Pronoun Settings

Update Pronoun Settings in an organization

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

const pronounSettings = await graph.admin.people.pronounSettings.update({
    isEnabledInOrganization:true
});

```
### Profile Card Properties

Gets a collection profile card properties for an organization

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

const profileCardProperties = await graph.admin.people.profileCardProperties();

```
### Add Profile Card Property

Add a profile card property.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

const profileCardProperty = await graph.admin.people.profileCardProperties.add({
    directoryPropertyName: "CustomAttribute1",
    annotations: [{
        displayName: "Cost Center",
        localizations: [
            {
                languageTag: "ru-RU",
                displayName: "центр затрат"
            }
        ]
    }]
});

```
### Get Profile Card Property

Retrieve the properties of a profile card property.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

const profileCardProperty = await graph.admin.people.profileCardProperties.getById("CustomAttribute1")();

```
### Update Profile Card Property

Updates the properties of a profile card property.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

const profileCardProperty = await graph.admin.people.profileCardProperties.getById("CustomAttribute1").update({
    directoryPropertyName: "CustomAttribute1",
    annotations: [{
        displayName: "Cost Center 2",
        localizations: [
            {
                languageTag: "ru-RU",
                displayName: "центр затрат"
            }
        ]
    }]
});

```
### Delete Profile Card Property

Delete a property of a profile card

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

const profilePropertyDelete = await graph.admin.people.profileCardProperties.getById("CustomAttribute1").delete();

```
## Service Announcements

### Get Health overviews

Retrieves the service health report for a tenant

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

const healthOverviews = await graph.admin.serviceAnnouncements.healthOverviews();

```
### Get Health Issues

Retrieves the service health issues for a tenant

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

const issues = await graph.admin.serviceAnnouncements.issues();

```
### Get Health Messages

Retrieves the service health messages for a tenant

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

const messages = await graph.admin.serviceAnnouncements.messages();

```
### Get Specific Service Health Message

Retrieves a specific service health message

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

const message = await graph.admin.serviceAnnouncements.messages.getById("MC172851");

```

### Archive/unarchive Service Health Messages

Archive the specified service health messages

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

//archive
await graph.admin.serviceAnnouncements.messages.archive(["MC172851","MC172333"]);

//unarchive
await graph.admin.serviceAnnouncements.messages.unarchive(["MC172851","MC172333"]);

```
### Favorite/unfavorite Service Health Messages

Favorites the specified service health messages

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

//favorite
await graph.admin.serviceAnnouncements.messages.favorite(["MC172851","MC172333"]);

//unfavorite
await graph.admin.serviceAnnouncements.messages.unfavorite(["MC172851","MC172333"]);

```
### Mark as read / Mark unread Service Health Messages

Marks the specified service health messages as read or unread

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

//mark as read
await graph.admin.serviceAnnouncements.messages.markRead(["MC172851","MC172333"]);

//mark as unread
await graph.admin.serviceAnnouncements.messages.markUnread(["MC172851","MC172333"]);

```
### Get Attachments of Service Health Message

Get attachments of Service Health Message

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

const attachments = await graph.admin.serviceAnnouncements.messages.getById("MC172851").attachments();

```
### Get Attachment of Service Health Message by id

Get the specified attachment by id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/admin";

const graph = graphfi(...);

const attachment = await graph.admin.serviceAnnouncements.messages.getById("MC172851").attachments.getById("30356a46-ffad-47e1-acf6-40a99b1538c1")

```