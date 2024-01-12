import { TimelinePipe } from "@pnp/core";
import { exec } from "child_process";
import { resolve } from "path";
import { BuildTimeline } from "../build-timeline.js";

const tscPath = resolve("./node_modules/.bin/tsc");

/**
 * Executes a tsc build based on the current context target
 * @returns 
 */
export function Build(flags?: string[]): TimelinePipe {

    const stringFlags = flags?.join(" ") || "";

    return (instance: BuildTimeline) => {

        instance.on.build(async function (this: BuildTimeline) {

            const { targets } = this.context;

            await Promise.all(targets.map((target) => {

                this.log(`Starting Build for target "${target.tsconfigPath}"`, 1);

                return new Promise<void>((res, reject) => {

                    exec(`${tscPath} -b ${target.tsconfigPath} ${stringFlags}`, (error, stdout, _stderr) => {
    
                        if (error === null) {
                            this.log(`Completing Build for target "${target.tsconfigPath}"`, 1);
                            res();
                        } else {
                            this.log(`Error in Build for target "${target.tsconfigPath}"`, 3);
                            reject(stdout);
                        }
                    });
                });
            }));
        });

        return instance;
    }
}
