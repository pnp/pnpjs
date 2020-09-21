import * as pump from "pump";
import { src, dest } from "gulp";
import { resolve, dirname } from "path";
import { PackageTargetMap, PackageFunction } from "../../config";
import getSubDirectoryNames from "../../lib/getSubDirectoryNames";
import { obj, TransformFunction } from "through2";

interface TSConfig {
    compilerOptions: {
        outDir: string;
    };
}

export function createCopyTargetFiles(targetOverride = "", subDir = "", transforms: TransformFunction[] = []): PackageFunction {

    return async (target: PackageTargetMap, _version: string) => {

        // read the outdir from the packagetarget
        const usedTarget = targetOverride === "" ? target.target : targetOverride;
        const buildConfig: TSConfig = require(usedTarget);
        const sourceRoot = resolve(dirname(usedTarget));
        const buildOutDir = resolve(sourceRoot, buildConfig.compilerOptions.outDir);

        const dirs = getSubDirectoryNames(buildOutDir);

        dirs.forEach(async dir => {

            await new Promise((res, rej) => {

                pump([
                    src(["./**/*.d.ts", "./**/*.js", "./**/*.js.map", "./**/*.d.ts.map"], {
                        cwd: resolve(buildOutDir, dir),
                    }),
                    ...transforms.map(t => obj(t)),
                    dest(resolve(target.outDir, dir, subDir), {
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
