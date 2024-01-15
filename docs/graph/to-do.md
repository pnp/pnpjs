# @pnp/graph/to-do

The todo module allows you to access the Microsoft Graph Todo API.

More information can be found in the official Graph documentation:

- [To-do Resource Type](https://learn.microsoft.com/en-us/graph/api/resources/todo-overview?view=graph-rest-1.0)

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## taskLists

### List Task Lists
Retrieve a list of task lists
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

//current user
const lists = await graph.me.todo.lists();

//for a user
const taskLists = await graph.users.getById('{user id}').todo.lists();
```

### Get a Task List by Id
Get a task list by id
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const list = await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8')();

```
### Add a new Task List
Add a new task list to ToDo.
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const list = await graph.me.todo.lists.add({
    displayName: 'My Task List'
});

```
### Update a Task List
Update a task list
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const list = await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').update({
    displayName: 'My New Task List'
});

```
### Delete a Task List
Delete a task list
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').delete();

```
### Get Task List Delta
Gets a set of task lists that have been added, deleted or removed
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const delta: IDeltaItems = await graph.me.todo.lists.delta();

```
## Tasks
### List Tasks
Retrieve a list of tasks
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const tasks = await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks();

```
### Get a Task by Id
Get a task by id
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const task = await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55')();

```
### Add a new Task
Adds a new task to a task list
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const task = await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.add({
    title: 'New task'
});

```
### Update a Task
Updates a task in a task list
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const task = await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55').update({
    title: 'New task name'
});

```
### Delete a Task
Deletes a task from a task list
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55').delete();

```
### Get Tasks Delta
Retrieves a set of tasks that ahve been added, deleted, or updated in a task list.
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const delta: IDeltaItems = await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55').delta();

```
## File Attachments

### List Attachments
Retrieve a list of file attachments from a task
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const files = await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55').attachments();

```
### Get Attachment by Id
Get a file attachment by id.
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const attachment = await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55').attachments.getById('07f8c5e9-e20f-4b0a-8d26-5aae58ef121b')();

```
### Add a new Attachment
Adds a new attachment to a task. 
This operation limits the size of the attachment you can add to under 3 MB.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const attachment = await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55').attachments.add({
    {
        "name": "Task Attachment",
        "contentBytes": "VGVzdA==",
        "contentType": "text/plain",
    }
})

```
### Update an Attachment

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55').attachments.getById('07f8c5e9-e20f-4b0a-8d26-5aae58ef121b').delete();

```
## Checklist Items

### List Checklist Items
Retrieve a list of checklist items from a task
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const checklistItems = await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55').checklistItems();

```
### Get Checklist Item by Id
Get a checklist item by id
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const item = await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55').checklistItems.getById('78216476-778e-4ecd-8b08-bea6aa06eae8')();

```
### Add a new Checklist Item
Adds a new checklist item to a task
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const item = graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55').checklistItems.add({
    displayName: 'New Item'
});

```
### Update a Checklist Item
Updates a checklist item in a task
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const item = graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55').checklistItems.update({
    displayName: 'New Item Display Name'
});

```
### Delete a Checklist Item
Deletes a checklist from a task
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55').checklistItems.getById('78216476-778e-4ecd-8b08-bea6aa06eae8').delete();
```

## Linked Resources
### List Linked Resources
Retrieve a list of resources from a task
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const resources = await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55').resources();

```
### Get a Linked Resource by Id
Get a linked resource by id
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const resource = await graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55').resources.getById('264f7cd2-5c27-408a-b6b0-be386e522ea4')();

```
### Add a Linked Resource
Adds a new linked resource to a task
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const resource = graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55').resources.add({
    displayName: 'New Resource',
    applicationName: 'PnpJs'
});

```
### Update a Linked Resource
Updates a linked resource in a task
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

const item = graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55').resources.getById('264f7cd2-5c27-408a-b6b0-be386e522ea4').update({
    displayName: 'New Resource Name',
    applicationName: 'PnpJs'
});

```
### Delete a Linked Resource
Deletes a checklist from a task
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/todo";

const graph = graphfi(...);

graph.me.todo.lists.getById('e650db1d-48c6-4950-89a5-74e504ee91a8').tasks.getById('8914aa93-445d-4413-bfa3-38a84b56cc55').resources.getById('264f7cd2-5c27-408a-b6b0-be386e522ea4').delete();

```