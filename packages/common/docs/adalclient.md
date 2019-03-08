# @pnp/common/adalclient

_Added in 1.0.4_

This module contains the AdalClient class which can be used to authenticate to any AzureAD secured resource. It is designed to work seamlessly with
SharePoint Framework's permissions.

## Setup and Use inside SharePoint Framework

Using the SharePoint Framework is the preferred way to make use of the AdalClient as we can use the AADTokenProvider to efficiently get tokens on your behalf. You can also read more about how this process works and the necessary SPFx configurations in the [SharePoint Framework 1.6 release notes](https://github.com/SharePoint/sp-dev-docs/wiki/SharePoint-Framework-v1.6-release-notes#moving-from-beta-to-public---webapi). This method only work for SharePoint Framework >= 1.6. For earlier versions of SharePoint Framework you can still use the AdalClient as outlined above using the constructor to specify the values for an AAD Application you have setup.

#### Calling the graph api

By providing the context in the onInit we can create the adal client from known information.  

```TypeScript
import { graph } from "@pnp/graph";
import { getRandomString } from "@pnp/common";

// ...

public onInit(): Promise<void> {

  return super.onInit().then(_ => {

    // other init code may be present
    graph.setup({
      spfxContext: this.context
    });
  });
}

public render(): void {

  // here we are creating a team with a random name, required Group ReadWrite All permissions
  const teamName = `ATeam.${getRandomString(4)}`;

  this.domElement.innerHTML = `Hello, I am creating a team named "${teamName}" for you...`;

  graph.teams.create(teamName, "This is a description").then(t => {
    
    this.domElement.innerHTML += "done!";

  }).catch(e => {

    this.domElement.innerHTML = `Oops, I ran into a problem...${JSON.stringify(e, null, 4)}`;
  });
}
```

#### Calling the SharePoint API

This example shows how to use the ADALClient with the @pnp/sp library to call 

```TypeScript
import { sp } from "@pnp/sp";
import { AdalClient } from "@pnp/common";

// ...

public onInit(): Promise<void> {

  return super.onInit().then(_ => {

    // other init code may be present
    sp.setup({
      spfxContext: this.context,
      sp: {
        fetchClientFactory: () => ,
      },
    });

  });
}

public render(): void {

  sp.web.get().then(t => {
    this.domElement.innerHTML = JSON.stringify(t);
  }).catch(e => {
    this.domElement.innerHTML = JSON.stringify(e);
  });
}
```

#### Calling the any API

You can also use the AdalClient to execute AAD authenticated requests to any API which is properly configured to accept the incoming tokens. This approach will only work within SharePoint Framework >= 1.6. Here we call the SharePoint REST API without the sp library as an example.

```TypeScript
import { AdalClient, FetchOptions } from "@pnp/common";
import { ODataDefaultParser } from "@pnp/odata";

// ...

public render(): void {

  // create an ADAL Client
  const client = AdalClient.fromSPFxContext(this.context);

  // setup the request options
  const opts: FetchOptions = {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  };

  // execute the request
  client.fetch("https://318studios.sharepoint.com/_api/web", opts).then(response => {

    // create a parser to convert the response into JSON.
    // You can create your own, at this point you have a fetch Response to work with
    const parser = new ODataDefaultParser();

    parser.parse(response).then(json => {
      this.domElement.innerHTML = JSON.stringify(json);
    });

  }).catch(e => {
    this.domElement.innerHTML = JSON.stringify(e);
  });

}
```

## Manually Configure

This example shows setting up and using the AdalClient to make queries using information you have setup. You can [review this article](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/guidance/connect-to-api-secured-with-aad) for more information on setting up and securing any application using AzureAD.

### Setup and Use with Microsoft Graph

This sample uses a custom AzureAd app you have created and granted the appropriate permissions.

```TypeScript
import { AdalClient } from "@pnp/common";
import { graph } from "@pnp/graph";

// configure the graph client
// parameters are:
// client id - the id of the application you created in azure ad
// tenant - can be id or URL (shown)
// redirect url - absolute url of a page to which your application and Azure AD app allows replies
graph.setup({
    graph: {
        fetchClientFactory: () => {
            return new AdalClient(
                "e3e9048e-ea28-423b-aca9-3ea931cc7972",
                "{tenant}.onmicrosoft.com",
                "https://myapp/singlesignon.aspx");
        },
    },
});

try {

    // call the graph API
    const groups = await graph.groups.get();

    console.log(JSON.stringify(groups, null, 4));

} catch (e) {
    console.error(e);
}
```

## Nodejs Applications

[We have a dedicated node client in @pnp/nodejs.](https://pnp.github.io/pnpjs/nodejs/docs/adal-fetch-client/)
