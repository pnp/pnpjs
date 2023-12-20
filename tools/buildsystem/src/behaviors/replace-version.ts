import { TimelinePipe } from "@pnp/core";
import { resolve } from "path";
import { BuildTimeline } from "src/build-timeline";
import replace from "replace-in-file";

export function ReplaceVersion(paths: string[], versionMask = /\$\$Version\$\$/ig): TimelinePipe {

    return (instance: BuildTimeline) => {

        instance.on.postBuild(async function (this: BuildTimeline) {

            const { version, target } = this.context;

            this.log(`Replacing package version for target "${target.tsconfigPath}"`, 1);

            const options = {
                files: paths.map(p => resolve(target.resolvedOutDir, p)),
                from: versionMask,
                to: version,
            };
    
            return (<any>replace)(options);
        });

        return instance;
    }
}
