import mkdir from "mkdirp";
import { resolve, dirname, join } from "path";
import { writeFile } from "fs";

import { PackageTargetMap } from "../../config.js";
import getSubDirNames from "../../lib/getSubDirs.js";
import importJSON from "../../lib/importJSON.js";

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
export function createWritePackageFiles(transform: (pkg: any) => any = (p) => Object.assign({}, p)) {

    return (target: PackageTargetMap, version: string) => {

        const promises: Promise<void>[] = [];

        // read the outdir from the packagetarget
        const buildConfig: TSConfig = importJSON(target.target);
        const sourceRoot = resolve(dirname(target.target));
        const buildOutDir = resolve(sourceRoot, buildConfig.compilerOptions.outDir);

        // get the sub directories from the output, these will match the folder structure
        // in the .ts source directory
        const builtFolders = getSubDirNames(buildOutDir);

        for (let j = 0; j < builtFolders.length; j++) {

            // read the package.json from the root of the original source
            let pkg = importJSON(resolve(sourceRoot, builtFolders[j], "package.json"));

            pkg.version = version;
            pkg.main = `./index.js`;

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

            // finally call our transform function giving the caller the ability to make any final edits
            pkg = transform(pkg);

            promises.push(new Promise((res, reject) => {
                const folderPath = resolve(target.outDir, builtFolders[j]);
                mkdir.sync(folderPath);
                writeFile(join(folderPath, "package.json"), JSON.stringify(pkg, null, 4), (err) => {

                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        res();
                    }
                });
            }));
        }

        return Promise.all(promises);
    };
}
