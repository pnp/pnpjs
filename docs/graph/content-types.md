# Graph Content Types

More information can be found in the official Graph documentation:

- [Columns Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/columndefinition?view=graph-rest-1.0)
- [List Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/list?view=graph-rest-1.0)
- [Content Type Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/contenttype?view=graph-rest-1.0)

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Get Content Types

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/content-types";
//Needed for lists
import "@pnp/graph/lists";

const graph = graphfi(...);

const siteContentTypes = await graph.site.getById("{site identifier}").contentTypes();
const listContentTypes = await graph.site.getById("{site identifier}").lists.getById("{list identifier}").contentTypes();
```

## Get Content Types by Id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/content-types";
//Needed for lists
import "@pnp/graph/lists";

const graph = graphfi(...);

const siteContentType = await graph.site.getById("{site identifier}").contentTypes.getById("{content type identifier}")();
const listContentType = await graph.site.getById("{site identifier}").lists.getById("{list identifier}").contentTypes.getById("{content type identifier}")();
```

## Add a Content Type (Site)

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/content-types";

const graph = graphfi(...);

const sampleContentType: ContentType = {
    name: "PnPTestContentType",
    description: "PnPTestContentType Description",
    base: {
        name: "Item",
        id: "0x01",
    },
    group: "PnPTest Content Types",
    id: "0x0100CDB27E23CEF44850904C80BD666FA645",
};

const siteContentType = await graph.sites.getById("{site identifier}").contentTypes.add(sampleContentType);
```

## Add a Content Type - Copy (List)

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/lists";
import "@pnp/graph/content-types";

const graph = graphfi(...);

//Get a list of compatible site content types for the list
const siteContentType = await graph.site.getById("{site identifier}").getApplicableContentTypesForList("{list identifier}")();
//Get a specific content type from the site.
const siteContentType = await graph.site.getById("{site identifier}").contentTypes.getById("{content type identifier}")();
const listContentType = await graph.sites.getById("{site identifier}").lists.getById("{list identifier}").contentTypes.addCopy(siteContentType);
```

## Update a Content Type (Sites and List)

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/columns";
//Needed for lists
import "@pnp/graph/lists";

const graph = graphfi(...);

const site = graph.site.getById("{site identifier}");
const updatedSiteContentType = await site.contentTypes.getById("{content type identifier}").update({ description: "New Description" });
const updateListContentType = await site.lists.getById("{list identifier}").contentTypes.getById("{content type identifier}").update({ description: "New Description" });
```

## Delete a Content Type

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/content-types";
//Needed for lists
import "@pnp/graph/lists";

const graph = graphfi(...);

await graph.site.getById("{site identifier}").contentTypes.getById("{content type identifier}").delete();
await graph.site.getById("{site identifier}").lists.getById("{list identifier}").contentTypes.getById("{content type identifier}").delete();
```

## Get Compatible Content Types from Hub

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/content-types";
//Needed for lists
import "@pnp/graph/lists";

const graph = graphfi(...);

const siteContentTypes = await graph.site.getById("{site identifier}").contentTypes.getCompatibleHubContentTypes();
const listContentTypes = await graph.site.getById("{site identifier}").lists.getById("{list identifier}").contentTypes.getCompatibleHubContentTypes();
```

## Add/Sync Content Types from Hub (Site and List)

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/content-types";
//Needed for lists
import "@pnp/graph/lists";

const graph = graphfi(...);

const hubSiteContentTypes = await graph.site.getById("{site identifier}").contentTypes.getCompatibleHubContentTypes();
const siteContentType = await graph.site.getById("{site identifier}").contentTypes.addCopyFromContentTypeHub(hubSiteContentTypes[0].Id);

const hubListContentTypes = await graph.site.getById("{site identifier}").lists.getById("{list identifier}").contentTypes.getCompatibleHubContentTypes();
const listContentType = await graph.site.getById("{site identifier}").lists.getById("{list identifier}").contentTypes.addCopyFromContentTypeHub(hubListContentTypes[0].Id);
```

## Site Content Type (isPublished, Publish, Unpublish)

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/content-types";

const graph = graphfi(...);

const siteContentType = graph.site.getById("{site identifier}").contentTypes.getById("{content type identifier}");
const isPublished = await siteContentType.isPublished();
await siteContentType.publish();
await siteContentType.unpublish();;
```

## Associate Content Type with Hub Sites

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/content-types";

const graph = graphfi(...);

const hubSiteUrls: string[] = [hubSiteUrl1, hubSiteUrl2, hubSiteUrl3];
const propagateToExistingLists = true;
// NOTE: the site must be the content type hub
const contentTypeHub = graph.site.getById("{content type hub site identifier}");
const siteContentType = await contentTypeHub.contentTypes.getById("{content type identifier}").associateWithHubSites(hubSiteUrls, propagateToExistingLists);
```

## Copy a file to a default content location in a content type

> Not fully implemented, requires Files support

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/content-types";

const graph = graphfi(...);

// Not fully implemented
const sourceFile: ItemReference = {};
const destinationFileName: string = "NewFileName";

const site = graph.site.getById("{site identifier}");
const siteContentType = await site.contentTypes.getById("{content type identifier}").copyToDefaultContentLocation(sourceFile, destinationFileName);
```
