declare var require: (s: string) => any;
const colors = require("ansi-colors");
const log = require("fancy-log");

import { PackageSchema, PackageTask } from "./tasks/package/schema";

/**
 * Engine function to process build files
 * 
 * @param version The version to be written into all the build packages
 * @param config The build configuration object
 * @param callback (err?) => void
 */
export async function packager(version: string, config: PackageSchema): Promise<void> {

    try {

        // run any pre-package tasks
        await runTasks("pre-package", version, config.prePackageTasks || [], config);

        // run any package tasks
        await runTasks("package", version, config.packageTasks || [], config);

        // run any post-package tasks
        await runTasks("post-package", version, config.postPackageTasks || [], config);

    } catch (e) {

        log(`${colors.bgRed(" ")} ${colors.bold(colors.red(`Packaging error`))}.`);
        log(`${colors.bgRed(" ")} ${colors.bold(colors.red("Error:"))} ${colors.bold(colors.white(typeof e === "string" ? e : JSON.stringify(e)))}`);
        throw e;
    }
}

async function runTasks(name: string, version: string, tasks: PackageTask[], config: PackageSchema): Promise<void> {

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
