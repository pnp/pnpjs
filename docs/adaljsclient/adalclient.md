# @pnp/common/adalclient

This module contains the AdalClient class which can be used to authenticate to any AzureAD secured resource. It is designed to work seamlessly with
SharePoint Framework's permissions.

## Setup and Use inside SharePoint Framework

Using the SharePoint Framework is the prefered way to make use of the AdalClient as we can use the AADTokenProvider to efficiently get tokens on yoru behalf. You can also read more about how this process works and the necessary SPFx configurations in the [SharePoint Framework 1.6 release notes](https://github.com/SharePoint/sp-dev-docs/wiki/SharePoint-Framework-v1.6-release-notes#moving-from-beta-to-public---webapi). This method only work for SharePoint Framework >= 1.6. For earlier versions of SharePoint Framework you can still use the AdalClient as outlined above using the constructor to specify the values for an AAD Application you have setup.

#### Calling the SharePoint API

This example shows how to use the ADALClient with the @pnp/sp library to call an API secured with AAD.

```TypeScript
import { sp } from "@pnp/sp/presets/all";
import { AdalClient } from "@pnp/adaljsclient";

// ...

public onInit(): Promise<void> {

  return super.onInit().then(_ => {

    // other init code may be present
    sp.setup({
      spfxContext: this.context,
      sp: {
        fetchClientFactory: () => AdalClient.fromSPFxContext(this.context),
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
import { FetchOptions } from "@pnp/common";
import { AdalClient } from "@pnp/adaljsclient";
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

## Nodejs Applications

[We have a dedicated node client in @pnp/nodejs.](https://pnp.github.io/pnpjs/nodejs/docs/adal-fetch-client/)
