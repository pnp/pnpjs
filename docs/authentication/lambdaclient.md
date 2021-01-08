# @pnp/common/LambdaFetchClient

The LambdaFetchClient class allows you to provide an async function that returns an access token using any logic/supporting libraries you need. This provides total freedom to define how you do authentication, so long as it results in a usable Bearer token to call the target resource. The advantage to the LambdaFetchClient is that you get the url for each request, meaning your logic can account for where the request is headed.

> The token function should be as efficient as possible as it's logic must complete before each request will be sent.

## Signature

The LambdaFetchClient accepts a single argument of type ILambdaTokenFactoryParams.

```TypeScript
// signature of method, the return string is the access token
(parms: ILambdaTokenFactoryParams) => Promise<string>

// ILambdaTokenFactoryParams
export interface ILambdaTokenFactoryParams {
    /**
     * Url to which the request for which we are requesting a token will be sent
     */
    url: string;
    /**
     * Any options supplied for the request
     */
    options: IFetchOptions;
}
```

## @azure/msal-browser example

This example shows how to use [@azure/msal-browser](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser) along with LambdaFetchClient to achieve signin. msal-browser has many possible configurations which are described within their documentation.

```TypeScript
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import { LambdaFetchClient } from "@pnp/common";
import { PublicClientApplication, Configuration } from "@azure/msal-browser";

const config: Configuration = {
    auth: {
        clientId: "{client id}",
        authority: "https://login.microsoftonline.com/common/"
    }
}

// create a single application, could also create this within the lambda client, but it would create a new applicaiton per request
const msal = new PublicClientApplication(config);

// create a new instance of the lambda fetch client
const client = new LambdaFetchClient(async () => {

    const request = {
        scopes: ["User.Read.All"],
    };

    const response = await msal.loginPopup(request);

    // lamba returns the access token
    return response.accessToken;
});

// setup graph with the client
graph.setup({
    graph: {
        fetchClientFactory: () => client,
    },
});

// execute the request to graph which will use the client defined above
const result = await graph.users();
```
