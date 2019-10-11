"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs"), path = require("path");
const getSubDirectoryNames_1 = require("../../lib/getSubDirectoryNames");
function writePackageFiles(version, config) {
    const promises = [];
    for (let i = 0; i < config.packageTargets.length; i++) {
        const packageTarget = config.packageTargets[i];
        const buildConfig = require(packageTarget.packageTarget);
        const sourceRoot = path.resolve(path.dirname(packageTarget.packageTarget));
        const buildOutDir = path.resolve(sourceRoot, buildConfig.compilerOptions.outDir);
        const builtFolders = getSubDirectoryNames_1.default(buildOutDir);
        for (let j = 0; j < builtFolders.length; j++) {
            const pkg = require(path.resolve(sourceRoot, builtFolders[j], "package.json"));
            pkg.version = version;
            pkg.main = `./index.js`;
            for (const key in pkg.peerDependencies) {
                if (pkg.peerDependencies[key] === "0.0.0-PLACEHOLDER") {
                    pkg.peerDependencies[key] = version;
                }
            }
            for (const key in pkg.dependencies) {
                if (pkg.dependencies[key] === "0.0.0-PLACEHOLDER") {
                    pkg.dependencies[key] = version;
                }
            }
            promises.push(new Promise((resolve, reject) => {
                fs.writeFile(path.resolve(packageTarget.outDir, builtFolders[j], "package.json"), JSON.stringify(pkg, null, 4), (err) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            }));
        }
    }
    return Promise.all(promises);
}
exports.writePackageFiles = writePackageFiles;
//# sourceMappingURL=write-package-files.js.map