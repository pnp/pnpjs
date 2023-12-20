import { TimelinePipe } from "@pnp/core";
import { BuildTimeline } from "../build-timeline.js";
import { readFile  } from "fs/promises";
import buildWriteFile from "../lib/write-file.js";
import { resolve } from "path";

export function ReplaceVersion(paths: string[], versionMask = /\$\$Version\$\$/img): TimelinePipe {

    return (instance: BuildTimeline) => {

        instance.on.postBuild(async function (this: BuildTimeline) {

            const { version, target } = this.context;

            this.log(`Replacing package version for target "${target.tsconfigPath}"`, 1);

            paths.forEach(async (path) => {

                const resolvedPath = resolve(target.resolvedOutDir, path);
                this.log(`Resolving path '${path}' to '${resolvedPath}'.`, 0);
                const file = await readFile(resolve(resolvedPath));
                await buildWriteFile(resolvedPath, file.toString().replace(versionMask, version));
            });
        });

        return instance;
    }
}
