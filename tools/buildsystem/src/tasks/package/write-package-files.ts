declare var require: (s: string) => any;
const fs = require("fs"),
    path = require("path");

// import { src, dest } from "gulp";
// const pump = require("pump");

import { PackageSchema } from "./schema";
import getSubDirNames from "../../lib/getSubDirectoryNames";

interface TSConfig {
    compilerOptions: {
        outDir: string;
    };
}

/**
 * Writes the package.json for the dist package. This should be last in the pipeline as that allows previous tasks
 * to update the pkgObj as needed before it is written to the fs here. This task does handle the statndard rewrites
 * 
 * @param ctx The build context 
 */
export function writePackageFiles(version: string, config: PackageSchema) {

    const promises: Promise<void>[] = [];

    for (let i = 0; i < config.packageTargets.length; i++) {

        const packageTarget = config.packageTargets[i];

        // read the outdir from the packagetarget
        const buildConfig: TSConfig = require(packageTarget.packageTarget);
        const sourceRoot = path.resolve(path.dirname(packageTarget.packageTarget));
        const buildOutDir = path.resolve(sourceRoot, buildConfig.compilerOptions.outDir);

        // get the sub directories from the output, these will match the folder structure\
        // in the .ts source directory
        const builtFolders = getSubDirNames(buildOutDir);

        for (let j = 0; j < builtFolders.length; j++) {

            // read the package.json from the root of the original source
            const pkg = require(path.resolve(sourceRoot, builtFolders[j], "package.json"));

            pkg.version = version;
            pkg.main = `./dist/${builtFolders[j]}.es5.umd.js`;
            pkg.module = `./dist/${builtFolders[j]}.es5.js`;
            pkg.es2015 = `./dist/${builtFolders[j]}.js`;

            // update our peer dependencies and dependencies placeholder if needed
            for (const key in pkg.peerDependencies) {
                if (pkg.peerDependencies[key] === "0.0.0-PLACEHOLDER") {
                    pkg.peerDependencies[key] = version;
                }
            }

            for (const key in pkg.dependencies) {
                if (pkg.dependencies[key] === "0.0.0-PLACEHOLDER") {
                    pkg.dependencies[key] = version;
                }
            }

            promises.push(new Promise((resolve, reject) => {
                fs.writeFile(path.resolve(packageTarget.outDir, builtFolders[j], "package.json"), JSON.stringify(pkg, null, 4), (err) => {

                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }));
        }
    }

    return Promise.all(promises);
}
