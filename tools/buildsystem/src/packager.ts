declare var require: (s: string) => any;
const path = require("path");
const colors = require("ansi-colors");
const log = require("fancy-log");

import { PackageContext } from "./tasks/package/context";
import { PackageSchema } from "./tasks/package/schema";

/**
 * Engine function to process build files
 * 
 * @param version The version to be written into all the build packages
 * @param config The build configuration object
 * @param callback (err?) => void
 */
export function packager(config: PackageSchema): Promise<void> {

    // it matters what order we build things as dependencies must be built first
    // these are the folder names witin the packages directory to build
    return config.packages.reduce((pipe: Promise<void>, pkg) => {

        if (typeof pkg === "string") {
            pkg = { name: pkg };
        }

        // gate the package names so folks don't try and run code down the line
        if (!/^[\w-]+$/i.test(pkg.name)) {
            throw new Error(`Bad package name "${pkg.name}".`);
        }

        const projectFolder = path.join(config.packageRoot, pkg.name);
        const packageFile = path.join(projectFolder, "package.json");
        const pkgObj = require(packageFile);

        // establish the context that will be passed through all the package pipeline functions
        const packageContext: PackageContext = {
            assets: pkg.assets || config.assets,
            mainFile: pkgObj.main,
            name: pkg.name,
            pkgObj: pkgObj,
            projectFolder: projectFolder,
            targetFolder: path.join(config.outDir, pkg.name),
        };

        // select the correct build pipeline
        const activePackagePipeline = pkg.packagePipeline || config.packagePipeline;

        // log we have added the file
        log(`${colors.bgBlue(" ")} Adding ${colors.cyan(packageFile)} to the packaging pipeline.`);

        return activePackagePipeline.reduce((subPipe, func) => subPipe.then(() => func(packageContext)), pipe).then(_ => {

            log(`${colors.bgGreen(" ")} Packaged ${colors.cyan(packageFile)}.`);

        }).catch(e => {

            log(`${colors.bgRed(" ")} ${colors.bold(colors.red(`Error packaging `))} ${colors.bold(colors.cyan(packageContext.projectFolder))}.`);
            log(`${colors.bgRed(" ")} ${colors.bold(colors.red("Error:"))} ${colors.bold(colors.white(typeof e === "string" ? e : JSON.stringify(e)))}`);
        });

    }, Promise.resolve());
}
