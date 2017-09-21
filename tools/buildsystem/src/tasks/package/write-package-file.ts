declare var require: (s: string) => any;
import { PackageContext } from "./context";
const fs = require("fs");
const path = require("path");

/**
 * Writes the package.json for the dist package. This should be last in the pipeline as that allows previous tasks
 * to update the pkgObj as needed before it is written to the fs here. This task does handle the statndard rewrites
 * 
 * @param ctx The build context 
 */
export function writePackageFile(ctx: PackageContext) {

    return new Promise((resolve, reject) => {

        // this relies on the file being in the right place with the right name
        // and having an output in umd format, will need to revisit if this changes
        const rollupConfigOutput = require(path.join(ctx.projectFolder, "rollup.es5.config.js")).output;
        const mainFilename = path.basename(rollupConfigOutput.filter(o => o.format === "umd")[0].file);

        // calculate these based on the output file's umd module name
        const pkg = ctx.pkgObj;
        pkg.main = `./dist/${mainFilename}`;
        pkg.module = `./dist/${mainFilename.replace(/\.es5\.umd\.js$/i, ".es5.js")}`;
        pkg.es2015 = `./dist/${mainFilename.replace(/\.es5\.umd\.js$/i, ".js")}`;

        fs.writeFile(path.join(ctx.targetFolder, "package.json"), JSON.stringify(pkg, null, 4), (err) => {

            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
