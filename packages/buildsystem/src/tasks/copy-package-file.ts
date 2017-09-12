declare var require: (s: string) => any;
import { BuildContext } from "../buildcontext";
const pump = require("pump");
import { src, dest } from "gulp";
const replace = require("gulp-replace");

/**
 * Copies the package.json file from the projectFolder to the outDir, updating the package version based
 * on the root package.json
 * 
 * @param ctx The build context 
 */
export function copyPackageFile(ctx: BuildContext) {

    return new Promise((resolve, reject) => {

        pump([
            src("package.json", {
                cwd: ctx.projectFolder,
            }),
            replace("0.0.0-PLACEHOLDER", ctx.version),
            dest(ctx.targetFolder, {
                overwrite: true,
            }),
        ], (err: (Error | null)) => {

            if (typeof err !== "undefined") {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
