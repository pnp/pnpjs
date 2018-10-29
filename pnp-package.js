// build funcs
const tasks = require("./build/tools/buildsystem").Tasks.Package,
    path = require("path");

module.exports = {

    packageTargets: [{
        // we only need to package the main tsconfig as we are just using it for references
        // we have previously built all the things
        packageTarget: path.resolve("./packages/tsconfig.json"),
        outDir: path.resolve("./dist/packages/"),
    }],

    prePackageTasks: [],

    packageTasks: [
        tasks.webpack,
        tasks.rollup,
    ],

    postPackageTasks: [
        tasks.writePackageFiles,
        tasks.copyDefs,
        tasks.copyDocs,
        tasks.copyStaticAssets,
    ],
};
