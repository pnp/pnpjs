import { resolve } from "path";

import { exec } from "child_process";
import { BuildSchema } from "../../config.js";

const tscPath = resolve("./node_modules/.bin/tsc");

/**
 * Builds the project based on the supplied tsconfig.json file
 *
 * @param ctx The build context
 */
export function build(_0: string, config: BuildSchema) {

    // for each build target we need to invoke tsc

    return Promise.all<void>(config.buildTargets.map(buildTarget => new Promise((resolve, reject) => {
        // exec a child process to run a tsc build based on the project file in each
        // package directory. Build is now fully managed via tsconfig.json files
        exec(`${tscPath} -b ${buildTarget}`, (error, stdout, stderr) => {

            if (error === null) {
                resolve();
            } else {
                console.error(error);
                reject(stdout);
            }
        });
    })));
}
