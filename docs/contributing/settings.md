# Project Settings

This article discusses creating a project settings file for use in local development and debugging of the libraries. The settings file contains authentication and other settings to enable you to run and debug the project locally.

The settings file is a JavaScript file that exports a single object representing the settings of your project. You can [view the example settings file in the project root](https://github.com/pnp/pnpjs/blob/main/settings.example.js).

## Settings File Format (>= 2.0.13)

Starting with version 2.0.13 we have added support within the settings file for MSAL authentication for both SharePoint and Graph. You are NOT required to update your existing settings file unless you want to use MSAL authentication with a Graph application. The existing id/secret settings continue to work however we recommend updating when you have an opportunity. For more information coinfiguring MSAL please review the section in the [authentication section for node](../authentication/server-nodejs.md#msal).

MSAL configuration has two parts, these are the initialization which is passed directly to the MsalFetchClient (and on to the underlying msal-node instance) and the scopes. The scopes are always "https://{tenant}.sharepoint.com/.default" or "https://graph.microsoft.com/.default" depending on what you are calling.

> If you are calling Microsoft Graph sovereign or gov clouds the scope may need to be updated.

```JavaScript
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
your private key, read from a file or included here
-----END RSA PRIVATE KEY-----
`;

var msalInit = {
    auth: {
        authority: "https://login.microsoftonline.com/{tenant id}",
        clientCertificate: {
            thumbprint: "{certificate thumbnail}",
            privateKey: privateKey,
        },
        clientId: "{AAD App registration id}",
    }
}

var settings = {
    testing: {
        enableWebTests: true,
        testUser: "i:0#.f|membership|user@consto.com",
        sp: {
            url: "{required for MSAL - absolute url of test site}",
            notificationUrl: "{ optional: notification url }",
            msal: {
                init: msalInit,
                scopes: ["https://{tenant}.sharepoint.com/.default"]
            },
        },
        graph: {
            msal: {
                init: msalInit,
                scopes: ["https://graph.microsoft.com/.default"]
            },
        },
    },
}

module.exports = settings;
```

The settings object has a single sub-object `testing` which contains the configuration used for debugging and testing PnPjs. The parts of this object are described in detail below.

|||
|--|--|
|**enableWebTests**|Flag to toggle if tests are run against the live services or not. If this is set to false none of the other sections are required.|
|**testUser**|AAD login account to be used when running tests.|
|**sp**|Settings used to configure SharePoint (sp library) debugging and tests|
|**graph**|Settings used to configure Microsoft Graph (graph library) debugging and tests|

### SP values

|name|description|
|--|--|
|**url**|The url of the site to use for all requests. If a site parameter is not specified a child web will be created under the web at this url. See [scripts article](../npm-scripts.md) for more details.
|**notificationUrl**|Url used when registering test subscriptions
|**msal**|Information about MSAL authentication setup

### Graph value

The graph values are described in the table below and come from [registering an AAD Application](https://docs.microsoft.com/en-us/graph/auth-register-app-v2). The permissions required by the registered application are dictated by the tests you want to run or resources you wish to test against.

|name|description|
|--|--|
|**msal**|Information about MSAL authentication setup

## Settings File Format (<= 2.0.12)

```JavaScript
var settings = {

    testing: {
        enableWebTests: true,
        sp: {
            id: "{ client id }",
            secret: "{ client secret }",
            url: "{ site collection url }",
            notificationUrl: "{ optional: notification url }",
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

|||
|--|--|
|**enableWebTests**|Flag to toggle if tests are run against the live services or not. If this is set to false none of the other sections are required.|
|**sp**|Settings used to configure SharePoint (sp library) debugging and tests|
|**graph**|Settings used to configure Microsoft Graph (graph library) debugging and tests|

### SP values

The sp values are described in the table below and come from [registering a legacy SharePoint add-in](../authentication/sp-app-registration.md).

|name|description|
|--|--|
|**id**|The client id of the registered application|
|**secret**|The client secret of the registered application|
|**url**|The url of the site to use for all requests. If a site parameter is not specified a child web will be created under the web at this url. See [scripts article](../npm-scripts.md) for more details.
|**notificationUrl**|Url used when registering test subscriptions

### Graph values

The graph values are described in the table below and come from [registering an AAD Application](https://docs.microsoft.com/en-us/graph/auth-register-app-v2). The permissions required by the registered application are dictated by the tests you want to run or resources you wish to test against.

|name|description|
|--|--|
|**tenant**|Tenant to target for authentication and data (ex: contoso.onmicrosoft.com)|
|**id**|The application id|
|**secret**|The application secret

## Create Settings.js file

1. Copy the example file and rename it settings.js. Place the file in the root of your project.
2. Update the settings as needed for your environment.

> If you are only doing SharePoint testing you can leave the graph section off and vice-versa. Also, if you are not testing anything with hooks you can leave off the notificationUrl.
