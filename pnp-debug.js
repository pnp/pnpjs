// build funcs
const tasks = require("./build/tools/buildsystem").Tasks.Build,
    path = require("path");

/**
* The configuration used to build the project
*/
const config = {

    // root location, relative
    packageRoot: path.resolve("./debug"),

    /**
     * Single run tasks
     */
    tasks: [
        tasks.buildProject,
    ],

    // the list of packages to be built, in order
    // can be a string name or a plain object with additional settings
    /**
     * Plain object format
     * {
     *      "name": string, // required
     *      "assets": string[], // optional, default is config.assets
     *      "buildChain": (ctx) => Promise<void>[], // optional, default is config.buildChain
     * }
     */
    packages: [
        {
            name: "launch",
            configFile: "tsconfig.json"
        }
    ],

    // relative to the package folder
    assets: [],

    // the set of tasks run on each project during a build
    buildPipeline: [
        tasks.replaceDebug,
    ],

    configFile: "launch/tsconfig.json",
};

module.exports = config;
