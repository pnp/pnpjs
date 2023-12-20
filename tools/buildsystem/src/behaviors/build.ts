import { TimelinePipe } from "@pnp/core";
import { exec } from "child_process";
import { resolve } from "path";
import { BuildTimeline } from "src/build-timeline";

const tscPath = resolve("./node_modules/.bin/tsc");

export default function Build(): TimelinePipe {

    return (instance: BuildTimeline) => {

        instance.on.build(async function (this: BuildTimeline) {

            const { tsconfigPath } = this.context.target;

            this.log(`Starting Build for target "${tsconfigPath}"`, 1);

            return new Promise<void>((res, reject) => {

                exec(`${tscPath} -b ${tsconfigPath}`, (error, stdout, _stderr) => {

                    if (error === null) {
                        this.log(`Completing Build for target "${tsconfigPath}"`, 1);
                        res();
                    } else {
                        this.log(`Error in Build for target "${tsconfigPath}"`, 3);
                        reject(stdout);
                    }
                });
            });
        });
    }
}
