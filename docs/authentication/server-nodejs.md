# Authentication in Nodejs

## SharePoint App Registration

> Due to a recent change in how SPO is configured NEW tenants will have ACS authentication _disabled_ by default. You can read more [details in this article](https://docs.microsoft.com/en-us/sharepoint/dev/solution-guidance/security-apponly-azureacs). For testing we recommend using [MSAL Certificate Auth](#msal).

Within the PnPjs testing framework we make use of SharePoint App Registration. This uses the `SPFetchClient` client from the nodejs package. This client works based on the [legacy SharePoint App Registration model](https://docs.microsoft.com/en-us/sharepoint/dev/solution-guidance/security-apponly-azureacs) making use of a client and secret granted permissions through AppInv.aspx. This method works and at the time of writing has no published end date.

See: [details on how to register a legacy SharePoint application](./sp-app-registration.md).

```TypeScript
import { SPFetchClient } from "@pnp/nodejs";
import { sp } from "@pnp/sp/presets/all";

sp.setup({
    sp: {
        fetchClientFactory: () => {
            return new SPFetchClient("{site url}", "{client id}", "{client secret}");
        },
    },
});

// execute a library request as normal
const w = await sp.web.get();
```


## MSAL

_Added in 2.0.11_

You can now use the [@azure/msal-node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) client with PnPjs using MsalFetchClient. You must configure an AAD application with the appropriate permissions for your application.

> At the time this article was written the msal-node package is not yet GA.

### Call Graph

You can call the Microsoft Graph API with a client id and secret or certificate (see SharePoint example for cert auth)

```TypeScript
import { graph } from "@pnp/graph/presets/all";

// configure your node options
graph.setup({
  graph: {
    fetchClientFactory: () => {
      return new MsalFetchClient({
        auth: {
          authority: "https://login.microsoftonline.com/{tenant id or common}",
          clientId: "{guid}",
          clientSecret: "{client secret}",
        }
      });
    },
  },
});

const userInfo = await graph.users();
```

### Call SharePoint

To call the SharePoint APIs via MSAL you are required to use certificate authentication with your application. Fully covering certificates is outside the scope of these docs, but the following commands were used with openssl to create testing certs for the sample code below.

```CMD
mkdir \temp
cd \temp
openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365 -passout pass:HereIsMySuperPass -subj '/C=US/ST=Washington/L=Seattle'
openssl rsa -in keytmp.pem -out key.pem -passin pass:HereIsMySuperPass
```

Using the above code you end up with three files, "cert.pem", "key.pem", and "keytmp.pem". The "cert.pem" file is uploaded to your AAD application registration. The "key.pem" is read as the private key for the configuration.

> You need to set the baseUrl property when using the MsalFetchClient

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import { readFileSync } from "fs";

// read in our private key
const buffer = readFileSync("c:/temp/key.pem");

// configure node options
sp.setup({
  sp: {
    baseUrl: "https://{my tenant}.sharepoint.com/sites/dev/",
    fetchClientFactory: () => {
      return new MsalFetchClient({
        auth: {
          authority: "https://login.microsoftonline.com/{tenant id or common}",
          clientCertificate: {
            thumbprint: "{certificate thumbprint, displayed in AAD}",
            privateKey: buffer.toString(),
          },
          clientId: "{client id}",
        }
      }, ["https://{my tenant}.sharepoint.com/.default"]); // you must set the scope for SharePoint access
    },
  },
});

const w = await sp.web();
```

## ADAL

The AdalFetchClient class depends on the [adal-node](https://www.npmjs.com/package/adal-node) package to authenticate against Azure AD. The example below
outlines usage with the @pnp/graph library, though it would work in any case where an Azure AD Bearer token is expected.

See: [More details on the node client](../nodejs/adal-fetch-client.md)

```TypeScript
import { AdalFetchClient } from "@pnp/nodejs";
import { graph } from "@pnp/graph/presets/all";

// setup the client using graph setup function
graph.setup({
    graph: {
        fetchClientFactory: () => {
            return new AdalFetchClient("{tenant}", "{app id}", "{app secret}");
        },
    },
});

// execute a library request as normal
const g = await graph.groups.get();

console.log(JSON.stringify(g, null, 4));
```
