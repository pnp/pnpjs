declare var require: (s: string) => any;
const path = require("path"),
    colors = require("ansi-colors"),
    log = require("fancy-log");

import { BuildSchema, BuildTask } from "./tasks/build/schema";
import { build } from "./tasks/build/build";

/**
 * Engine function to process build files
 * 
 * @param version The version to be written into all the build packages
 * @param config The build configuration object
 * @param callback (err?) => void
 */
export async function builder(version: string, config: BuildSchema): Promise<void> {

    try {

        // run any pre-build tasks
        await runTasks("pre-build", config.preBuildTasks || [], version, config);

        log(`${colors.bgBlue(" ")} Processing build targets.`);
        // run build targets
        await build(version, config);
        log(`${colors.bgGreen(" ")} Processed build targets.`);

        // run any post-build tasks
        await runTasks("post-build", config.postBuildTasks || [], version, config);

    } catch (e) {

        log(`${colors.bgRed(" ")} ${colors.bold(colors.red(`Build error`))}.`);
        log(`${colors.bgRed(" ")} ${colors.bold(colors.red("Error:"))} ${colors.bold(colors.white(typeof e === "string" ? e : JSON.stringify(e)))}`);
        throw e;
    }
}

async function runTasks(name: string, tasks: BuildTask[], version: string, config: BuildSchema): Promise<void> {

    log(`${colors.bgBlue(" ")} Beginning (${tasks.length}) ${name} tasks.`);
    for (let i = 0; i < tasks.length; i++) {

        const task = tasks[i];

        if (typeof task === "undefined" || task === null) {
            continue;
        }

        if (typeof task === "function") {
            await task(version, config);
        } else {
            await task.task(version, config, task.packages);
        }
    }
    log(`${colors.bgGreen(" ")} Finished ${name} tasks.`);
}
