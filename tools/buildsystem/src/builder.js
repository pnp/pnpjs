"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const colors = require("ansi-colors"), log = require("fancy-log");
const build_1 = require("./tasks/build/build");
function builder(version, config) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            yield runTasks("pre-build", config.preBuildTasks || [], version, config);
            log(`${colors.bgBlue(" ")} Processing build targets.`);
            yield build_1.build(version, config);
            log(`${colors.bgGreen(" ")} Processed build targets.`);
            yield runTasks("post-build", config.postBuildTasks || [], version, config);
        }
        catch (e) {
            log(`${colors.bgRed(" ")} ${colors.bold(colors.red(`Build error`))}.`);
            log(`${colors.bgRed(" ")} ${colors.bold(colors.red("Error:"))} ${colors.bold(colors.white(typeof e === "string" ? e : JSON.stringify(e)))}`);
            throw e;
        }
    });
}
exports.builder = builder;
function runTasks(name, tasks, version, config) {
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
//# sourceMappingURL=builder.js.map