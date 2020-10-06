# @pnp/graph/planner

The ability to manage plans and tasks in Planner is a capability introduced in version 1.2.4 of @pnp/graph. Through the methods described
you can add, update and delete items in Planner.

## IInvitations

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

| Scenario    | Import Statement                                                  |
| ----------- | ----------------------------------------------------------------- |
| Selective   | import { graph } from "@pnp/graph";<br />import "@pnp/graph/planner"; |
| Preset: All | import "@pnp/graph/presets/all";    |

## Get Plans by Id

Using the planner.plans.getById() you can get a specific Plan.
Planner.plans is not an available endpoint, you need to get a specific Plan.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/planner"

const plan = await graph.planner.plans.getById('planId')();

```

## Add new Plan

Using the planner.plans.add() you can create a new Plan.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/planner"

const newPlan = await graph.planner.plans.add('groupObjectId', 'title');

```

## Get Tasks in Plan

Using the tasks() you can get the Tasks in a Plan.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/planner"

const planTasks = await graph.planner.plans.getById('planId').tasks();

```

## Get Buckets in Plan

Using the buckets() you can get the Buckets in a Plan.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/planner"

const planBuckets = await graph.planner.plans.getById('planId').buckets();

```

## Get Details in Plan

Using the details() you can get the details in a Plan.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/planner"

const planDetails = await graph.planner.plans.getById('planId').details();

```

## Delete Plan

Using the delete() you can get delete a Plan.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/planner"

const delPlan = await graph.planner.plans.getById('planId').delete('planEtag');

```

## Update Plan

Using the update() you can get update a Plan.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/planner"

const updPlan = await graph.planner.plans.getById('planId').update({title: 'New Title', eTag: 'planEtag'});

```

## Get Task by Id

Using the planner.tasks.getById() you can get a specific Task.
Planner.tasks is not an available endpoint, you need to get a specific Task.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/planner"

const task = await graph.planner.tasks.getById('taskId')();

```

## Add new Task

Using the planner.tasks.add() you can create a new Task.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/planner"

const newTask = await graph.planner.tasks.add('planId', 'title');

```

## Get Details in Task

Using the details() you can get the details in a Task.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/planner"

const taskDetails = await graph.planner.tasks.getById('taskId').details();

```

## Delete Task

Using the delete() you can get delete a Task.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/planner"

const delTask = await graph.planner.tasks.getById('taskId').delete('taskEtag');

```

## Update Task

Using the update() you can get update a Task.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/planner"

const updTask = await graph.planner.tasks.getById('taskId').update({properties, eTag:'taskEtag'});

```

## Get Buckets by Id

Using the planner.buckets.getById() you can get a specific Bucket.
planner.buckets is not an available endpoint, you need to get a specific Bucket.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/planner"

const bucket = await graph.planner.buckets.getById('bucketId')();

```

## Add new Bucket

Using the planner.buckets.add() you can create a new Bucket.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/planner"

const newBucket = await graph.planner.buckets.add('name', 'planId');

```

## Update Bucket

Using the update() you can get update a Bucket.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/planner"

const updBucket = await graph.planner.buckets.getById('bucketId').update({name: "Name", eTag:'bucketEtag'});

```

## Delete Bucket

Using the delete() you can get delete a Bucket.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/planner"

const delBucket = await graph.planner.buckets.getById('bucketId').delete(eTag:'bucketEtag');

```

## Get Bucket Tasks

Using the tasks() you can get Tasks in a Bucket.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/planner"

const bucketTasks = await graph.planner.buckets.getById('bucketId').tasks();

```
