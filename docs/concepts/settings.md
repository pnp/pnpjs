# Project Settings

This article discusses creating a project settings file for use in local development and debugging of the libraries. The settings file contains authentication and other settings to enable you to run and debug the project locally.

## Settings File Format

The settings file is a JavaScript file that exports a single object representing the settings of your project. You can [view the example settings file in the project root](https://github.com/pnp/pnpjs/blob/dev-v2/settings.example.js).

```JavaScript
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

## Create Settings.js file

1. Copy the example file and rename it settings.js. Place the file in the root of your project.
2. Update the settings as needed for your environment.

> If you are only doing SharePoint testing you can leave the graph section off and vice-versa. Also, if you are not testing anything with hooks you can leave off the notificationUrl.
