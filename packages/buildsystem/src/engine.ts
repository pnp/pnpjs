declare var require: (s: string) => any;
const path = require("path");
import { BuildContext } from "./buildcontext";
import { ConfigSchema } from "./configschema";
import { log, colors } from "gulp-util";

/**
 * Engine function to process build files
 * 
 * @param version The version to be written into all the build packages
 * @param config The build configuration object
 * @param callback (err?) => void
 */
export function engine(version: string, config: ConfigSchema): Promise<void> {

    // it matters what order we build things as dependencies must be built first
    // these are the folder names witin the packages directory to build
    return config.packages.reduce((chain: Promise<void>, pkg) => {

        if (typeof pkg === "string") {
            pkg = { name: pkg };
        }

        const projectFolder = path.join(config.packageRoot, pkg.name);
        const projectFile = path.join(projectFolder, "tsconfig.json");
        const tsconfigObj = require(projectFile);

        // establish the context that will be passed through all the build chain functions
        const buildContext: BuildContext = {
            assets: pkg.assets || config.assets,
            name: pkg.name,
            projectFile: projectFile,
            projectFolder: projectFolder,
            targetFolder: path.join(projectFolder, tsconfigObj.compilerOptions.outDir),
            tsconfigObj: tsconfigObj,
            version: version,
        };

        // select the correct build chain
        const activeBuildChain = pkg.buildChain || config.buildChain;

        // log we have added the file
        log(`Adding ${colors.cyan(buildContext.projectFile)} to the build chain.`);

        return activeBuildChain.reduce((subChain, func) => subChain.then(() => func(buildContext)), chain).then(_ => {

            log(`Successfully built ${colors.green(buildContext.projectFile)}.`);
        }).catch(e => {

            log(`Error building ${colors.red(buildContext.projectFile)}.`);
            return e;
        });

    }, Promise.resolve());
}
