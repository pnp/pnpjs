#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const LiftOff = require("liftoff");
const interpret_1 = require("interpret");
const yargs = require("yargs");
const findup = require("findup-sync");
const builder_1 = require("../src/builder");
const packager_1 = require("../src/packager");
const publisher_1 = require("../src/publisher");
const args = yargs.argv;
const packagePath = findup("package.json");
const BuildSystem = new LiftOff({
    configName: "buildsystem-config",
    extensions: interpret_1.jsVariants,
    name: "buildsystem",
});
BuildSystem.launch({}, (env) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    if (typeof env.configPath === "undefined" || env.configPath === null || env.configPath === "") {
        throw Error("No config file found.");
    }
    const configs = yield Promise.resolve().then(() => require(env.configPath));
    const pkg = yield Promise.resolve().then(() => require(packagePath));
    let name = (args.n || args.name);
    if (typeof name === "undefined" || name === null || name === "") {
        name = "build";
    }
    const config = configs.default.filter(c => c.name.toLowerCase() === name.toLowerCase());
    if (config.length < 1) {
        throw Error(`No configuration entry found in ${env.configPath} with name ${name}.`);
    }
    switch (config[0].role) {
        case "build":
            const buildSchema = config[0];
            yield builder_1.builder(pkg.version, buildSchema);
            break;
        case "package":
            yield packager_1.packager(pkg.version, config[0]);
            break;
        case "publish":
            yield publisher_1.publisher(pkg.version, config[0]);
            break;
        default:
            throw Error(`Unrecognized role ${config[0].role} in config.`);
    }
}));
//# sourceMappingURL=buildsystem.js.map