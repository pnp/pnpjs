declare var require: (s: string) => any;
const path = require("path");
import { BuildSchema } from "../../config";
// they broke the types in replace-in-file so we need to import it this way
const replace = require("replace-in-file");

interface TSConfig {
    compilerOptions: {
        outDir: string;
    };
}

/**
 * Replaces the $$Version$$ string in the SharePoint HttpClient
 * 
 * @param version The version number
 * @param ctx The build context 
 */
export async function replaceVersion(version: string, config: BuildSchema): Promise<void> {

    const options = {
        files: [],
        from: /\$\$Version\$\$/ig,
        to: version,
    };

    for (let i = 0; i < config.buildTargets.length; i++) {

        // read our outDir from the build target (which will be a tsconfig file)
        const buildConfig: TSConfig = require(config.buildTargets[i]);
        const buildRoot = path.resolve(path.dirname(config.buildTargets[i]));

        options.files.push(path.resolve(buildRoot, buildConfig.compilerOptions.outDir, "graph/graphhttpclient.js"));
        options.files.push(path.resolve(buildRoot, buildConfig.compilerOptions.outDir, "sp/sphttpclient.js"));
        options.files.push(path.resolve(buildRoot, buildConfig.compilerOptions.outDir, "sp/batch.js"));
    }

    await replace(options);
}
