#!/usr/bin/env node

import * as Liftoff from "liftoff";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { dirname, join, resolve } from "path";
import { cwd } from "process";
import importJSON from "../src/lib/import-json.js";
import { BuildTimeline, BuildMoments } from "../src/build-timeline.js";
import { IBuildContext, BuildSchema, TSConfig } from "../src/types.js";

const args: any = yargs(hideBin(process.argv)).argv;

const context: Partial<IBuildContext> = {
    resolvedProjectRoot: join(cwd(), "package.json"),
};

const BuildSystem = new (<any>Liftoff).default({
    configName: "buildsystem-config",
    name: "buildsystem",
});

BuildSystem.prepare({}, function (env) {

    BuildSystem.execute(env, async function (env: Liftoff.LiftoffEnv) {

        if (typeof env.configPath === "undefined" || env.configPath === null || env.configPath === "") {
            throw Error("No config file found.");
        }

        const configs: { default: BuildSchema[] } = await import("file://" + env.configPath);
        const pkg: { version: string } = importJSON(context.resolvedProjectRoot);

        context.version = pkg.version;

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

        const activeConfig = config[0];

        // setup other context values from config
        context.distRoot = config[0].distFolder || "./dist/packages";

        const baseTimeline = new BuildTimeline();

        // now we apply all our configs
        if (activeConfig.behaviors) {
            baseTimeline.using(...activeConfig.behaviors);
        }

        // read in any moment defined observers
        for (let key in BuildMoments) {
            if (activeConfig[key]) {
                baseTimeline.on[key](...activeConfig[key]);
            }
        }

        // now we make an array of timelines 1/target
        const timelines = config[0].targets.map(tsconfigPath => {

            const tsconfigRoot = resolve(dirname(tsconfigPath));
            const parsedTSConfig: TSConfig = importJSON(tsconfigPath);
            const resolvedOutDir = resolve(tsconfigRoot, parsedTSConfig.compilerOptions.outDir);

            const packages = [];

            if (parsedTSConfig.references) {
                // we need to resolve some extra data for each package
                packages.push(...parsedTSConfig.references.map(ref => ({

                    name: dirname(ref.path).replace(/^\.\//, ""),
                    resolvedPkgSrcTSConfigPath: resolve(tsconfigRoot, ref.path),
                    resolvedPkgSrcRoot: dirname(resolve(tsconfigRoot, ref.path)),
                    resolvedPkgOutRoot: resolve(resolvedOutDir, dirname(ref.path)),
                    resolvedPkgDistRoot: resolve(context.distRoot, dirname(ref.path)),
                    relativePkgDistModulePath: resolvedOutDir.replace(dirname(resolvedOutDir), "").replace(/^\\|\//, ""),
                })));
            } else {
                // we have a single package (debug for example)
                packages.push({
                    name: "root",
                    resolvedPkgSrcTSConfigPath: tsconfigRoot,
                    resolvedPkgSrcRoot: tsconfigRoot,
                    resolvedPkgOutRoot: resolvedOutDir,
                    resolvedPkgDistRoot: context.distRoot,
                    relativePkgDistModulePath: context.distRoot,                    
                });
            }
            
            return Object.assign({}, context, {
                target: {
                    tsconfigPath,
                    tsconfigRoot,
                    parsedTSConfig,
                    resolvedOutDir,
                    packages,
                }
            });
        }).map(context => new BuildTimeline(baseTimeline, context));

        // we start one timeline per target
        await Promise.all(timelines.map(tl => tl.start()));
    });
});
