// build funcs
const tasks = require("./build/tools/buildsystem").Tasks.Package,
    path = require("path"),
    getSubDirNames = require("./tools/node-utils/getSubDirectoryNames");

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

    packages: getSubDirNames("./build/packages"),

    assets: [
        "LICENSE",
        "index.d.ts",
        "**\\*.md"
    ],

    packagePipeline: defaultPackagePipeline,
};

module.exports = config;
