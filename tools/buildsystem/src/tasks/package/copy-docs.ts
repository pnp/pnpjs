declare var require: (s: string) => any;
const pump = require("pump");
import { src, dest } from "gulp";
import { PackageSchema } from "./schema";
const path = require("path");

export function copyDocs(version: string, config: PackageSchema) {

    const promises: Promise<void>[] = [];

    for (let i = 0; i < config.packageTargets.length; i++) {

        const packageTarget = config.packageTargets[i];

        const sourceRoot = path.resolve(path.dirname(packageTarget.packageTarget));

        promises.push(new Promise((resolve, reject) => {

            pump([
                src(["./**/*.md"], {
                    cwd: sourceRoot,
                }),
                dest(path.resolve(packageTarget.outDir), <any>{
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
