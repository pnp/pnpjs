# Project Settings

This article discusses creating a project settings file for use in local development and debugging of the libraries. The settings file contains authentication and other settings to enable you to run and debug the project locally.

The settings file is a JavaScript file that exports a single object representing the settings of your project. You can [view the example settings file in the project root](https://github.com/pnp/pnpjs/blob/main/settings.example.js).

## Settings File Format

The settings file is configured with MSAL authentication for both SharePoint and Graph. For more information coinfiguring MSAL please review the section in the [authentication section for node](../concepts/authentication.md#MSAL-Nodejs).

MSAL configuration has two parts, these are the initialization which is passed directly to the MsalFetchClient (and on to the underlying msal-node instance) and the scopes. The scopes are always "https://{tenant}.sharepoint.com/.default" or "https://graph.microsoft.com/.default" depending on what you are calling.

> If you are calling Microsoft Graph sovereign or gov clouds the scope may need to be updated.

You will need to create testing certs for the sample settings file below. Using the following code you end up with three files, "cert.pem", "key.pem", and "keytmp.pem". The "cert.pem" file is uploaded to your AAD application registration. The "key.pem" is read as the private key for the configuration. Copy the contents of the "key.pem" file and paste it in the `privateKey` variable below. The `gitignore` file in this repository will ignore the settings.js file.

>Replace `HereIsMySuperPass` with your own password

```cmd
mkdir \temp
cd \temp
openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365 -passout pass:HereIsMySuperPass -subj '/C=US/ST=Washington/L=Seattle'
openssl rsa -in keytmp.pem -out key.pem -passin pass:HereIsMySuperPass
```

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

export const settings = {
    testing: {
        enableWebTests: true,
        testUser: "i:0#.f|membership|user@consto.com",
        testGroupId:"{ Microsoft 365 Group ID }",
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

```

The settings object has a single sub-object `testing` which contains the configuration used for debugging and testing PnPjs. The parts of this object are described in detail below.

|||
|--|--|
|**enableWebTests**|Flag to toggle if tests are run against the live services or not. If this is set to false none of the other sections are required.|
|**testUser**|AAD login account to be used when running tests.|
|**testGroupId**|Group ID of Microsoft 365 Group to be used when running test cases.|
|**sp**|Settings used to configure SharePoint (sp library) debugging and tests|
|**graph**|Settings used to configure Microsoft Graph (graph library) debugging and tests|

### SP values

|name|description|
|--|--|
|**url**|The url of the site to use for all requests. If a site parameter is not specified a child web will be created under the web at this url. See [scripts article](./npm-scripts.md) for more details.
|**notificationUrl**|Url used when registering test subscriptions
|**msal**|Information about MSAL authentication setup

### Graph value

The graph values are described in the table below and come from [registering an AAD Application](https://docs.microsoft.com/en-us/graph/auth-register-app-v2). The permissions required by the registered application are dictated by the tests you want to run or resources you wish to test against.

|name|description|
|--|--|
|**msal**|Information about MSAL authentication setup

## Create Settings.js file

1. Copy the example file and rename it settings.js. Place the file in the root of your project.
2. Update the settings as needed for your environment.

> If you are only doing SharePoint testing you can leave the graph section off and vice-versa. Also, if you are not testing anything with hooks you can leave off the notificationUrl.
