import { TimelinePipe } from "@pnp/core";
import { BuildTimeline } from "../build-timeline.js";
import { readFile  } from "fs/promises";
import buildWriteFile from "src/lib/write-file.js";
import { resolve } from "path";

export function ReplaceVersion(paths: string[], versionMask = /\$\$Version\$\$/ig): TimelinePipe {

    return (instance: BuildTimeline) => {

        instance.on.postBuild(async function (this: BuildTimeline) {

            const { version, target } = this.context;

            this.log(`Replacing package version for target "${target.tsconfigPath}"`, 1);

            paths.forEach(async (path) => {

                const file = await readFile(resolve(path));

                const txt = file.toString();

                txt.replace(versionMask, version);

                await buildWriteFile(path, txt);
            });
        });

        return instance;
    }
}
