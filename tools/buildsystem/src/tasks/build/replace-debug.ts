import { BuildSchema } from "../../config.js";
import replace from "replace-in-file";
import { resolve, dirname } from "path";
import importJSON from "../../lib/importJSON.js";

interface TSConfig {
    compilerOptions: {
        outDir: string;
    };
}

export function createDebugReplace(versionReplacePaths: string[]): (version: string, config: BuildSchema) => Promise<void> {

    /**
     * Repalces the $$Version$$ and rewrites the local require statements for debugging
     * 
     * @param ctx The build context
     */
    return async function (version: string, config: BuildSchema): Promise<void> {

        const optionsVersion = {
            files: [],
            from: /\$\$Version\$\$/ig,
            to: version,
        };

        const optionsRequireTemplate = {
            from: /require\(['|"]@pnp\/[\w-\/]*?['|"]/ig,
        };

        const requireOptionsCollection = [];

        for (let i = 0; i < config.buildTargets.length; i++) {

            // read our outDir from the build target (which will be a tsconfig file)
            const buildConfig: TSConfig = importJSON(config.buildTargets[i]);
            const sourceRoot = resolve(dirname(config.buildTargets[i]));
            const outDir = buildConfig.compilerOptions.outDir;

            optionsVersion.files.push(...versionReplacePaths.map(p => resolve(sourceRoot, outDir, p)));

            requireOptionsCollection.push(Object.assign({}, optionsRequireTemplate, {
                files: [
                    resolve(sourceRoot, outDir, "**/*.js"),
                    resolve(sourceRoot, outDir, "**/*.d.ts"),
                ],
                to: (match: string) => {
                    const m = /require\(['|"]@pnp\/([\w-\/]*?)['|"]/ig.exec(match);
                    return `require("${resolve(sourceRoot, outDir, `packages/${m[1]}`).replace(/\\/g, "/")}"`;
                },
            }));
        }

        await Promise.all([
            (<any>replace)(optionsVersion),
            ...requireOptionsCollection.map(c => (<any>replace)(c)),
        ]).catch(e => console.error);
    }

}
