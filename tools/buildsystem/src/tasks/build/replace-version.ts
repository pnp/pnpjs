declare var require: (s: string) => any;
const path = require("path");
import { BuildSchema } from "../../config.js";
// they broke the types in replace-in-file so we need to import it this way
const replace = require("replace-in-file");

interface TSConfig {
    compilerOptions: {
        outDir: string;
    };
}

export function createReplaceVersion(paths: string[]): (version: string, config: BuildSchema) => Promise<void> {

    /**
     * Replaces the $$Version$$ string in the SharePoint HttpClient
     * 
     * @param version The version number
     * @param ctx The build context 
     */
    return async function (version: string, config: BuildSchema): Promise<void> {

        const options = {
            files: [],
            from: /\$\$Version\$\$/ig,
            to: version,
        };

        for (let i = 0; i < config.buildTargets.length; i++) {

            // read our outDir from the build target (which will be a tsconfig file)
            const buildConfig: TSConfig = require(config.buildTargets[i]);
            const buildRoot = path.resolve(path.dirname(config.buildTargets[i]));

            options.files.push(...paths.map(p => path.resolve(buildRoot, buildConfig.compilerOptions.outDir, p)));
        }

        await replace(options);
    }

}
