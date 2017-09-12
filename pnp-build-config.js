// build funcs
const tasks = require("./tooling/build/tasks"),
    path = require("path");

const defaultBuildChain = [
    tasks.buildProject,
    tasks.copyStaticAssets,
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
        "graph",
        {
            name: "sp",
            buildChain: defaultBuildChain.slice(0).concat([tasks.doSPVersionStringReplace]),
        },
        "nodejs",
        {
            name: "sp-addinhelpers",
            buildChain: [tasks.installNPMDependencies].concat(defaultBuildChain.slice(0)),
        }
        
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