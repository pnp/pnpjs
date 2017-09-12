// build funcs
const tasks = require("./build/packages/buildsystem").Tasks,
    path = require("path");

/**
* The configuration used to build the project
*/
const config = {

    // root location, relative 
    packageRoot: path.resolve(".\\"),

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
        "debug",
    ],

    // relative to the package folder
    assets: [],

    // the set of tasks run on each project during a build
    buildChain: [
        tasks.buildProject,
        tasks.replaceDebug,
    ],
}

module.exports = config;
