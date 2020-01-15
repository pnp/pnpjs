declare var require: (s: string) => any;
const pump = require("pump");
import { src, dest } from "gulp";
import { PackageSchema } from "../../config";
import { resolve, dirname } from "path";
import getSubDirectoryNames from "../../lib/getSubDirectoryNames";

interface TSConfig {
    compilerOptions: {
        outDir: string;
    };
}

/**
 * Copies all the files for the packaging targets moduleTarget option
 * 
 * BuildDir (source)
 * |-ModuleBuildDir (modulePackageTarget's outDir param)
 *   |-Package.1
 *     |-ModuleFiles.1
 *   |-Package.2
 *     |-ModuleFiles.2
 *   |-Package.n
 *     |-ModuleFiles.n
 * 
 * OutDir (buildConfig.compilerOptions.outDir)
 *   |-Package.1
 *     |-module
 *       |-ModuleFiles.1
 *   |-Package.2
 *     |-module
 *       |-ModuleFiles.2
 *   |-Package.n
 *     |-module
 *       |-ModuleFiles.n
 *  
 */
export function copyModuleFiles(_version: string, config: PackageSchema) {

    for (let i = 0; i < config.packageTargets.length; i++) {

        const packageTarget = config.packageTargets[i];

        if (!packageTarget.moduleTarget) {
            continue;
        }

        // read the outdir from the packagetarget
        const buildConfig: TSConfig = require(packageTarget.moduleTarget);
        const sourceRoot = resolve(dirname(packageTarget.moduleTarget));
        const buildOutDir = resolve(sourceRoot, buildConfig.compilerOptions.outDir);

        const dirs = getSubDirectoryNames(buildOutDir);

        dirs.forEach(async dir => {

            // grab files and move to correct subfolder
            await new Promise((res, rej) => {

                pump([
                    src(["./**/*.d.ts", "./**/*.js"], {
                        cwd: resolve(buildOutDir, dir),
                    }),
                    dest(resolve(packageTarget.outDir, dir, "module"), {
                        overwrite: true,
                    }),
                ], (err: (Error | null)) => {

                    if (err !== undefined) {
                        console.error(err);
                        rej(err);
                    } else {
                        res();
                    }
                });
            });
        });
    }
}
