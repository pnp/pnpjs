import findup from "findup-sync";
import { ConsoleListener, Logger, LogLevel } from "@pnp/logging";
import { ITestingSettings } from "../../test/load-settings.js";

// importing the example debug scenario and running it
// adding your debugging to other files and importing them will keep them out of git
// PRs updating the debug.ts or example.ts will not be accepted unless they are fixing bugs
// add your debugging imports here and prior to submitting a PR git checkout debug/debug.ts
// will allow you to keep all your debugging files locally
// comment out the example
import { Example } from "./sp.js";
// import { Example } from "./graph.js";

// setup the connection to SharePoint using the settings file, you can
// override any of the values as you want here, just be sure not to commit
// your account details :)
// if you don't have a settings file defined this will error
// you can comment it out and put the values here directly, or better yet
// create a settings file using settings.example.js as a template
import(findup("settings.js")).then((settings: { settings: ITestingSettings }) => {

    Logger.activeLogLevel = LogLevel.Info;

    // // setup console logger
    Logger.subscribe(ConsoleListener("Debug", {
        color: "skyblue",
        error: "red",
        verbose: "lightslategray",
        warning: "yellow",
    }));

    Example(settings.settings);

    // you can also set break points inside the src folder to examine how things are working
    // within the library while debugging
});


