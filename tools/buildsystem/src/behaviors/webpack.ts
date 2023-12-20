import { TimelinePipe } from "@pnp/core";
import { BuildTimeline } from "src/build-timeline";
import * as wp from "webpack";

export default function Webpack(config: wp.Configuration): TimelinePipe {

    return (instance: BuildTimeline) => {

        instance.on.postPackage(async function (this: BuildTimeline) {

            return new Promise((resolve, reject) => {

                wp(config, (err, stats) => {

                    if (err || stats.hasErrors()) {
                        console.error("Webpack exited with errors");
                        console.error(stats.toString());
                        return reject(err);
                    }

                    if (stats.hasWarnings()) {
                        console.warn("Webpack exited with warnings");
                        console.warn(stats.toString());
                    }

                    resolve();
                });
            });
        });
    }
}
