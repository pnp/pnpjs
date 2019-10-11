"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getSubDirectoryNames_1 = require("../../lib/getSubDirectoryNames");
const findup = require("findup-sync");
const path = require("path"), fs = require("fs");
function copyStaticAssets(version, config) {
    const projectRoot = path.dirname(path.resolve(findup("package.json")));
    const licensePath = path.resolve(projectRoot, "LICENSE");
    const readmePath = path.resolve(projectRoot, "./packages/readme.md");
    for (let i = 0; i < config.packageTargets.length; i++) {
        const packageTarget = config.packageTargets[i];
        const buildConfig = require(packageTarget.packageTarget);
        const sourceRoot = path.resolve(path.dirname(packageTarget.packageTarget));
        const buildOutDir = path.resolve(sourceRoot, buildConfig.compilerOptions.outDir);
        const builtFolders = getSubDirectoryNames_1.default(buildOutDir);
        for (let j = 0; j < builtFolders.length; j++) {
            const dest = path.resolve(packageTarget.outDir, builtFolders[j]);
            fs.createReadStream(licensePath).pipe(fs.createWriteStream(path.join(dest, "LICENSE")));
            fs.createReadStream(readmePath).pipe(fs.createWriteStream(path.join(dest, "readme.md")));
        }
    }
    return Promise.resolve();
}
exports.copyStaticAssets = copyStaticAssets;
//# sourceMappingURL=copy-static-assets.js.map