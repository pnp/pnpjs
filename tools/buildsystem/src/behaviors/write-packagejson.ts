import { TimelinePipe } from "@pnp/core";
import { resolve } from "path";
import { BuildTimeline } from "../build-timeline.js";
import importJSON from "../lib/import-json.js";
import buildWriteFile from "../lib/write-file.js";

export function WritePackageJSON(transform?: (p: any) => typeof p): TimelinePipe {

    return (instance: BuildTimeline) => {

        instance.on.postBuild(async function (this: BuildTimeline) {

            const { version, targets } = this.context;

            const promises = [];

            targets[0].packages.forEach((pkg) => {

                let pkgFile = importJSON(resolve(pkg.resolvedPkgSrcRoot, "package.json"));

                this.log(`Updating package version at ${pkgFile} to ${version}`, 1);

                pkgFile.version = version;

                // update our peer dependencies and dependencies placeholder if needed
                for (const key in pkgFile.peerDependencies) {
                    if (pkgFile.peerDependencies[key] === "0.0.0-PLACEHOLDER") {
                        pkgFile.peerDependencies[key] = version;
                    }
                }

                for (const key in pkgFile.dependencies) {
                    if (pkgFile.dependencies[key] === "0.0.0-PLACEHOLDER") {
                        pkgFile.dependencies[key] = version;
                    }
                }

                if (typeof transform === "function") {
                    pkgFile = transform(pkgFile);
                }

                promises.push(buildWriteFile(resolve(pkg.resolvedPkgDistRoot, "package.json"), JSON.stringify(pkgFile, null, 4)));
            });

            await Promise.all(promises);
        });
        
        return instance;
    }
}
