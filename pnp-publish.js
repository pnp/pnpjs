// build funcs
const tasks = require("./build/tools/buildsystem").Tasks.Publish,
    path = require("path");

const defaultPublishPipeline = [

    tasks.publishPackage,
];

/**
* The configuration used to build the project
*/
const config = {

    // root location, relative 
    packageRoot: path.resolve(".\\dist\\packages\\"),

    // the list of packages to be built, in order
    // can be a string name or a plain object with additional settings
    /**
     * Plain object format
     * {
     *      "name": string, // required
     *      "assets": string[], // optional, default is config.assets
     *      "buildChain": (ctx) => Promise<void>[], // optional, default is config.buildChain
     * }
     * 
     */
    packages: [
        "logging",
        "common",
        "odata",
        "graph",
        "sp",
        "nodejs",
        "sp-addinhelpers",
        "config-store",
        "pnpjs",
        "sp-clientsvc",
        "sp-taxonomy"
    ],

    // the set of tasks run on each project during a build
    publishPipeline: defaultPublishPipeline,
};

module.exports = config;