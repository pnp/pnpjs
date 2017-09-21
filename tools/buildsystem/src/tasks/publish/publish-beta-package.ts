import { PublishContext } from "./context";
import { exec } from "child_process";

/**
 * Minifies the files created in es5 format into the target dist folder
 * 
 * @param ctx The build context 
 */
export function publishBetaPackage(ctx: PublishContext) {

    return new Promise((resolve, reject) => {

        exec("npm publish --tag beta --access public",
            {
                cwd: ctx.packageFolder,
            }, (error, stdout, stderr) => {

                if (error === null) {
                    resolve();
                } else {

                    reject(stdout);
                }
            });
    });
}
