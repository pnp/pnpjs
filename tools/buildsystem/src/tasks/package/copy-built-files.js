"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pump = require("pump");
const gulp_1 = require("gulp");
const path = require("path");
function copyBuiltFiles(_version, config) {
    const promises = [];
    for (let i = 0; i < config.packageTargets.length; i++) {
        const packageTarget = config.packageTargets[i];
        const buildConfig = require(packageTarget.packageTarget);
        const sourceRoot = path.resolve(path.dirname(packageTarget.packageTarget));
        const buildOutDir = path.resolve(sourceRoot, buildConfig.compilerOptions.outDir);
        promises.push(new Promise((resolve, reject) => {
            pump([
                gulp_1.src(["./**/*.d.ts", "./**/*.js"], {
                    cwd: buildOutDir,
                }),
                gulp_1.dest(path.resolve(packageTarget.outDir), {
                    overwrite: true,
                }),
            ], (err) => {
                if (err !== undefined) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        }));
    }
    return Promise.all(promises);
}
exports.copyBuiltFiles = copyBuiltFiles;
//# sourceMappingURL=copy-built-files.js.map