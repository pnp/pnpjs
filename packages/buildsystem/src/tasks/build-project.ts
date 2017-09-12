import { BuildContext } from "../buildcontext";
import { exec } from "child_process";
import { log } from "gulp-util";

/**
 * Builds the project based on the supplied tsconfig.json file
 * 
 * @param ctx The build context
 */
export function buildProject(ctx: BuildContext) {

    return new Promise((resolve, reject) => {
        // exec a child process to run a tsc build based on the project file in each
        // package directory. Build is now fully managed via tsconfig.json files in
        // each package directory.
        exec(`.\\node_modules\\.bin\\tsc -p ${ctx.projectFile}`, (error, stdout, stderr) => {

            if (error === null) {
                log(`Successfully built ${ctx.projectFile}.`);
                resolve();
            } else {
                log(`Error building ${ctx.projectFile}.`);
                reject(stdout);
            }
        });
    });
}
