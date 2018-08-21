declare var require: (s: string) => any;
import { BuildContext } from "./context";
const pump = require("pump");
import { src, dest } from "gulp";

/**
 * Copies static assets into the target folder
 * 
 * @param ctx The build context 
 */
export function copyAssets(ctx: BuildContext) {

    return new Promise((resolve, reject) => {

        pump([
            src(ctx.assets, {
                cwd: ctx.projectFolder,
            }),
            dest(ctx.targetFolder, {
                overwrite: true,
            }),
        ], (err: (Error | null)) => {

            if (err !== undefined) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
