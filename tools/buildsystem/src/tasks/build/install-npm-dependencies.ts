import { BuildContext } from "./context";
import { exec } from "child_process";

/**
 * Installs any npm dependencies needed to build the sub-project
 * 
 * @param ctx The build context
 */
export function installNPMDependencies(ctx: BuildContext) {
    return new Promise((resolve, reject) => {
        exec(`npm install`, {
            cwd: ctx.projectFolder,
        }, (error, stdout) => {

            if (error === null) {
                resolve();
            } else {
                reject(new Error(stdout));
            }
        });
    });
}
