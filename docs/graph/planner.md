# @pnp/graph/planner

The ability to manage plans and tasks in Planner is a capability introduced in version 1.2.4 of @pnp/graph. Through the methods described
you can add, update and delete items in Planner.

More information can be found in the official Graph documentation:

- [Tasks and plans](https://learn.microsoft.com/en-us/graph/api/resources/planner-overview?view=graph-rest-1.0)

## IInvitations

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Get Plans by Id

Using the planner.plans.getById() you can get a specific Plan.
Planner.plans is not an available endpoint, you need to get a specific Plan.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

const plan = await graph.planner.plans.getById({planId})();

```

## Add new Plan

Using the planner.plans.add() you can create a new Plan.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

const planTemplate: IPlanAdd = {
    container: {
        url: "",
    },
    title: "",
};

const plan = await graph.planner.plans.add(planTemplate);

```

## Get Tasks in Plan

Using the tasks() you can get the Tasks in a Plan.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

const planTasks = await graph.planner.plans.getById({planId}).tasks();

```

## Get Buckets in Plan

Using the buckets() you can get the Buckets in a Plan.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

const planBuckets = await graph.planner.plans.getById({planId}).buckets();

```

## Get Details in Plan

Using the details() you can get the details in a Plan.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

const planDetails = await graph.planner.plans.getById({planId}).details();

```

## Delete Plan

Using the delete() you can get delete a Plan.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

// Note the planETag cannot be "*" and is required.
const delPlan = await graph.planner.plans.getById({planId}).delete({planEtag});

```

## Update Plan

Using the update() you can get update a Plan.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

const updPlan = await graph.planner.plans.getById({planId}).update({title: 'New Title', eTag: {planEtag}});

```

## Get All My Tasks from all plans

Using the tasks() you can get the Tasks across all plans

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/planner";

const graph = graphfi(...);

const planTasks = await graph.me.tasks();
const planTasks = await graph.users.getById({userId}).tasks();

```

## Get Task by Id

Using the planner.tasks.getById() you can get a specific Task.
Planner.tasks is not an available endpoint, you need to get a specific Task.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

const task = await graph.planner.tasks.getById({taskId})();

```

## Add new Task

Using the planner.tasks.add() you can create a new Task.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

const taskTemplate = {
    planId: {planId},
    title: "My New Task",
    assignments: { 
        {userId}: {
            "@odata.type": "#microsoft.graph.plannerAssignment",
            orderHint: " !",
        }
    },
};
const newTask = await graph.planner.tasks.add({taskTemplate});

```

## Get Details in Task

Using the details() you can get the details in a Task.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

const taskDetails = await graph.planner.tasks.getById({taskId}).details();

```

## Delete Task

Using the delete() you can get delete a Task.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

// Note the taskEtag cannot be "*" and is required.
const delTask = await graph.planner.tasks.getById({taskId}).delete({taskEtag});

```

## Update Task

Using the update() you can get update a Task.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

const updTask = await graph.planner.tasks.getById({taskId}).update({properties, eTag: {taskEtag}});

```

## Get Buckets by Id

Using the planner.buckets.getById() you can get a specific Bucket.
planner.buckets is not an available endpoint, you need to get a specific Bucket.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

const bucket = await graph.planner.buckets.getById({bucketId})();

```

## Add new Bucket

Using the planner.buckets.add() you can create a new Bucket.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

const bucketTemplate = {
    planId: {planId},
    name: "My Task Bucket",
};
const newBucket = await graph.planner.buckets.add(bucketTemplate);

```

## Update Bucket

Using the update() you can get update a Bucket.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

const updBucket = await graph.planner.buckets.getById({bucketId}).update({name: "New Name", eTag: {bucketEtag}});

```

## Delete Bucket

Using the delete() you can get delete a Bucket.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

// Note the bucketEtag cannot be "*" and is required.
const delBucket = await graph.planner.buckets.getById({bucketId}).delete(eTag: {bucketEtag});

```

## Get Bucket Tasks

Using the tasks() you can get Tasks in a Bucket.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

const bucketTasks = await graph.planner.buckets.getById({bucketId}).tasks();

```

## Get Plans for a group

Gets all the plans for a group

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/planner";

const graph = graphfi(...);

const plans = await graph.groups.getById("b179a282-9f94-4bb5-a395-2a80de5a5a78").plans();

```

## Get AssignedToTaskBoardFormat, BucketTaskBoardFormat, ProgressTaskBoardTaskFormat

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

const assignedToTaskBoardFormat = await this.pnp.graph.planner.tasks.getById({taskId}).assignedToTaskBoardFormat();
const bucketTaskBoardFormat = await this.pnp.graph.planner.tasks.getById({taskId}).assignedToTaskBoardFormat();
const progressTaskBoardTaskFormat = await this.pnp.graph.planner.tasks.getById({taskId}).progressTaskBoardTaskFormat();
```

## Update AssignedToTaskBoardFormat, BucketTaskBoardFormat, ProgressTaskBoardTaskFormat

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/planner";

const graph = graphfi(...);

await this.pnp.graph.planner.tasks.getById({taskId}).assignedToTaskBoardFormat.update({ unassignedOrderHint: " abc!" }, {taskETag});
await this.pnp.graph.planner.tasks.getById({taskId}).assignedToTaskBoardFormat.update({orderHint: " abc!" }, {taskETag});
await this.pnp.graph.planner.tasks.getById({taskId}).progressTaskBoardTaskFormat.update({orderHint: " abc!" }, {taskETag});
```
