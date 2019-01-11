declare var require: (s: string) => any;
const pump = require("pump");
import { src, dest } from "gulp";
import { PackageSchema } from "./schema";
const path = require("path");

interface TSConfig {
    compilerOptions: {
        outDir: string;
    };
}

export function copyDefs(version: string, config: PackageSchema) {

    const promises: Promise<void>[] = [];

    for (let i = 0; i < config.packageTargets.length; i++) {

        const packageTarget = config.packageTargets[i];

        // read the outdir from the packagetarget
        const buildConfig: TSConfig = require(packageTarget.packageTarget);
        const sourceRoot = path.resolve(path.dirname(packageTarget.packageTarget));
        const buildOutDir = path.resolve(sourceRoot, buildConfig.compilerOptions.outDir);

        promises.push(new Promise((resolve, reject) => {

            pump([
                src(["./**/*.d.ts"], {
                    cwd: buildOutDir,
                }),
                dest(path.resolve(packageTarget.outDir), {
                    overwrite: true,
                }),
            ], (err: (Error | null)) => {

                if (err !== undefined) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        }));
    }

    return Promise.all(promises);
}
