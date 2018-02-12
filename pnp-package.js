// build funcs
const tasks = require("./build/tools/buildsystem").Tasks.Package,
    path = require("path");

const defaultPackagePipeline = [

    tasks.packageProject,
    tasks.copyAssets,
    tasks.copySrc,
    tasks.writePackageFile,
    tasks.uglify,
    tasks.bundle,
    tasks.banner,
];

/**
 * The configuration used to build the project
 */
const config = {

    /**
     * The directory to which packages will be written
     */
    outDir: path.resolve(".\\dist\\packages\\"),

    // root location, relative 
    packageRoot: path.resolve(".\\build\\packages\\"),

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
        "teams",
        "nodejs",
        "sp-addinhelpers",
        "config-store",
        "pnpjs",
    ],

    assets: [
        "LICENSE",
        "index.d.ts",
        "**\\*.md"
    ],

    // the set of tasks run on each project during a build
    packagePipeline: defaultPackagePipeline,
}

module.exports = config;