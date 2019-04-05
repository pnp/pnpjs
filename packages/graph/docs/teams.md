# @pnp/graph/teams

The ability to manage Team is a capability introduced in the 1.2.7 of @pnp/graph. Through the methods described
you can add, update and delete items in Teams.

## Teams the user is a member of
```TypeScript
import { graph } from "@pnp/graph";

const joinedTeams = await graph.users.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').joinedTeams.get();

const myJoinedTeams = await graph.me.joinedTeams.get();

```

## Get Teams by Id

Using the teams.getById() you can get a specific Team.

```TypeScript
import { graph } from "@pnp/graph";

const team = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').get();

```

## Create new Group and Team
When you create a new group and add a Team, the group needs to have an Owner. Or else we get an error.
So the owner Id is important, and you could just get the users Ids from

```TypeScript
import { graph } from "@pnp/graph";

const users = await graph.users.get();
```
Then create
```TypeSCript
import { graph } from "@pnp/graph";

const createdGroupTeam = await graph.teams.create('Groupname', 'description', 'OwnerId',{ 
"memberSettings": {
    "allowCreateUpdateChannels": true
},
"messagingSettings": {
        "allowUserEditMessages": true,
"allowUserDeleteMessages": true
},
"funSettings": {
    "allowGiphy": true,
    "giphyContentRating": "strict"
}});
```

## Create a Team via a specific group
Here we get the group via id and use `createTeam`

```TypeScript
import { graph } from "@pnp/graph";

const createdTeam = await graph.groups.getById('679c8ff4-f07d-40de-b02b-60ec332472dd').createTeam({ 
"memberSettings": {
    "allowCreateUpdateChannels": true
},
"messagingSettings": {
        "allowUserEditMessages": true,
"allowUserDeleteMessages": true
},
"funSettings": {
    "allowGiphy": true,
    "giphyContentRating": "strict"
}});
```

## Archive a Team
```TypeScript
import { graph } from "@pnp/graph";

const archived = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').archive();

```
## Unarchive a Team
```TypeScript
import { graph } from "@pnp/graph";

const archived = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').unarchive();

```

## Clone a Team
```TypeScript
import { graph } from "@pnp/graph";

const clonedTeam = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').cloneTeam(
'Cloned','description','apps,tabs,settings,channels,members','public');

```
## Get all channels of a Team
```TypeScript
import { graph } from "@pnp/graph";

const channels = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').channels.get();

```
## Get channel by Id
```TypeScript
import { graph } from "@pnp/graph";

const channel = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').channels.getById('19:65723d632b384ca89c81115c281428a3@thread.skype').get();

```

## Create a new Channel
```TypeScript
import { graph } from "@pnp/graph";

const newChannel = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').channels.create('New Channel', 'Description');

```
## Get installed Apps
```TypeScript
import { graph } from "@pnp/graph";

const installedApps = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').installedApps.get();

```
## Add an App
```TypeScript
import { graph } from "@pnp/graph";

const addedApp = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').installedApps.add('https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/12345678-9abc-def0-123456789a');

```
## Remove an App
```TypeScript
import { graph } from "@pnp/graph";

const removedApp = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').installedApps.remove();

```
## Get Tabs from a Channel
```TypeScript
import { graph } from "@pnp/graph";

const tabs = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').
channels.getById('19:65723d632b384ca89c81115c281428a3@thread.skype').tabs
.get();

```
## Get Tab by Id
```TypeScript
import { graph } from "@pnp/graph";

const tab = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').
channels.getById('19:65723d632b384ca89c81115c281428a3@thread.skype').tabs
.getById('Id');

```
## Add a new Tab
```TypeScript
import { graph } from "@pnp/graph";

const newTab = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').
channels.getById('19:65723d632b384ca89c81115c281428a3@thread.skype').tabs.add('Tab','https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/12345678-9abc-def0-123456789a',<TabsConfiguration>{});

```
