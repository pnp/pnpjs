# @pnp/graph/compliance

The ability to interact with Microsoft Graph compliance and privacy APIs.

More information can be found in the official Graph documentation:

- [Compliance Resource Type](https://learn.microsoft.com/en-us/graph/api/resources/complianceapioverview?view=graph-rest-1.0)

## ICompliance, ISubjectRightsRequests, ISubjectRightsRequest, INotes

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Subject rights request

### Get all Subject rights requests

Gets a list of Subject rights requests from Purview

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/compliance"

const graph = graphfi(...);

const requests = await graph.compliance.subjectRightsRequests();

```
### Get Subject rights request by id

Gets a Subject rights request by id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/compliance"

const graph = graphfi(...);

const request = await graph.compliance.subjectRightsRequests.getById('efee1b77-fb3b-4f65-99d6-274c11914d12')();

```
### Create a Subject rights request

Creates a new Subject rights request

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/compliance"

const graph = graphfi(...);

const requestAdd = await graph.compliance.subjectRightsRequests.add({
  "type": "export",
  "contentQuery": "((\"Diego Siciliani\" OR \"Diego.Siciliani@contoso.com\") OR (participants:\"Diego.Siciliani@contoso.com\"))",
  "dataSubjectType": "customer",
  "externalId": "F53BF2DA-607D-412A-B568-FAA0F023AC0B",
  "displayName": "Export report for customer Id: 12345",
  "description": "This is a export request",
  "includeAllVersions": false,
  "includeAuthoredContent": true,
  "internalDueDateTime": "2022-07-20T22:42:28Z",
  "dataSubject": {
    "firstName": "Diego",
    "lastName": "Siciliani",
    "email": "Diego.Siciliani@contoso.com",
    "residency": "USA"
  },
  "mailboxLocations": null,
  "pauseAfterEstimate": true,
  "regulations": [
    "CCPA"
  ],
  "siteLocations": {
    "@odata.type": "microsoft.graph.subjectRightsRequestAllSiteLocation"
  }
});

```
### Update Subject rights request

Updates a Subject rights request

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/compliance"

const graph = graphfi(...);

const requestUpdate = await graph.compliance.subjectRightsRequests.getById('efee1b77-fb3b-4f65-99d6-274c11914d12').update({
    description:"Updated description of request",
    displayName:"Updated name of request",
    internalDueDateTime:"2024-08-20T22:42:28Z"
});

```
### Get Subject rights request notes

Retrieves Subject rights request notes

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/compliance"

const graph = graphfi(...);

const notes = await graph.compliance.subjectRightsRequests.getById('efee1b77-fb3b-4f65-99d6-274c11914d12').notes();

```
### Create new Subject rights request note

Creates a new Subject rights request note

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/compliance"

const graph = graphfi(...);

const notes = await graph.compliance.subjectRightsRequests.getById('efee1b77-fb3b-4f65-99d6-274c11914d12').notes.add(
{
    "content": {
    "content": "Please take a look at the files tagged with follow up 1",
    "contentType": "text"
    }
});

```
### Get final report

Get the final report for a Subject rights request. The report is a text file that contains information about the files that were included by the privacy administrator.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/compliance"

const graph = graphfi(...);

const finalReport = await graph.compliance.subjectRightsRequests.getById('efee1b77-fb3b-4f65-99d6-274c11914d12').finalReport();

```
### Get final attachment

Get the final attachment for a Subject rights request. The attachment is a zip file that contains all the files that were included by the privacy administrator.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/compliance"

const graph = graphfi(...);

const finalAttachment = await graph.compliance.subjectRightsRequests.getById('efee1b77-fb3b-4f65-99d6-274c11914d12').finalAttachment();

```