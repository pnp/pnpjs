const tasks = require("./build/tools/buildsystem").Tasks.Build,
    path = require("path");

module.exports = {

    packageRoot: path.resolve("./debug/"),

    exclude: [],

    preBuildTasks: [
        // function OR { packages: [], task: function }
    ],

    // these tsconfig files will all be transpiled per the settings in the file
    buildTargets: [
        path.resolve("./debug/launch/tsconfig.json"),
    ],

    postBuildTasks: [
        tasks.replaceDebug,
    ],
};
