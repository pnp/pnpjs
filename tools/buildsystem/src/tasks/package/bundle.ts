declare var require: (s: string) => any;
import { PackageContext } from "./context";
import { exec } from "child_process";
const path = require("path"),
    yargs = require("yargs").argv;

const webpackPath = path.join("./node_modules/.bin/webpack");

/**
 * Bundles a library using webpack along with its @pnp dependencies.
 * This will result in large file sizes and is not ideal, but does provide
 * a way for folks who want a single file they can drop into their
 * applications.
 * 
 * @param ctx The build context 
 */
export function bundle(): Promise<void> {

    return new Promise((resolve, reject) => {
        // exec a child process to run a tsc build based on the project file in each
        // package directory. Build is now fully managed via tsconfig.json files
        exec(webpackPath, (error, stdout, stderr) => {

            if (error === null) {
                resolve();
            } else {
                reject(stdout);
            }
        });
    });
}
