import { TimelinePipe } from "@pnp/core";
import { BuildTimeline } from "src/build-timeline";
import * as wp from "webpack";

export function Webpack(config: wp.Configuration): TimelinePipe {

    return (instance: BuildTimeline) => {

        instance.on.postPackage(async function (this: BuildTimeline) {

            return new Promise((resolve, reject) => {

                wp(config, (err, stats) => {

                    if (err || stats.hasErrors()) {
                        this.log("Webpack exited with errors", 3);
                        this.log(stats.toString(), 3);
                        return reject(err);
                    }

                    if (stats.hasWarnings()) {
                        this.log("Webpack exited with warnings", 2);
                        this.log(stats.toString(), 2);
                    }

                    resolve();
                });
            });
        });
    }
}
