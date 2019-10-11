"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const child_process_1 = require("child_process");
const tscPath = path.resolve("./node_modules/.bin/tsc");
function build(_0, config) {
    return Promise.all(config.buildTargets.map(buildTarget => new Promise((resolve, reject) => {
        child_process_1.exec(`${tscPath} -b ${buildTarget}`, (error, stdout, stderr) => {
            if (error === null) {
                resolve();
            }
            else {
                console.error(error);
                reject(stdout);
            }
        });
    })));
}
exports.build = build;
//# sourceMappingURL=build.js.map