# Local Debugging Configuration

This article covers the local setup required to debug the library and run tests. This only needs to be done once (unless you update the app registrations, then you just need to update the settings.js file accordingly).

## Create settings.js

Both local debugging and tests make use of a settings.js file located in the root of the project. Ensure you create a settings.js files by copying settings.example.js and renaming it to settings.js.

The default file content is below:

```js
var settings = {

    testing: {
        enableWebTests: true,
        sp: {
            id: "{ client id }",
            secret: "{ client secret }",
            url: "{ site collection url }",
            notificationUrl: "{ notification url }",
        },
        graph: {
            tenant: "{tenant.onmicrosoft.com}",
            id: "{your app id}",
            secret: "{your secret}"
        },
    }
}

module.exports = settings;
```

As you can see it is an export of a simple JS object, but as it is a js file you can include additional functionality here if you wish.

The settings object has a single sub-object `testing` which contains the configuration used for debugging and testing PnPjs. The parts of this object are described in detail below.

|||
|--|--|
|**enableWebTests**|Flag to toggle if tests are run against the live services or not. If this is set to false none of the other sections are required.|
|**sp**|Settings used to configure SharePoint (sp library) debugging and tests|
|**graph**|Settings used to configure Microsoft Graph (graph library) debugging and tests|

> You can control which tests are run by including or omitting sp and graph sections. If sp is present and graph is not, only sp tests are run. Include both and all tests are run, respecting the enableWebTests flag.

### Minimal Configuration

The following configuration file allows you to run all the tests that do not contact services.

```js
 var sets = {
     testing: {
         enableWebTests: false,
     }
 }

module.exports = sets;
```

### SP values

The sp values are described in the table below and come from [registering a legacy SharePoint add-in](../authentication/sp-app-registration.md).

|name|description|
|--|--|
|**id**|The client id of the registered application|
|**secret**|The client secret of the registered application|
|**url**|The url of the site to use for all requests. If a site parameter is not specified a child web will be created under the web at this url. See [scripts article](../npm-scripts.md) for more details.
|**notificationUrl**|Url used when registering test subscriptions

### Graph value

The graph values are described in the table below and come from [registering an AAD Application](https://docs.microsoft.com/en-us/graph/auth-register-app-v2). The permissions required by the registered application are dictated by the tests you want to run or resources you wish to test against.

|name|description|
|--|--|
|**tenant**|Tenant to target for authentication and data (ex: contoso.onmicrosoft.com)|
|**id**|The application id|
|**secret**|The application secret

## Test your setup

If you hit F5 in VSCode now you should be able to see the full response from getting the web's title in the internal console window. If not, ensure that you have properly updated the settings file and registered the add-in perms correctly.
