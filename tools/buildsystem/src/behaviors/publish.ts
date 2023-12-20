import { TimelinePipe } from "@pnp/core";
import { BuildTimeline } from "src/build-timeline";
// import { exec } from "child_process";

export default function Publish(flags?: string[]): TimelinePipe {

    const stringFlags = flags?.join(" ") || "";

    return (instance: BuildTimeline) => {

        instance.on.publish(async function (this: BuildTimeline) {

            const { target } = this.context;

            const promises: Promise<void>[] = [];

            target.packages.forEach(pkg => {

                promises.push(new Promise((resolve, _reject) => {

                    this.log(`Publishing ${pkg.resolvedPkgDistRoot} with flags ${stringFlags}`);

                    this.log("Would publish here.");
                    resolve();

                    // exec(`npm publish --access public --provenance ${stringFlags}`,
                    //     {
                    //         cwd: pkg.resolvedPkgDistRoot,
                    //     }, (error, _stdout, _stderr) => {

                    //         if (error === null) {
                    //             this.log(`Published ${pkg.resolvedPkgDistRoot} with flags ${stringFlags}`);
                    //             resolve();
                    //         } else {
                    //             this.log(`${error}`, 3);
                    //             reject(error);
                    //         }
                    //     });
                }));
            });

            await Promise.all(promises);
        });
    }
}
