declare var require: (s: string) => any;
const path = require("path");
const log = require("fancy-log");

import { exec } from "child_process";
import { BuildSchema } from "./schema";

const tscPath = path.join("./node_modules/.bin/tsc");

/**
 * Builds the project based on the supplied tsconfig.json file
 *
 * @param ctx The build context
 */
export function buildProject(_0: string, config: BuildSchema) {

    const projectFile = path.resolve(config.packageFile || path.join(config.packageRoot, config.configFile || "tsconfig.json"));

    return new Promise((resolve, reject) => {
        // exec a child process to run a tsc build based on the project file in each
        // package directory. Build is now fully managed via tsconfig.json files
        exec(`${tscPath} -b ${projectFile}`, (error, stdout, stderr) => {

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
export function buildProjectES5(_0: string, config: BuildSchema) {

    const projectFile = path.resolve(config.packageFileES5 || path.join(config.packageRoot, config.configFile || "tsconfig.es5.json"));

    return new Promise((resolve, reject) => {
        // exec a child process to run a tsc build based on the project file in each
        // package directory. Build is now fully managed via tsconfig.json files in
        // each package directory.
        exec(`${tscPath} -b ${projectFile}`, (error, stdout, stderr) => {

            if (error === null) {
                resolve();
            } else {
                reject(stdout);
            }
        });
    });
}
