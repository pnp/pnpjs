declare var require: (s: string) => any;
const colors = require("ansi-colors");
const log = require("fancy-log");

import { PublishSchema, PublishTask } from "./tasks/publish/schema";

/**
 * Engine function to process publish files
 * 
 * @param version The version to be written into all the published packages
 * @param config The build configuration object
 * @param callback (err?) => void
 */
export async function publisher(version: string, config: PublishSchema): Promise<void> {


    try {

        // run any pre-publish tasks
        await runTasks("pre-publish", version, config.prePublishTasks || [], config);

        // run any publish tasks
        await runTasks("publish", version, config.publishTasks || [], config);

        // run any post-publish tasks
        await runTasks("post-publish", version, config.postPublishTasks || [], config);

    } catch (e) {

        log(`${colors.bgRed(" ")} ${colors.bold(colors.red(`Publishing error`))}.`);
        log(`${colors.bgRed(" ")} ${colors.bold(colors.red("Error:"))} ${colors.bold(colors.white(typeof e === "string" ? e : JSON.stringify(e)))}`);
        throw e;
    }
}

async function runTasks(name: string, version: string, tasks: PublishTask[], config: PublishSchema): Promise<void> {

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
