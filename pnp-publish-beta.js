// build funcs
const tasks = require("./build/tools/buildsystem").Tasks.Publish,
    path = require("path");
    basePublishConfig = require("./pnp-publish");

const defaultPublishBetaPipeline = [

    tasks.publishBetaPackage,
];

basePublishConfig.publishPipeline = defaultPublishBetaPipeline;

module.exports = basePublishConfig;
