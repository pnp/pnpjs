import { TimelinePipe } from "@pnp/core";
import { BuildTimeline } from "../build-timeline.js";
import { readFile  } from "fs/promises";
import buildWriteFile from "../lib/write-file.js";
import { resolve } from "path";

export interface IReplaceVersionOptions {
    versionMask?: string | RegExp;
    pathsResolved?: boolean;
}

export function ReplaceVersion(paths: string[], options: IReplaceVersionOptions): TimelinePipe {

    options = {
        versionMask: /\$\$Version\$\$/img,
        ...options,
    }

    return (instance: BuildTimeline) => {

        instance.on.postBuild(async function (this: BuildTimeline) {

            const { version, target } = this.context;

            this.log(`Replacing package version for target "${target.tsconfigPath}"`, 1);

            paths.forEach(async (path) => {

                const resolvedPath = options?.pathsResolved ? path : resolve(target.resolvedOutDir, path);
                this.log(`Resolving path '${path}' to '${resolvedPath}'.`, 0);
                const file = await readFile(resolve(resolvedPath));
                await buildWriteFile(resolvedPath, file.toString().replace(options.versionMask, version));
            });
        });

        return instance;
    }
}
