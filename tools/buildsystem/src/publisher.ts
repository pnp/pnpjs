declare var require: (s: string) => any;
const path = require("path");
const colors = require("ansi-colors");
const log = require("fancy-log");

import { PublishContext } from "./tasks/publish/context";
import { PublishSchema } from "./tasks/publish/schema";

/**
 * Engine function to process build files
 * 
 * @param version The version to be written into all the build packages
 * @param config The build configuration object
 * @param callback (err?) => void
 */
export function publisher(config: PublishSchema): Promise<void> {

    // it matters what order we build things as dependencies must be built first
    // these are the folder names witin the packages directory to build
    return Promise.all(config.packages.map(pkg => {

        if (typeof pkg === "string") {
            pkg = { name: pkg };
        }

        // gate the package names so folks don't try and run code down the line
        if (!/^[\w-]+$/i.test(pkg.name)) {
            throw Error(`Bad package name "${pkg.name}".`);
        }

        const projectFolder = path.join(config.packageRoot, pkg.name);
        const packageFile = path.join(projectFolder, "package.json");
        const pkgObj = require(packageFile);

        // establish the context that will be passed through all the publish pipeline functions
        const publishContext: PublishContext = {
            name: pkg.name,
            packageFolder: projectFolder,
            pkgObj: pkgObj,
        };

        // select the correct build pipeline
        const activePublishPipeline = pkg.publishPipeline || config.publishPipeline;

        // log we have added the file
        log(`${colors.bgBlue(" ")} Adding ${colors.cyan(packageFile)} to the publishing pipeline.`);

        return activePublishPipeline.reduce((chain, func) => chain.then(() => func(publishContext)), Promise.resolve()).then(_ => {

            log(`${colors.bgGreen(" ")} Published ${colors.cyan(packageFile)}.`);

        }).catch(e => {

            log(`${colors.bgRed(" ")} ${colors.bold(colors.red(`Error publishing `))} ${colors.bold(colors.cyan(publishContext.packageFolder))}.`);
            log(`${colors.bgRed(" ")} ${colors.bold(colors.red("Error:"))} ${colors.bold(colors.white(typeof e === "string" ? e : JSON.stringify(e)))}`);
        });

    })).then(_ => void(0));
}
