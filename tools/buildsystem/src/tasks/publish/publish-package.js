"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const colors = require("ansi-colors");
const path = require("path");
const getSubDirectoryNames_1 = require("../../lib/getSubDirectoryNames");
const log = require("fancy-log");
function publishPackage(version, config) {
    const promises = [];
    const publishRoot = path.resolve(config.packageRoot);
    const packageFolders = getSubDirectoryNames_1.default(publishRoot).filter(name => name !== "documentation");
    for (let i = 0; i < packageFolders.length; i++) {
        promises.push(new Promise((resolve, reject) => {
            const packagePath = path.resolve(publishRoot, packageFolders[i]);
            log(`${colors.bgBlue(" ")} Publishing ${packagePath}`);
            child_process_1.exec("npm publish --access public", {
                cwd: path.resolve(publishRoot, packageFolders[i]),
            }, (error, stdout, stderr) => {
                if (error === null) {
                    log(`${colors.bgGreen(" ")} Published ${packagePath}`);
                    resolve();
                }
                else {
                    console.error(error);
                    reject(error);
                }
            });
        }));
    }
    return Promise.all(promises);
}
exports.publishPackage = publishPackage;
//# sourceMappingURL=publish-package.js.map