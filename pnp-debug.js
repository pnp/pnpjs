const tasks = require("./build/tools/buildsystem").Tasks.Build,
    path = require("path");

const config = {

    packageRoot: path.resolve("./debug"),

    tasks: [
        tasks.buildProject,
    ],

    packages: [
        {
            name: "launch",
            configFile: "tsconfig.json"
        }
    ],

    assets: [],

    buildPipeline: [
        tasks.replaceDebug,
    ],

    configFile: "launch/tsconfig.json",
};

module.exports = config;
