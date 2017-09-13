declare var require: (s: string) => any;
import { PackageContext } from "./context";
import { exec } from "child_process";
import { log } from "gulp-util";
const path = require("path");

const rollupPath = ".\\node_modules\\.bin\\rollup";

/**
 * Builds the project based on the supplied tsconfig.json file
 * 
 * @param ctx The build context
 */
export function packageProject(ctx: PackageContext) {

    return Promise.all([
        packageExec("rollup.es5.config.js", ctx),
        packageExec("rollup.es2015.config.js", ctx),
    ]);
}

function packageExec(configFile: string, ctx: PackageContext): Promise<void> {

    return new Promise((resolve, reject) => {

        const rollupConfig = path.join(ctx.projectFolder, configFile);

        exec(`${rollupPath} -c ${rollupConfig}`, (error, stdout, stderr) => {

            if (error === null) {
                resolve();
            } else {

                // rollup will output their error to stderr...
                reject(stderr);
            }
        });
    });
}
