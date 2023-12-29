import { TimelinePipe } from "@pnp/core";
import { BuildTimeline } from "src/build-timeline";
import { Publish } from "./publish.js";
import { resolve } from "path";
import importJSON from "../lib/import-json.js";
import buildWriteFile from "../lib/write-file.js";

/**
 * Does a nightly publish after setting the nightly version and updating deps
 * 
 * @param flags Flags supplied to tsc (--tag is automatically applied)
 * @param nightlyName Tag and version string used to identify this build
 * @returns 
 */
export function PublishNightly(flags: string[], nightlyName: "v3nightly" | "v4nightly"): TimelinePipe {

    flags.push("--tag", nightlyName);

    return (instance: BuildTimeline) => {

        // this updates all the package.json versions to the nightly pattern
        instance.on.prePublish(async function (this: BuildTimeline) {

            const { targets } = this.context;
            const date = new Date();

            const versionStr = `-${nightlyName}.${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;

            this.log(`Updating nightly package.json version to ${versionStr}`);

            await Promise.all(targets[0].packages.map(pkg => {

                const packageJsonPath = resolve(pkg.resolvedPkgDistRoot, "package.json");
                const packageJson = importJSON(packageJsonPath);
                packageJson.version += versionStr;

                if (packageJson.dependencies) {
                    const keys = Object.getOwnPropertyNames(packageJson.dependencies);
                    for (let i = 0; i < keys.length; i++) {
                        if (keys[i].startsWith("@pnp")) {
                            packageJson.dependencies[keys[i]] += versionStr;
                        }
                    }
                }

                return buildWriteFile(packageJsonPath, JSON.stringify(packageJson, null, 4))
            }));
        });

        // we want to publish
        Publish(flags)(instance);

        return instance;
    }
}
