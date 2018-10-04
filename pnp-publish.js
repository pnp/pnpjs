const tasks = require("./build/tools/buildsystem").Tasks.Publish,
    path = require("path"),
    getSubDirNames = require("./tools/node-utils/getSubDirectoryNames");

const defaultPublishPipeline = [

    tasks.publishPackage,
];

const config = {

    packageRoot: path.resolve("./dist/packages/"),

    packages: getSubDirNames("./build/packages"),

    publishPipeline: defaultPublishPipeline,
};

module.exports = config;
