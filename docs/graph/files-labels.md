# @pnp/graph/files - Sensitivity and Retention Labels (Premium Endpoint)

The ability to manage sensitivity and retention labels on drive items in SharePoint.

More information can be found in the official Graph documentation:

- [Drives/Files Resource Type](https://learn.microsoft.com/en-us/graph/api/resources/drive?view=graph-rest-1.0)

## IInvitations

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Assign Sensitivity Label to Drive Item

Using the assignSensitivityLabel() you can add a sensitivity label to a DriveItem

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/sites";
import "@pnp/graph/groups";
import "@pnp/graph/files";
import { ISensitivityLabel } from "@pnp/graph/files";

const graph = graphfi(...);

const label: ISensitivityLabel = {
    sensitivityLabelId: "b7a3c3d5-7b6d-4e6c-8e0c-3f5c7b1d0e3d",
    assignmentMethod: "standard",
    justificationText: "Just because",
};

// This is a long running operation and returns a url to check the status.
const retentionLabelStatusUrl = await graph.sites.getById({site id}).drive.getItemById({item id}).assignSensitivityLabel(label);
const retentionLabelStatusUrl = await graph.users.getById({user id}).drive.getItemById({item id}).assignSensitivityLabel(label);
const retentionLabelStatusUrl = await graph.group.getById({group id}).drive.getItemById({item id}).assignSensitivityLabel(label);
```

## Extract Sensitivity Labels from a Drive Item

Using extractSensitivityLabels() extract one or more sensitivity labels assigned to a drive item

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/sites";
import "@pnp/graph/groups";
import "@pnp/graph/files";

const graph = graphfi(...);

const sensitivityLabels = await graph.sites.getById({site id}).drive.getItemById({item id}).extractSensitivityLabels();
const sensitivityLabels = await graph.users.getById({user id}).drive.getItemById({item id}).extractSensitivityLabels();
const sensitivityLabels = await graph.group.getById({group id}).drive.getItemById({item id}).extractSensitivityLabels();
```

## Retrieve/Update/Delete Retention Label of the Drive Item

Method for retrieving, updating, and removing the retention label of the drive item.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/sites";
import "@pnp/graph/groups";
import "@pnp/graph/files";

const graph = graphfi(...);

// Get retention label
const retentionLabel = await graph.sites.getById({site id}).drive.getItemById({item id}).retentionLabel();
const retentionLabel = await graph.users.getById({user id}).drive.getItemById({item id}).retentionLabel();
const retentionLabel = await graph.group.getById({group id}).drive.getItemById({item id}).retentionLabel();

// Update retention label
const retentionLabel = await graph.sites.getById({site id}).drive.getItemById({item id}).updateRetentionLabel("New Name");
const retentionLabel = await graph.users.getById({user id}).drive.getItemById({item id}).updateRetentionLabel("New Name");
const retentionLabel = await graph.group.getById({group id}).drive.getItemById({item id}).updateRetentionLabel("New Name");

// Delete retention label
await graph.sites.getById({site id}).drive.getItemById({item id}).removeRetentionLabel();
await graph.users.getById({user id}).drive.getItemById({item id}).removeRetentionLabel();
await graph.group.getById({group id}).drive.getItemById({item id}).removeRetentionLabel();
```

## Lock/Unlock Record of the Drive Item

Method for locking/unlocking a record of the drive item.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/sites";
import "@pnp/graph/groups";
import "@pnp/graph/files";

const graph = graphfi(...);

// Send 'true' to lock the record, and 'false' to unlock the record.
const retentionLabel = await graph.sites.getById({site id}).drive.getItemById({item id}).recordLocked(true);
const retentionLabel = await graph.users.getById({user id}).drive.getItemById({item id}).recordLocked(true);
const retentionLabel = await graph.group.getById({group id}).drive.getItemById({item id}).recordLocked(true);
```
