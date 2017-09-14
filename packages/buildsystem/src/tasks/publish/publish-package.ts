declare var require: (s: string) => any;
import { PublishContext } from "./context";
import { exec } from "child_process";

/**
 * Minifies the files created in es5 format into the target dist folder
 * 
 * @param ctx The build context 
 */
export function publishPackage(ctx: PublishContext) {

    return new Promise((resolve, reject) => {

        console.log(`Running npm publish in ${ctx.packageFolder}`);
        resolve();
        // exec("npm publish",
        //     {
        //         cwd: ctx.packageFolder,
        //     }, (error, stdout, stderr) => {

        //         if (error === null) {
        //             resolve();
        //         } else {

        //             // rollup will output their error to stderr...
        //             reject(stdout);
        //         }
        //     });
    });
}
