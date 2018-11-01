declare var require: (s: string) => any;
import { BuildSchema } from "./schema";
const path = require("path");
import * as replace from "replace-in-file";

interface TSConfig {
    compilerOptions: {
        outDir: string;
    };
}

/**
 * Repalces the $$Version$$ and rewrites the local require statements for debugging
 * 
 * @param ctx The build context
 */
export function replaceDebug(version: string, config: BuildSchema) {

    const optionsVersion = {
        files: [],
        from: /\$\$Version\$\$/ig,
        to: version,
    };

    const optionsRequireTemplate = {
        from: /require\(['|"]@pnp\/[\w-]*?['|"]/ig,
    };

    const requireOptionsCollection = [];

    for (let i = 0; i < config.buildTargets.length; i++) {

        // read our outDir from the build target (which will be a tsconfig file)
        const buildConfig: TSConfig = require(config.buildTargets[i]);
        const sourceRoot = path.resolve(path.dirname(config.buildTargets[i]));
        const outDir = buildConfig.compilerOptions.outDir;

        optionsVersion.files.push(path.resolve(sourceRoot, outDir, "sp/src/net/sphttpclient.js"));
        optionsVersion.files.push(path.resolve(sourceRoot, outDir, "sp/src/batch.js"));

        requireOptionsCollection.push(Object.assign({}, optionsRequireTemplate, {
            files: [
                path.resolve(sourceRoot, outDir, "**/*.js"),
                path.resolve(sourceRoot, outDir, "**/*.d.ts"),
            ],
            to: (match) => {
                const m = /require\(['|"]@pnp\/([\w-]*?)['|"]/ig.exec(match);
                return `require("${path.resolve(sourceRoot, outDir, `packages/${m[1]}`).replace(/\\/g, "/")}"`;
            },
        }));
    }

    return Promise.all([
        replace(optionsVersion),
        ...requireOptionsCollection.map(c => replace(c)),
    ]).catch(e => console.error);
}
