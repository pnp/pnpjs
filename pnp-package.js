// build funcs
const tasks = require("./build/tools/buildsystem").Tasks.Package,
    path = require("path");

const defaultPackagePipeline = [

    tasks.packageProject,
    tasks.copyAssets,
    tasks.copySrc,
    tasks.writePackageFile,
    tasks.uglify,
    tasks.banner,
];

const config = {

    outDir: path.resolve("./dist/packages/"),

    packageRoot: path.resolve("./build/packages/"),

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
        "sp-taxonomy",
    ],

    assets: [
        "LICENSE",
        "index.d.ts",
        "**\\*.md"
    ],

    packagePipeline: defaultPackagePipeline,
};

module.exports = config;
