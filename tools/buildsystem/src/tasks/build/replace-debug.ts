declare var require: (s: string) => any;
import { BuildContext } from "./context";
const pump = require("pump");
import { src, dest } from "gulp";
const replace = require("gulp-replace");
const path = require("path");

/**
 * Repalces the $$Version$$ and rewrites the local require statements for debugging
 * 
 * @param ctx The build context
 */
export function replaceDebug(ctx: BuildContext) {

    return new Promise((resolve, reject) => {

        pump([
            src(["./**/*.js", "./**/*.d.ts"], {
                cwd: ctx.targetFolder,
            }),
            replace("$$Version$$", ctx.version),
            replace(/require\(['|"]@pnp\/([\w-]*?)['|"]/ig, `require("${path.join(ctx.targetFolder, "packages/$1").replace(/\\/g, "/")}"`),
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
