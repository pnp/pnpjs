# Debugging

## Debugging Library Features in Code using Node

The easiest way to debug the library when working on new features is using F5 in Visual Studio Code. This uses [launch.json](https://github.com/pnp/pnpjs/blob/master/.vscode/launch.json) to build and run the library using [./debug/launch/main.ts](https://github.com/pnp/pnpjs/blob/master/debug/launch/main.ts) as the program entry. You can add any number of files to this directory and they will be ignored by git, however the debug.ts file is not, so please ensure you don't commit any login information.

### How to create a debug module

Using ./debug/launch/example.ts as a reference create a debugging file in the debug/launch folder, let's call it mydebug.ts and add this content:

```TypeScript
// note we can use the actual package names for our imports
import { sp, ListEnsureResult } from "@pnp/sp";
import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";

declare var process: { exit(code?: number): void };

export function MyDebug() {

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

> Remember, please don't commit your changes to main.ts

### Debug

Place a break point within the promise resolution in your debug file and hit F5. Your module should be run and your break point hit. You can then examine the contents of the objects and see the run time state. Remember you can also set breakpoints within the package src folders to see exactly how things are working during your debugging scenarios.

### Debug Module Next Steps

Using this pattern you can create and preserve multiple debugging scenarios in separate modules locally.

## In Browser Debugging

You can also serve files locally to debug as a user in the browser by serving code using ./debug/serve/main.ts as the entry. Meaning you can easily
write code and test it in the browser. The file is served as `https://localhost:8080/assets/pnp.js`, allowing you to create a single page in your tenant for in browser testing.

### Start the local serve

This will serve a package with ./debug/serve/main.ts as the entry.

`gulp serve`

### Add reference to library

Within a SharePoint page add a script editor web part and then paste in the following code. The div is to give you a place to target with visual updates should you desire.

```HTML
<script src="https://localhost:8080/assets/pnp.js"></script>
<div id="pnp-test"></div>
```

You should see an alert with the current web's title using the default main.ts. Feel free to update main.ts to do whatever you would like, but note that any changes
included as part of a PR to this file will not be allowed.

### Next Steps

You can make changes to the library and immediately see them reflected in the browser. All files are watched regardless of which serve method you choose.
