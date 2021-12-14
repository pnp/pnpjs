#!/usr/bin/env node

import Liftoff from "liftoff";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { join } from "path";
import { cwd } from "process";
import { ConfigCollection, BuildSchema, PackageSchema, PublishSchema } from "../src/config.js";
import { builder } from "../src/builder.js";
import { packager } from "../src/packager.js";
import { publisher } from "../src/publisher.js";
import importJSON from "../src/lib/importJSON.js";

const args: any = yargs(hideBin(process.argv)).argv;

const packagePath = join(cwd(), 'package.json');

const BuildSystem = new Liftoff({
    configName: "buildsystem-config",
    name: "buildsystem",
});

BuildSystem.prepare({}, function (env) {

    BuildSystem.execute(env, async function (env: Liftoff.LiftoffEnv) {

        if (typeof env.configPath === "undefined" || env.configPath === null || env.configPath === "") {
            throw Error("No config file found.");
        }

        const configs: { default: ConfigCollection } = await import("file://" + env.configPath);
        const pkg: { version: string } = importJSON(packagePath);

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

                await builder(pkg.version, <BuildSchema>config[0]);
                break;

            case "package":

                await packager(pkg.version, <PackageSchema>config[0]);
                break;

            case "publish":

                await publisher(pkg.version, <PublishSchema>config[0]);
                break;

            default:

                throw Error(`Unrecognized role in config.`);
        }
    });
});
