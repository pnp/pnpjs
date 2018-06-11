// build funcs
const tasks = require("./build/tools/buildsystem").Tasks.Build,
    path = require("path");

const defaultBuildPipeline = [

    tasks.buildProject,
    tasks.buildProjectES5,
    tasks.copyAssets,
    tasks.copyPackageFile,
];

/**
 * The configuration used to build the project
 */
const config = {

    // root location, relative
    packageRoot: path.resolve("./packages/"),

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
            buildPipeline: [tasks.installNPMDependencies].concat(defaultBuildPipeline.slice(0)),
        },
        {
            name: "sp",
            buildPipeline: defaultBuildPipeline.slice(0).concat([tasks.replaceSPHttpVersion]),
        },
        "nodejs",
        {
            name: "sp-addinhelpers",
            buildPipeline: [tasks.installNPMDependencies].concat(defaultBuildPipeline.slice(0)),
        },
        "config-store",
        "pnpjs",
        "sp-clientsvc",
        "sp-taxonomy",
    ],

    // relative to the package folder
    assets: [
        "../../LICENSE",
        "../readme.md",
        "rollup.*.config.js",
        "**/*.md"
    ],

    // the set of tasks run on each project during a build
    buildPipeline: defaultBuildPipeline,
};

module.exports = config;
