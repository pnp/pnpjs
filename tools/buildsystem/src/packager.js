"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const colors = require("ansi-colors");
const log = require("fancy-log");
function packager(version, config) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            yield runTasks("pre-package", version, config.prePackageTasks || [], config);
            yield runTasks("package", version, config.packageTasks || [], config);
            yield runTasks("post-package", version, config.postPackageTasks || [], config);
        }
        catch (e) {
            log(`${colors.bgRed(" ")} ${colors.bold(colors.red(`Packaging error`))}.`);
            log(`${colors.bgRed(" ")} ${colors.bold(colors.red("Error:"))} ${colors.bold(colors.white(typeof e === "string" ? e : JSON.stringify(e)))}`);
            throw e;
        }
    });
}
exports.packager = packager;
function runTasks(name, version, tasks, config) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        log(`${colors.bgBlue(" ")} Beginning (${tasks.length}) ${name} tasks.`);
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            if (typeof task === "undefined" || task === null) {
                continue;
            }
            if (typeof task === "function") {
                yield task(version, config);
            }
            else {
                yield task.task(version, config, task.packages);
            }
        }
        log(`${colors.bgGreen(" ")} Finished ${name} tasks.`);
    });
}
//# sourceMappingURL=packager.js.map