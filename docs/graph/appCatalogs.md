# @pnp/graph/appcatalogs

The ability to use Teams App Catalogs

## AppCatalogs, IAppCatalogs

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Get Teams Apps in App Catalog

Using teamsApps() you get the Teams AppCatalog

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/appCatalogs";

const graph = graphfi(...);

const apps = await graph.appCatalogs.teamsApps();

```
## Get Teams Apps by Id

Using getById() you get the Teams App by Id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/appCatalogs";

const graph = graphfi(...);

const apps = await graph.appCatalogs.teamsApps.getById('{teams app id}')();

```
## Add a Teams App


```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/appCatalogs";

const graph = graphfi(...);
const appPackage = {...} as Blob;

//second parameter is "Requires Approval"
const app = await graph.appCatalogs.teamsApps.getById('{teams app id}').add(appPackage, false);

```
## Update a Teams App

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/appCatalogs";

const graph = graphfi(...);
const appPackage = {...} as Blob;

//second parameter is "Requires Approval"
const app = await graph.appCatalogs.teamsApps.getById('{teams app id}').update(appPackage, false);

```
## Delete a Teams App

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/appCatalogs";

const graph = graphfi(...);

//delete a Teams App
await graph.appCatalogs.teamsApps.getById(app).delete();

// delete an un-approved Teams App requires the app definition id.
// sample is just selecting the first app definition.
const appDefinition = (await graph.appCatalogs.teamsApps.getById("{teams app id}")()).appDefinitions[0];
await graph.appCatalogs.teamsApps.getById(app).delete(appDefinition);

```