#!/usr/bin/env node

import Liftoff from "liftoff";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { dirname, join, resolve } from "path";
import { cwd } from "process";
import importJSON from "../src/lib/import-json.js";
import { BuildTimeline } from "../src/build-timeline.js";
import { IBuildContext, BuildSchema, TSConfig } from "../src/types.js";
import { Logger, ConsoleListener, LogLevel, PnPLogging } from "@pnp/logging";


import Build from "../src/behaviors/build.js";
import ReplaceVersion from "../src/behaviors/replace-version.js";
import CopyPackageFiles from "../src/behaviors/copy-package-files.js";
import CopyAssetFiles from "../src/behaviors/copy-asset-files.js";
import WritePackageJSON from "../src/behaviors/write-packagejson.js";
import Publish from "../src/behaviors/publish.js";

const args: any = yargs(hideBin(process.argv)).argv;

const context: Partial<IBuildContext> = {
    resolvedProjectRoot: join(cwd(), "package.json"),
};

const BuildSystem = new Liftoff({
    configName: "buildsystem-config2",
    name: "buildsystem",
});

// setup console logger
Logger.subscribe(ConsoleListener("", {
    color: "skyblue",
    error: "red",
    verbose: "lightslategray",
    warning: "yellow",
}));

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

        // setup other context values from config
        context.distRoot = config[0].distFolder || "./dist/packages";

        // we setup a baseTimeline to which we attach all the behaviors, then pass it as the base for target timelines
        const baseTimeline = new BuildTimeline().using(
            PnPLogging(LogLevel.Verbose),
            Build(),
            ReplaceVersion(["sp/behaviors/telemetry.js", "graph/behaviors/telemetry.js"]),
            CopyPackageFiles("src", ["**/*.cjs"]),
            CopyAssetFiles(".", ["LICENSE"]),
            CopyAssetFiles("./packages", ["readme.md"]),
            CopyPackageFiles("built", ["**/*.d.ts", "**/*.js", "**/*.js.map", "**/*.d.ts.map"]),
            WritePackageJSON((p) => {
                return Object.assign({}, p, {
                    funding: {
                        type: "individual",
                        url: "https://github.com/sponsors/patrick-rodgers/",
                    },
                    type: "module",
                    engines: {
                        node: ">=14.15.1"
                    },
                    author: {
                        name: "Microsoft and other contributors"
                    },
                    license: "MIT",
                    bugs: {
                        url: "https://github.com/pnp/pnpjs/issues"
                    },
                    homepage: "https://github.com/pnp/pnpjs",
                    repository: {
                        type: "git",
                        url: "git:github.com/pnp/pnpjs"
                    }
                });
            }),
            Publish(),
        );

        // now we make an array of timelines 1/target
        const timelines = config[0].targets.map(tsconfigPath => {

            const tsconfigRoot = resolve(dirname(tsconfigPath));
            const parsedTSConfig: TSConfig = importJSON(tsconfigPath);
            const resolvedOutDir = resolve(tsconfigRoot, parsedTSConfig.compilerOptions.outDir);

            // we need to get some extra data for each package
            const packages = parsedTSConfig?.references.map(ref => ({

                name: dirname(ref.path).replace(/^\.\//, ""),
                resolvedPkgSrcTSConfigPath: resolve(tsconfigRoot, ref.path),
                resolvedPkgSrcRoot: dirname(resolve(tsconfigRoot, ref.path)),
                resolvedPkgOutRoot: resolve(resolvedOutDir, dirname(ref.path)),
                resolvedPkgDistRoot: resolve(context.distRoot, dirname(ref.path)),
            }));

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
