# Authentication in Nodejs

## SharePoint App Registration

> Due to a recent change in how SPO is configured NEW tenants will have ACS authentication _disabled_ by default. You can read more [details in this article](https://docs.microsoft.com/en-us/sharepoint/dev/solution-guidance/security-apponly-azureacs). For testing we recommend using [MSAL Certificate Auth](#msal).


## MSAL

We now use the [@azure/msal-node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) client with PnPjs. You must configure an AAD application with the appropriate permissions for your application.

> At the time this article was written the msal-node package is not yet GA.

### Call Graph

You can call the Microsoft Graph API with a client id and secret or certificate (see SharePoint example for cert auth)

```TypeScript
import { graphfi } from "@pnp/graph";
import { GraphDefault } from "@pnp/nodejs";
import "@pnp/graph/users";

// configure your node options
const graph = graphfi()
.using(GraphDefault({
  baseUrl: 'https://graph.microsoft.com',
  msal: {
    config: config,
    scopes: [ 'https://graph.microsoft.com/.default' ]
  }
}));

const userInfo = await graph.users.top(1)();
console.log(JSON.stringify(userInfo, null, 2));
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

```TypeScript
import { spFI } from "@pnp/sp";
import { SPDefault } from "@pnp/nodejs";
import "@pnp/sp/webs";
import { readFileSync } from "fs";

// read in our private key
const buffer = readFileSync("c:/temp/key.pem");

// configure node options
const config:any = {
  auth: {
    authority: "https://login.microsoftonline.com/{tenant id or common}/",
    clientId: "{application (client) id}",
    clientCertificate: {
      thumbprint: "{certificate thumbprint, displayed in AAD}",
      privateKey: buffer.toString(),
    },
  },
};

const sp = spfi('https://{my tenant}.sharepoint.com/sites/dev/')
.using(SPDefault({
  baseUrl: 'https://{my tenant}.sharepoint.com/sites/dev/',
  msal: {
    config: config,
    scopes: [ 'https://{my tenant}.sharepoint.com/.default' ]
  }
}));

const w = await sp.web();
```
