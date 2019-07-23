const tasks = require("./build/tools/buildsystem").Tasks.Build,
    path = require("path");

module.exports = {

    packageRoot: path.resolve("./packages/"),

    exclude: ["documentation"],

    preBuildTasks: [
        // function OR { packages: [], task: function }
    ],

    // these tsconfig files will all be transpiled per the settings in the file
    buildTargets: [
        path.resolve("./packages/tsconfig.json"),
        path.resolve("./packages/tsconfig.es5.json"),
    ],

    postBuildTasks: [
        // this task is scoped to the files within the task
        tasks.replaceVersion,
    ],
};
