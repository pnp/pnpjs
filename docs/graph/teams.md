# @pnp/graph/teams

The ability to manage Team is a capability introduced in the 1.2.7 of @pnp/graph. Through the methods described
you can add, update and delete items in Teams.

## Teams the user is a member of

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/teams";

const graph = graphfi(...);

const joinedTeams = await graph.users.getById('99dc1039-eb80-43b1-a09e-250d50a80b26').joinedTeams();

const myJoinedTeams = await graph.me.joinedTeams();

```

## Get Teams by Id

Using the teams.getById() you can get a specific Team.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);

const team = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528')();
```

## Create new Team/Group - Method #1

The first way to create a new Team and corresponding Group is to first create the group and then create the team.
Follow the example in Groups to create the group and get the GroupID. Then make a call to create the team from the group.

## Create a Team via a specific group

Here we get the group via id and use `createTeam`

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/groups";

const graph = graphfi(...);

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

## Create new Team/Group - Method #2

The second way to create a new Team and corresponding Group is to do so in one call. This can be done by using the createTeam method.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);

const team = {
        "template@odata.bind": "https://graph.microsoft.com/v1.0/teamsTemplates('standard')",
        "displayName": "PnPJS Test Team",
        "description": "PnPJS Test Team’s Description",
        "members": [
            {
                "@odata.type": "#microsoft.graph.aadUserConversationMember",
                "roles": ["owner"],
                "user@odata.bind": "https://graph.microsoft.com/v1.0/users('{owners user id}')",
            },
        ],
    };

const createdTeam: ITeamCreateResultAsync = await graph.teams.create(team);
//To check the status of the team creation, call getOperationById for the newly created team.
const createdTeamStatus = await graph.teams.getById(createdTeam.teamId).getOperationById(createdTeam.operationId);
```

## Clone a Team

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);

const clonedTeam = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').cloneTeam(
'Cloned','description','apps,tabs,settings,channels,members','public');

```

## Get Teams Async Operation

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);

const clonedTeam = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').cloneTeam(
'Cloned','description','apps,tabs,settings,channels,members','public');
const clonedTeamStatus = await graph.teams.getById(clonedTeam.teamId).getOperationById(clonedTeam.operationId);
```

## Archive a Team

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);

const archived = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').archive();
```

## Unarchive a Team

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);

const archived = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').unarchive();
```

## Get all channels of a Team

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);

const channels = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').channels();
```

## Get primary channel

Using the teams.getById() you can get a specific Team.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);
const channel = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').primaryChannel();
```

## Get channel by Id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);

const channel = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').channels.getById('19:65723d632b384ca89c81115c281428a3@thread.skype')();

```

## Create a new Channel

```TypeScript
import { graphfi } from "@pnp/graph";

const graph = graphfi(...);

const newChannel = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').channels.create('New Channel', 'Description');

```

## List Messages

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);

const chatMessages = await graph.teams.getById('3531fzfb-f9ee-4f43-982a-6c90d8226528').channels.getById('19:65723d632b384xa89c81115c281428a3@thread.skype').messages();
```

## Add chat message to Channel

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import { ChatMessage } from "@microsoft/microsoft-graph-types";

const graph = graphfi(...);

const message = {
      "body": {
        "content": "Hello World"
      }
    }
const chatMessage: ChatMessage = await graph.teams.getById('3531fzfb-f9ee-4f43-982a-6c90d8226528').channels.getById('19:65723d632b384xa89c81115c281428a3@thread.skype').messages.add(message);
```

## Get installed Apps

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);

const installedApps = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').installedApps();

```

## Add an App

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);

const addedApp = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').installedApps.add('https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/12345678-9abc-def0-123456789a');

```

## Remove an App

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);

const removedApp = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').installedApps.delete();

```

## Get Tabs from a Channel

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);

const tabs = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').
channels.getById('19:65723d632b384ca89c81115c281428a3@thread.skype').tabs();

```

## Get Tab by Id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);

const tab = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').
channels.getById('19:65723d632b384ca89c81115c281428a3@thread.skype').tabs.getById('Id')();

```

## Add a new Tab to Channel

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);

const newTab = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').
channels.getById('19:65723d632b384ca89c81115c281428a3@thread.skype').tabs.add('Tab','https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/12345678-9abc-def0-123456789a',<TabsConfiguration>{});

```

## Update a Tab

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);

const tab = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').
channels.getById('19:65723d632b384ca89c81115c281428a3@thread.skype').tabs.getById('Id').update({
    displayName: "New tab name"
});

```

## Remove a Tab from channel

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";

const graph = graphfi(...);

const tab = await graph.teams.getById('3531f3fb-f9ee-4f43-982a-6c90d8226528').
channels.getById('19:65723d632b384ca89c81115c281428a3@thread.skype').tabs.getById('Id').delete();

```

## Team Membership

Get the members and/or owners of a group.

See [Groups](./groups.md)
