# Debugging

Using the steps in this article you will be able to locally debug the library internals as well as new features you are working on.

## Debugging Library Features in Code using Node

The easiest way to debug the library when working on new features is using F5 in Visual Studio Code. This uses [launch.json](https://github.com/pnp/pnpjs/blob/master/.vscode/launch.json) to build and run the library using [./debug/launch/main.ts](https://github.com/pnp/pnpjs/blob/master/debug/launch/main.ts) as the program entry. You can add any number of files to this directory and they will be ignored by git, however the debug.ts file is not, so please ensure you don't commit any login information.

## Basic SP Testing

Once you have completed the [one time setup](./local-debug-configuration.md) required for sp debugging you can start the base debugging case by hitting F5. Before you do place a break point in ./debug/launch/sp.ts and it should get hit as you execute the code. You can also place a break point within any of the libraries or modules. Feel free to edit the sp.ts file to try things out, quickly test new features, etc - but please don't commit any changes as this is a shared file. See [the section on creating your own debug modules](#how-to-create-a-debug-module).

All of the setup for the node client is handled within sp.ts using the [settings from the local configuration](./local-debug-configuration.md).

## Basic Graph Testing

Testing and debugging graph calls follows the same process as outlined for sp, however you need to update main.ts to import graph instead of sp. You can place break points anywhere within the library code and they should be hit.

All of the setup for the node client is handled within graph.ts using the [settings from the local configuration](./local-debug-configuration.md).

## How to: Create a Debug Module

Using [./debug/launch/sp.ts](https://github.com/pnp/pnpjs/blob/master/debug/launch/sp.ts) as a reference create a file in the debug/launch folder, let's call it mydebug.ts and add this content:

```TypeScript
// note we can use the actual package names for our imports (ex: @pnp/logging)
import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
// using the all preset for simplicity in the example, selective imports work as expected
import { sp, ListEnsureResult } from "@pnp/sp/presets/all";

declare var process: { exit(code?: number): void };

export async function MyDebug() {

    // run some debugging
    const list = await sp.web.lists.ensure("MyFirstList")l

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
}
```

### Update main.ts to launch your module

First comment out the import for the default example and then add the import and function call for yours, the updated launch/main.ts should look like this:

```TypeScript
// ...

// comment out the example
// import { Example } from "./example";
// Example();

import { MyDebug } from "./mydebug"
MyDebug();

// ...
```

> Remember, please don't commit any changes to the shared files within the debug folder. (Unless you've found a bug that needs fixing in the original file)

### Debug

Place a break point within the promise resolution in your debug file and hit F5. Your module should be run and your break point hit. You can then examine the contents of the objects and see the run time state. Remember you can also set breakpoints within the package src folders to see exactly how things are working during your debugging scenarios.

### Debug Module Next Steps

Using this pattern you can create and preserve multiple debugging scenarios in separate modules locally - they won't be added to git. You just have to update main.ts to point to the one you want to run.

## In Browser Debugging

You can also serve files locally to debug as a user in the browser by serving code using ./debug/serve/main.ts as the entry. The file is served as `https://localhost:8080/assets/pnp.js`, allowing you to create a single page in your tenant for in browser testing. The remainder of this section descibes the process to setup a SharePoint page to debug in this manner.

### Start the local serve

This will serve a package with ./debug/serve/main.ts as the entry.

`gulp serve`

### Add reference to library

Within a SharePoint page add a script editor web part and then paste in the following code. The div is to give you a place to target with visual updates should you desire.

```HTML
<script src="https://localhost:8080/assets/pnp.js"></script>
<div id="pnp-test"></div>
```

You should see an alert with the current web's title using the default main.ts. Feel free to update main.ts to do whatever you would like, but rember not to commit changes to the shared files.

### Next Steps

You can make changes to the library and immediately see them reflected in the browser. All files are watched so changes will be available as soon as webpack reloads the package.
