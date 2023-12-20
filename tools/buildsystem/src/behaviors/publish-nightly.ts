import { TimelinePipe } from "@pnp/core";
import { BuildTimeline } from "src/build-timeline";
import Publish from "./publish.js";
import { resolve } from "path";
import importJSON from "../lib/import-json.js";
import buildWriteFile from "src/lib/write-file.js";

export default function PublishNightly(flags: string[], nightlyName: "v3nightly" | "v4nightly"): TimelinePipe {

    flags.push("--tag", nightlyName);

    return (instance: BuildTimeline) => {

        // this updates all the package.json versions to the nightly pattern
        instance.on.prePublish(async function (this: BuildTimeline) {

            const { target } = this.context;
            const date = new Date();

            const version = `-${nightlyName}.${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;

            this.log(`Updating nightly package.json version to ${version}`);

            await Promise.all(target.packages.map(pkg => {

                const packageJsonPath = resolve(pkg.resolvedPkgDistRoot, "package.json");
                const packageJson = importJSON(packageJsonPath);
                packageJson.version = version;

                return buildWriteFile(packageJsonPath, JSON.stringify(packageJson, null, 4))
            }));
        });

        // we want to publish
        Publish(flags)(instance);
    }
}
