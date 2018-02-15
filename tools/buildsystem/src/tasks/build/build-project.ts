declare var require: (s: string) => any;
const path = require("path");
const log = require("fancy-log");

import { exec } from "child_process";
import { BuildContext } from "./context";

const tscPath = ".\\node_modules\\.bin\\tsc";

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
        exec(`${tscPath} -p ${ctx.projectFile} --importHelpers`, (error, stdout, stderr) => {

            if (error === null) {
                resolve();
            } else {
                reject(stdout);
            }
        });
    });
}

/**
 * Builds the project based on the supplied tsconfig.json file, overriding the build to produce es5
 * 
 * @param ctx The build context
 */
export function buildProjectES5(ctx: BuildContext) {

    return new Promise((resolve, reject) => {
        // exec a child process to run a tsc build based on the project file in each
        // package directory. Build is now fully managed via tsconfig.json files in
        // each package directory.
        exec(`${tscPath} -p ${ctx.projectFile} -target es5 -outDir ${path.join(ctx.targetFolder, "es5")} -d false --importHelpers`, (error, stdout, stderr) => {

            if (error === null) {
                resolve();
            } else {
                reject(stdout);
            }
        });
    });
}
