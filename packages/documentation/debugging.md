# Debugging

## Debugging Library Features in Code using Node

The easiest way to debug the library when working on new features is using F5 in Visual Studio Code. This uses the [launch.json](https://github.com/pnp/pnpjs/blob/master/.vscode/launch.json) file to build and run the library using [./debug/launch/main.ts](https://github.com/pnp/pnpjs/blob/master/debug/launch/main.ts) as the program entry. You can add any number of files to this directory and they will be ignored by git, however the debug.ts file is not, so please ensure you don't commit any login information.

### Setup settings.js

If you have not already you need to create a settings.js files by copying settings.example.js and renaming it to settings.js. Then update the clientId, clientSecret, and siteUrl fields in the testing section. (See below for guidance on registering a client id and secret)

### Test your setup

If you hit F5 now you should be able to see the full response from getting the web's title in the internal console window. If not, ensure that you have properly updated the settings file and registered the add-in perms correctly.

### Create a debug module

Using ./debug/launch/example.ts as a reference create a debugging file in the debug folder, let's call it mydebug.ts and add this content:

```TypeScript
// note we can use the actual package names for our imports
import { sp, ListEnsureResult } from "@pnp/sp";
import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";

declare var process: { exit(code?: number): void };

export function MyDebug() {

    // run some debugging
    sp.web.lists.ensure("MyFirstList").then((list: ListEnsureResult) => {

        Logger.log({
            data: list.created,
            message: "Was list created?",
            level: LogLevel.Verbose
        });

        if (list.created) {

            Logger.log({
                data: list.data,
                message: "Raw data from list creation.",
                level: LogLevel.Verbose
            });

        } else {

            Logger.log({
                data: null,
                message: "List already existed!",
                level: LogLevel.Verbose
            });
        }

        process.exit(0);
    }).catch(e => {

        Logger.error(e);
        process.exit(1);
    });
}
```

### Update main.ts to launch your module

First comment out the import for the default example and then add the import and function call for yours, the updated main.ts should look like this:

```TypeScript
// ...

// comment out the example
// import { Example } from "./example";
// Example();

import { MyDebug } from "./mydebug"
MyDebug();

// ...
```

### Debug!

Place a break point within the promise resolution in your debug file and hit F5. Your module should be run and your break point hit. You can then examine the contents of the objects and see the run time state. Remember you can also set breakpoints within the package src folders to see exactly how things are working during your debugging scenarios.

### Next Steps

Using this pattern you can create and preserve multiple debugging scenarios in separate modules locally.

## In Browser Debugging

You can also serve files locally to debug in a browser through two methods. The first will serve code using ./debug/serve/main.ts as the entry. Meaning you can easily
write code and test it in the browser. The second method allows you to serve a single package (bundled with all dependencies) for in browser testing. Both methods serve
the file from https://localhost:8080/assets/pnp.js, allowing you to create a single page in your tenant for in browser testing.

### Start the local serve

This will serve a package with ./debug/serve/main.ts as the entry.

`gulp serve`

### Add reference to library

Within a SharePoint page add a script editor web part and then paste in the following code. The div is to give you a place to target with visual updates should you desire.

```HTML
<script src="https://localhost:8080/assets/pnp.js"></script>
<div id="pnptestdiv"></div>
```

You should see an alert with the current web's title using the default main.ts. Feel free to update main.ts to do whatever you would like, but note that any changes
included as part of a PR to this file will not be allowed.

### Serve a specific package

For example if you wanted to serve the @pnp/sp package for testing you would use:

`gulp serve --p sp`

This will serve a bundle of the sp functionality along with all dependencies and place a global variable named "pnp.{packagename}", in this case pnp.sp. This will be
true for each package, if you served just the graph package the global would be pnp.graph. This mirrors how the umd modules are built in the distributed npm packages
to allow testing with matching packages.

### Next Steps

You can make changes to the library and immediately see them reflected in the browser. All files are watched regardless of which serve method you choose.

## Register an Add-in

Before you can begin debugging you need to register a low-trust add-in with SharePoint. This is primarily designed for Office 365, but can work on-premises if you [configure your farm accordingly](https://msdn.microsoft.com/en-us/library/office/dn155905.aspx).

1. Navigation to {site url}/_layouts/appregnew.aspx
2. Click "Generate" for both the Client Id and Secret values
3. Give you add-in a title, this can be anything but will let you locate it in the list of add-in permissions
4. Provide a fake value for app domain and redirect uri, you can use the values shown in the examples
5. Click "Create"
6. Copy the returned block of text containing the client id and secret as well as app name for your records and later in this article.

### Grant Your Add-In Permissions

Now that we have created an add-in registration we need to tell SharePoint what permissions it can use. Due to an update in SharePoint Online you now have to [register add-ins with certain permissions in the admin site](https://msdn.microsoft.com/en-us/pnp_articles/how-to-provide-add-in-app-only-tenant-administrative-permissions-in-sharepoint-online).

1. Navigate to {admin site url}/_layouts/appinv.aspx
2. Paste your client id from the above section into the Add Id box and click "Lookup"
3. You should see the information populated into the form from the last section, if not ensure you have the correct id value
4. Paste the below XML into the permissions request xml box and hit "Create"
5. You should get a confirmation message.

```XML
  <AppPermissionRequests AllowAppOnlyPolicy="true">
    <AppPermissionRequest Scope="http://sharepoint/content/tenant" Right="FullControl" />
    <AppPermissionRequest Scope="http://sharepoint/social/tenant" Right="FullControl" />
    <AppPermissionRequest Scope="http://sharepoint/search" Right="QueryAsUserIgnoreAppPrincipal" />
  </AppPermissionRequests>
```

**_Note these are very broad permissions to ensure you can test any feature of the library, for production you should tailor the permissions to only those required_**

### Configure the project settings file

1. If you have not already, make a copy of settings.example.js and name it settings.js
2. Edit this file to set the values on the testing.sp object to 
    - id: "The client id you created"
    - secret: "The client secret you created"
    - url: "{site url}"
3. You can disable web tests at any time by setting enableWebTests to false in settings.js, this can be helpful as they take a few minutes to run
