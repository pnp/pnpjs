declare var require: (s: string) => any;
import { PackageContext } from "./context";
import { exec } from "child_process";
const path = require("path");

const uglifyPath = path.resolve(".\\node_modules\\.bin\\uglifyjs");

/**
 * Minifies the files created in es5 format into the target dist folder
 * 
 * @param ctx The build context 
 */
export function uglify(ctx: PackageContext) {

    // this relies on the file being in the right place with the right name
    // and having an output in umd format, will need to revisit if this changes
    const rollupConfigOutput = require(path.join(ctx.projectFolder, "rollup.es5.config.js")).output;

    // right now we just produce a min version of the umd as that is the "main"
    const inFiles = rollupConfigOutput.filter(o => o.format === "umd").map(outputPart => path.basename(outputPart.file));

    return inFiles.reduce((pipe, inFile) => {

        const cwd = path.join(ctx.targetFolder, "dist");
        return pipe.then(uglifyExec(cwd, inFile, inFile.replace(/\.js$/i, ".min.js")));

    }, Promise.resolve());
}

function uglifyExec(cwd: string, inFile: string, outFile: string): Promise<void> {

    return new Promise((resolve, reject) => {

        exec(`${uglifyPath} --comments -c --source-map "content='${inFile}.map'" -o "${outFile}" -m -- "${inFile}"`,
            {
                cwd: cwd,
            }, (error, stdout, stderr) => {

                if (error === null) {
                    resolve();
                } else {

                    // rollup will output their error to stderr...
                    reject(stderr);
                }
            });
    });
}
