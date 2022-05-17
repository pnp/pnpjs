import pump from "pump";
import gulp from "gulp";
import { resolve, dirname } from "path";
import { PackageTargetMap, PackageFunction } from "../../config.js";
import getSubDirNames from "../../lib/getSubDirs.js";
import { obj, TransformFunction } from "through2";
import importJSON from "../../lib/importJSON.js";

interface TSConfig {
    compilerOptions: {
        outDir: string;
    };
}

/**
 * Copies any *.cjs files from the individual package folders to the respective dist package folders
 */
export function createCopyPackageScripts(targetOverride = "", subDir = "", transforms: TransformFunction[] = []): PackageFunction {

    return async (target: PackageTargetMap, _version: string) => {

        const usedTarget = targetOverride === "" ? target.target : targetOverride;
        const sourceRoot = resolve(dirname(usedTarget));
        const packageSourceDir = resolve(sourceRoot, "packages");

        const dirs = getSubDirNames(packageSourceDir);

        dirs.forEach(async dir => {

            await new Promise<void>((res, rej) => {

                pump([
                    gulp.src(["./**/*.cjs"], {
                        cwd: resolve(packageSourceDir, dir),
                    }),
                    ...transforms.map(t => obj(t)),
                    gulp.dest(resolve(target.outDir, dir, subDir), {
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
    };
}
