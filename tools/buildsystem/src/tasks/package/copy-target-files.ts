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

export function createCopyTargetFiles(targetOverride = "", subDir = "", transforms: TransformFunction[] = []): PackageFunction {

    return async (target: PackageTargetMap, _version: string) => {

        // read the outdir from the packagetarget
        const usedTarget = targetOverride === "" ? target.target : targetOverride;
        const buildConfig: TSConfig = importJSON(usedTarget);
        const sourceRoot = resolve(dirname(usedTarget));
        const buildOutDir = resolve(sourceRoot, buildConfig.compilerOptions.outDir);

        const dirs = getSubDirNames(buildOutDir);

        dirs.forEach(async dir => {

            await new Promise<void>((res, rej) => {

                pump([
                    gulp.src(["./**/*.d.ts", "./**/*.js", "./**/*.js.map", "./**/*.d.ts.map"], {
                        cwd: resolve(buildOutDir, dir),
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
