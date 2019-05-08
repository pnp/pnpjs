#!/usr/bin/env node

import * as LiftOff from "liftoff";
import { jsVariants } from "interpret";
import * as yargs from "yargs";
import * as findup from "findup-sync";
import { ConfigCollection, BuildSchema, PackageSchema, PublishSchema } from "../src/config";
import { builder } from "../src/builder";
import { packager } from "../src/packager";
import { publisher } from "../src/publisher";
import "tsconfig-paths/register";

const args = yargs.argv;

const packagePath = findup("package.json");

const BuildSystem = new LiftOff({
    configName: "buildsystem-config",
    extensions: jsVariants,
    name: "buildsystem",
});

BuildSystem.launch({}, async (env: LiftOff.LiftoffEnv) => {

    if (typeof env.configPath === "undefined" || env.configPath === null || env.configPath === "") {
        throw Error("No config file found.");
    }

    const configs: { default: ConfigCollection } = await import(env.configPath);
    const pkg: { version: string } = await import(packagePath);

    let name = <string>(args.n || args.name);

    if (typeof name === "undefined" || name === null || name === "") {
        // default to build if no name is supplied
        name = "build";
    }

    // locate config by name
    const config = configs.default.filter(c => c.name.toLowerCase() === name.toLowerCase());

    if (config.length < 1) {
        throw Error(`No configuration entry found in ${env.configPath} with name ${name}.`);
    }

    switch (config[0].role) {
        case "build":
            builder(pkg.version, <BuildSchema>config[0]);
            break;
        case "package":
            packager(pkg.version, <PackageSchema>config[0]);
            break;
        case "publish":
            publisher(pkg.version, <PublishSchema>config[0]);
            break;
        default:
            throw Error(`Unrecognized role ${config[0].role} in config.`);
    }
});
