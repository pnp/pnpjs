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

        const sources = [
            "./src/net/sphttpclient.js",
            "./src/batch.js",
            "./es5/src/net/sphttpclient.js",
            "./es5/src/batch.js",
        ];

        pump([
            src(sources, {
                base: ".",
                cwd: ctx.targetFolder,
            }),
            replace("$$Version$$", ctx.version),
            dest(".", {
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
