declare var require: (s: string) => any;
const path = require("path"),
    colors = require("ansi-colors"),
    log = require("fancy-log");

import { BuildContext } from "./tasks/build/context";
import { BuildSchema } from "./tasks/build/schema";

/**
 * Engine function to process build files
 * 
 * @param version The version to be written into all the build packages
 * @param config The build configuration object
 * @param callback (err?) => void
 */
export async function builder(version: string, config: BuildSchema): Promise<void> {

    // log we are starting the shared build tasks
    log(`${colors.bgBlue(" ")} Beginning shared build tasks.`);

    try {

        // run global tasks
        await Promise.all(config.tasks.map(task => task(version, config)));

        log(`${colors.bgGreen(" ")} Finished shared build tasks.`);

    } catch (e) {

        log(`${colors.bgRed(" ")} ${colors.bold(colors.red(`Error in shared build tasks.`))}.`);
        log(`${colors.bgRed(" ")} ${colors.bold(colors.red("Error:"))} ${colors.bold(colors.white(typeof e === "string" ? e : JSON.stringify(e)))}`);
        throw e;
    }

    // run the per package tasks
    return config.packages.reduce((pipe: Promise<void>, pkg) => {

        if (typeof pkg === "string") {
            pkg = { name: pkg };
        }

        // gate the package names so folks don't try and run code down the line
        if (!/^[\w-]+$/i.test(pkg.name)) {
            throw Error(`Bad package name "${pkg.name}".`);
        }

        const projectFolder = path.join(config.packageRoot, pkg.name);
        const projectFile = path.join(projectFolder, pkg.configFile || config.configFile || "tsconfig.es2015.json");
        const tsconfigObj = require(projectFile);

        // establish the context that will be passed through all the build pipeline functions
        const buildContext: BuildContext = {
            assets: pkg.assets || config.assets,
            name: pkg.name,
            projectFile: projectFile,
            projectFolder: projectFolder,
            targetFolder: path.join(projectFolder, tsconfigObj.compilerOptions.outDir),
            tsconfigObj: tsconfigObj,
            version: version,
        };

        // select the correct build pipeline
        const activeBuildPipeline = pkg.buildPipeline || config.buildPipeline;

        // log we have added the file
        log(`${colors.bgBlue(" ")} Adding ${colors.cyan(buildContext.projectFile)} to the build pipeline.`);

        return activeBuildPipeline.reduce((subPipe, func) => subPipe.then(() => func(buildContext)), pipe).then(_ => {

            log(`${colors.bgGreen(" ")} Built ${colors.cyan(buildContext.projectFile)}.`);

        }).catch(e => {

            log(`${colors.bgRed(" ")} ${colors.bold(colors.red(`Error building `))} ${colors.bold(colors.cyan(buildContext.projectFile))}.`);
            log(`${colors.bgRed(" ")} ${colors.bold(colors.red("Error:"))} ${colors.bold(colors.white(typeof e === "string" ? e : JSON.stringify(e)))}`);
        });

    }, Promise.resolve());
}
