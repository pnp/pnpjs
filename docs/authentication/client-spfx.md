# Authentication in SharePoint Framework

## Auth as Current User

PnPjs is designed to work as easily as possible within the SharePoint Framework so the authentication setup is very simple for the base case. Supply the current SharePoint Framework context to the library. This works for both SharePoint authentication and Graph authentication using the current user. Graph permissions are controlled by the permissions granted to the SharePoint shared application within your tenant.

The below example is taken from a SharePoint Framework webpart.

### Connect to SharePoint as Current User

```TypeScript
import { sp } from "@pnp/sp/presets/all";

// ...

protected async onInit(): Promise<void> {

  await super.onInit();

  // other init code may be present

  sp.setup(this.context);
}

// ...
```

### Connect to Graph as Current User

Permissions for this graph connection are controlled by the Shared SharePoint Application. You can target other applications using the [MSAL Client](#msal-client).

```TypeScript
import { graph } from "@pnp/graph/presets/all";

// ...

protected async onInit(): Promise<void> {

  await super.onInit();

  // other init code may be present

  // this will use the ADAL client behind the scenes with no additional configuration work
  graph.setup(this.context);
}

// ...
```


## MSAL Client

You might want/need to use a client configured to use your own AAD application and not the shared SharePoint application. You can do so using the [MSAL client](./msaljsclient.md). Here we show this using graph, this works the same with any of the [setup strategies](../getting-started.md). Please see the [MSAL library docs](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-overview) for more details on what values to supply in the configuration.

> Note: you must install the @pnp/msaljsclient client package before using it

```TypeScript
import { MsalClientSetup  } from "@pnp/msaljsclient";
import { graph } from "@pnp/graph/presets/all";

// ...

protected async onInit(): Promise<void> {

  await super.onInit();

  // other init code may be present

  graph.setup({
      graph: {
          fetchClientFactory: MsalClientSetup({
              auth: {
                  authority: "https://login.microsoftonline.com/common",
                  clientId: "00000000-0000-0000-0000-000000000000",
                  redirectUri: "{your redirect uri}",
              },
              cache: {
                  cacheLocation: "sessionStorage",
              },
          }, ["email", "Files.Read.All", "User.Read.All"]),
      },
  });
}

// ...
```

## ADAL Client

You can use the ADAL client from within SPFx, though it is recommended to transition to the MSAL client.

> Note: you must install the @pnp/adaljsclient client package before using it

```TypeScript
import { AdalClient  } from "@pnp/adaljsclient";
import { graph } from "@pnp/graph/presets/all";

// ...

protected async onInit(): Promise<void> {

  await super.onInit();

  // other init code may be present

  graph.setup({
      graph: {
          fetchClientFactory: () => {
            return new AdalClient(
                "00000000-0000-0000-0000-000000000000",
                "{tenant}.onmicrosoft.com",
                "");
          },
  });
}

// ...
```
