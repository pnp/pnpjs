# @pnp/graph/appcatalog

The ability to use Teams App Catalog

More information can be found in the official Graph documentation:

- [App Catalogs Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/teamsapp?view=graph-rest-1.0)

## AppCatalog, IAppCatalog

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Get Teams Apps in App Catalog

Using teamsApps() you get the Teams AppCatalog

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/appCatalog";

const graph = graphfi(...);

const apps = await graph.appCatalog.teamsApps();

```
## Get Teams Apps by Id

Using getById() you get the Teams App by Id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/appCatalog";

const graph = graphfi(...);

const apps = await graph.appCatalog.teamsApps.getById('{teams app id}')();

```
## Add a Teams App


```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/appCatalog";

const graph = graphfi(...);
const appPackage = {...} as Blob;

//second parameter is "Requires Approval"
const app = await graph.appCatalog.teamsApps.getById('{teams app id}').add(appPackage, false);

```
## Update a Teams App

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/appCatalog";

const graph = graphfi(...);
const appPackage = {...} as Blob;

//second parameter is "Requires Approval"
const app = await graph.appCatalog.teamsApps.getById('{teams app id}').update(appPackage, false);

```
## Delete a Teams App

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/appCatalog";

const graph = graphfi(...);

//delete a Teams App
await graph.appCatalog.teamsApps.getById(app).delete();

// delete an un-approved Teams App requires the app definition id.
// sample is just selecting the first app definition.
const appDefinition = (await graph.appCatalog.teamsApps.getById("{teams app id}")()).appDefinitions[0];
await graph.appCatalog.teamsApps.getById(app).delete(appDefinition);

```
## Get Teams App Definitions

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/appCatalog";

const graph = graphfi(...);

//get teams app definitions
await graph.appCatalog.teamsApps.getById(`{teams app id}`).appDefinitions();

```
## Get Teams App Definitions by Id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/appCatalog";

const graph = graphfi(...);

//get teams app definitions
await graph.appCatalog.teamsApps.getById(`{teams app id}`).appDefinitions.getById(`{Teams App Definition Id}`)

```
## Get Bot associated with Teams App Definition

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/appCatalog";

const graph = graphfi(...);

await graph.appCatalog.teamsApps.getById(`{teams app id}`).appDefinitions.getById(`{Teams App Definition Id}`).bot();

```