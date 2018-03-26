declare var require: (s: string) => any;
import { BuildContext } from "./context";
const pump = require("pump");
import { src, dest } from "gulp";
const replace = require("gulp-replace");

/**
 * Replaces the $$Version$$ string in the SharePoint HttpClient
 * 
 * @param ctx The build context 
 */
export function replaceSPHttpVersion(ctx: BuildContext) {

    return new Promise((resolve, reject) => {

        pump([
            src(["./src/net/sphttpclient.js", "./src/batch.js"], {
                base: ".",
                cwd: ctx.targetFolder,
            }),
            replace("$$Version$$", ctx.version),
            dest(".", {
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
