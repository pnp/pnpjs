const tasks = require("./build/tools/buildsystem").Tasks.Build,
    path = require("path");

const defaultBuildPipeline = [
    tasks.copyAssets,
    tasks.copyPackageFile,
];

const config = {

    packageRoot: path.resolve("./packages/"),

    packageFile: path.resolve("./tsconfig.json"),

    packageFileES5: path.resolve("./tsconfig.es5.json"),

    tasks: [
        tasks.buildProject,
        tasks.buildProjectES5,
    ],

    packages: [
        "logging",
        "common",
        "odata",
        "graph",
        {
            name: "sp",
            buildPipeline: defaultBuildPipeline.slice(0).concat([tasks.replaceSPHttpVersion]),
        },
        "nodejs",
        "sp-addinhelpers",
        "config-store",
        "pnpjs",
        "sp-clientsvc",
        "sp-taxonomy",
    ],

    assets: [
        "../../LICENSE",
        "../readme.md",
        "rollup.*.config.js",
        "**/*.md"
    ],

    buildPipeline: defaultBuildPipeline,
};

module.exports = config;
