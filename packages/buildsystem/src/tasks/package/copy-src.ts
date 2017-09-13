declare var require: (s: string) => any;
import { PackageContext } from "./context";
const pump = require("pump");
import { src, dest } from "gulp";
const path = require("path");

/**
 * Copies static assets into the target folder
 * 
 * @param ctx The build context 
 */
export function copySrc(ctx: PackageContext) {

    return new Promise((resolve, reject) => {

        pump([
            src(["./src/**/*.d.ts"], {
                cwd: ctx.projectFolder,
            }),
            dest(path.join(ctx.targetFolder, "src"), {
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
