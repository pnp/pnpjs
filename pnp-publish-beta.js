const tasks = require("./build/tools/buildsystem").Tasks.Publish,
    path = require("path");

module.exports = {

    packageRoot: path.resolve("./dist/packages"),

    prePublishTasks: [],

    publishTasks: [tasks.publishBetaPackage],

    postPublishTasks: [],
}
