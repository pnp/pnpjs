# @pnp/nodejs/adalcertificatefetchclient

The AdalCertificateFetchClient class depends on the adal-node package to authenticate against Azure AD using the client credentials with a client certificate flow.  The example below
outlines usage with the @pnp/graph library, though it would work in any case where an Azure AD Bearer token is expected.

```TypeScript
import { AdalCertificateFetchClient } from "@pnp/nodejs";
import { graph } from "@pnp/graph";
import * as fs from "fs";
import * as path from "path";

// Get the private key from a file (Assuming it's a .pem file)
const keyPemFile = "/path/to/privatekey.pem";
const privateKey = fs.readFileSync(
    path.resolve(__dirname, keyPemFile), 
    { encoding : 'utf8'}
);

// setup the client using graph setup function
graph.setup({
    graph: {
        fetchClientFactory: () => {
            return new AdalCertificateFetchClient(
                "{tenant id}", 
                "{app id}", 
                "{certificate thumbprint}",
                privateKey);
        },
    },
});

// execute a library request as normal
graph.groups.get().then(g => {

    console.log(JSON.stringify(g, null, 4));

}).catch(e => {

    console.error(e);
});
```