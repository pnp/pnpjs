// build funcs
const tasks = require("./build/packages/buildsystem").Tasks.Publish,
    path = require("path");
    basePublishConfig = require("./pnp-publish");

const defaultPublishBetaPipeline = [

    tasks.publishBetaPackage,
];

basePublishConfig.publishPipeline = defaultPublishBetaPipeline;

module.exports = basePublishConfig;
