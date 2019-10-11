"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const replace = require("replace-in-file");
function replaceDebug(version, config) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            const buildConfig = require(config.buildTargets[i]);
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
                    const m = /require\(['|"]@pnp\/([\w-\/]*?)['|"]/ig.exec(match);
                    return `require("${path.resolve(sourceRoot, outDir, `packages/${m[1]}`).replace(/\\/g, "/")}"`;
                },
            }));
        }
        yield Promise.all([
            replace(optionsVersion),
            ...requireOptionsCollection.map(c => replace(c)),
        ]).catch(e => console.error);
    });
}
exports.replaceDebug = replaceDebug;
//# sourceMappingURL=replace-debug.js.map