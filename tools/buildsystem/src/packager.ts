import colors from "ansi-colors";
import log from "fancy-log";

import { PackageSchema, PackageTargetMap, PrePackageTask, PostPackageTask } from "./config.js";

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
        await runTasks("pre-package", config.prePackageTasks || []);

        // run any package tasks
        config.packageTargets.forEach(async target => {
            await runTargetTasks("package", version, target);
        });

        // run any post-package tasks
        await runTasks("post-package", config.postPackageTasks || []);

    } catch (e) {

        log(`${colors.bgRed(" ")} ${colors.bold(colors.red("Packaging error"))}.`);
        log(`${colors.bgRed(" ")} ${colors.bold(colors.red("Error:"))} ${colors.bold(colors.white(typeof e === "string" ? e : JSON.stringify(e)))}`);
        throw e;
    }
}

async function runTargetTasks(name: string, version: string, target: PackageTargetMap): Promise<void> {

    log(`${colors.bgBlue(" ")} Beginning (${target.tasks.length}) ${name} tasks for target '${target.target}'.`);
    for (let i = 0; i < target.tasks.length; i++) {

        const task = target.tasks[i];

        if (typeof task === "undefined" || task === null) {
            continue;
        }

        await task(target, version);
    }
    log(`${colors.bgGreen(" ")} Finished ${name} tasks.`);
}

async function runTasks(name: string, tasks: PrePackageTask[] | PostPackageTask[]): Promise<void> {

    log(`${colors.bgBlue(" ")} Beginning (${tasks.length}) ${name} tasks.`);
    for (let i = 0; i < tasks.length; i++) {

        const task = tasks[i];

        if (typeof task === "undefined" || task === null) {
            continue;
        }

        await task();
    }
    log(`${colors.bgGreen(" ")} Finished ${name} tasks.`);
}
