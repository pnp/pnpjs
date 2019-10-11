"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const colors = require("ansi-colors");
const log = require("fancy-log");
function publisher(version, config) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            yield runTasks("pre-publish", version, config.prePublishTasks || [], config);
            yield runTasks("publish", version, config.publishTasks || [], config);
            yield runTasks("post-publish", version, config.postPublishTasks || [], config);
        }
        catch (e) {
            log(`${colors.bgRed(" ")} ${colors.bold(colors.red(`Publishing error`))}.`);
            log(`${colors.bgRed(" ")} ${colors.bold(colors.red("Error:"))} ${colors.bold(colors.white(typeof e === "string" ? e : JSON.stringify(e)))}`);
            throw e;
        }
    });
}
exports.publisher = publisher;
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
//# sourceMappingURL=publisher.js.map