# @pnp/graph/security

The Microsoft Graph Security API can be used as a federated security aggregation service to submit queries to all onboarded security providers to get aggregated responses.

## Get all Alerts

Using the alerts.get() to retrieve a list of Alert objects

```TypeScript
import { graph } from "@pnp/graph";

const alerts = await graph.security.alerts.get();

```

## Get an Alert by Id

Using the alerts.getById() to retrieve a specific Alert object

```TypeScript
import { graph } from "@pnp/graph";

const alert = await graph.security.alerts.getById('alertId').get();

```

## Update an Alert

Using the alerts.getById().update() to retrieve a specific Alert object

```TypeScript
import { graph } from "@pnp/graph";

const updAlert = await graph.security.alerts.getById('alertId').update({status: 'Status' });

```
