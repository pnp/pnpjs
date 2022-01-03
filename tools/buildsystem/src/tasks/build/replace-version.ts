import { BuildSchema } from "../../config.js";
import replace from "replace-in-file";
import { resolve, dirname } from "path";
import importJSON from "../../lib/importJSON.js";

interface TSConfig {
    compilerOptions: {
        outDir: string;
    };
}

export function createReplaceVersion(paths: string[], versionMask = /\$\$Version\$\$/ig): (version: string, config: BuildSchema) => Promise<void> {

    /**
     * Replaces the $$Version$$ string in the SharePoint HttpClient
     * 
     * @param version The version number
     * @param ctx The build context 
     */
    return async function (version: string, config: BuildSchema): Promise<void> {

        const options = {
            files: [],
            from: versionMask,
            to: version,
        };

        for (let i = 0; i < config.buildTargets.length; i++) {

            // read our outDir from the build target (which will be a tsconfig file)
            const buildConfig: TSConfig = importJSON(config.buildTargets[i]);
            const buildRoot = resolve(dirname(config.buildTargets[i]));

            options.files.push(...paths.map(p => resolve(buildRoot, buildConfig.compilerOptions.outDir, p)));
        }

        await (<any>replace)(options);
    }

}
