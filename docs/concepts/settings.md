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

## Create Settings.js file

1. Copy the example file and rename it settings.js. Place the file in the root of your project.
2. Update the settings as needed for your environment.

> If you are only doing SharePoint testing you can leave the graph section off and vice-versa. Also, if you are not testing anything with hooks you can leave off the notificationUrl.
