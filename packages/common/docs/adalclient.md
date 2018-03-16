# @pnp/common/adalclient

_Added in 1.0.4_

This module contains the AdalClient class which can be used to authenticate to any AzureAD secured resource. It is designed to work seamlessly with
SharePoint Framework's permissions as well.

## Configure

This example shows setting up and using the AdalClient to query Microsoft Graph using information you have setup. You can [review this article](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/guidance/connect-to-api-secured-with-aad) for more information on setting up and securing any application using AzureAD. The steps below would be the same though you would use the fetch method of the client directly.

### Setup and Use with Microsoft Graph

This sample uses a custom AzureAd app you have created and granted the appropriate permissions.

```TypeScript
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

### Setup and Use inside SharePoint Framework

If you are working inside of SharePoint Framework you have two options to help you setup the client. You can always use the above setup when needed if you prefer.
For the below setup to work your tenant must have the features [descibed here](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/use-aadhttpclient) enabled and
permissions granted as needed. This means having targeted release activated for everyone, not just select users.

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
