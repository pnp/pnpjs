import { TimelinePipe } from "@pnp/core";
import { BuildTimeline } from "src/build-timeline";
import { exec } from "child_process";

export function Publish(flags?: string[]): TimelinePipe {

    const stringFlags = flags?.join(" ") || "";

    return (instance: BuildTimeline) => {

        instance.on.publish(async function (this: BuildTimeline) {

            const { targets } = this.context;

            const promises: Promise<void>[] = [];

            targets[0].packages.forEach(pkg => {

                promises.push(new Promise((resolve, reject) => {

                    this.log(`Publishing ${pkg.resolvedPkgDistRoot} with flags ${stringFlags}`);

                    exec(`npm publish ${stringFlags}`,
                        {
                            cwd: pkg.resolvedPkgDistRoot,
                        }, (error, _stdout, _stderr) => {

                            if (error === null) {
                                this.log(`Published ${pkg.resolvedPkgDistRoot} with flags ${stringFlags}`);
                                resolve();
                            } else {
                                this.log(`${error}`, 3);
                                reject(error);
                            }
                        });
                }));
            });

            await Promise.all(promises);
        });

        return instance;
    }
}
