// build funcs
const tasks = require("./build/packages/buildsystem").Tasks,
    path = require("path");

const defaultBuildChain = [

    tasks.buildProject,
    tasks.copyAssets,
    tasks.copyPackageFile,
];

/**
 * The configuration used to build the project
 */
const config = {

    // root location, relative 
    packageRoot: path.resolve(".\\packages\\"),

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
        {
            name: "graph",
            buildChain: [tasks.installNPMDependencies].concat(defaultBuildChain.slice(0)),
        },
        {
            name: "sp",
            buildChain: defaultBuildChain.slice(0).concat([tasks.replaceSPHttpVersion]),
        },
        "nodejs",
        {
            name: "sp-addinhelpers",
            buildChain: [tasks.installNPMDependencies].concat(defaultBuildChain.slice(0)),
        },
        "config-store"
    ],

    // relative to the package folder
    assets: [
        "..\\..\\LICENSE",
        "..\\readme.md",
    ],

    // the set of tasks run on each project during a build
    buildChain: defaultBuildChain,
}

module.exports = config;