declare var require: (s: string) => any;
const path = require("path");
import { BuildSchema } from "./schema";
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
export function replaceVersion(version: string, config: BuildSchema) {

    const options = {
        allowEmptyPaths: true,
        files: [],
        from: /\$\$Version\$\$/ig,
        to: version,
    };

    for (let i = 0; i < config.buildTargets.length; i++) {

        // read our outDir from the build target (which will be a tsconfig file)
        const buildConfig: TSConfig = require(config.buildTargets[i]);
        const buildRoot = path.resolve(path.dirname(config.buildTargets[i]));

        options.files.push(path.resolve(buildRoot, buildConfig.compilerOptions.outDir, "sp/src/net/sphttpclient.js"));
        options.files.push(path.resolve(buildRoot, buildConfig.compilerOptions.outDir, "sp/src/batch.js"));
        options.files.push(path.resolve(buildRoot, buildConfig.compilerOptions.outDir, "graph/src/net/graphhttpclient.js"));
    }

    return replace(options);
}
