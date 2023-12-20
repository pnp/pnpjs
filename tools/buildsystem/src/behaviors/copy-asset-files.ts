import { TimelinePipe } from "@pnp/core";
import { BuildTimeline } from "../build-timeline.js";
import globby from "globby";
import { resolve } from "path";
import buildCopyFile from "../lib/copy-file.js";

/**
 * Copies files from a single location and to each project's dist folder
 * @param pattern glob patterns for files (see https://www.npmjs.com/package/globby)
 * @returns 
 */
export function CopyAssetFiles(path: string, pattern: string[]): TimelinePipe {

    const stringPattern = JSON.stringify(pattern);

    return (instance: BuildTimeline) => {

        instance.on.package(async function (this: BuildTimeline) {

            const resolvedPath = resolve(path);

            this.log(`Starting CopyAssetFiles with pattern ${stringPattern} in path '${resolvedPath}'`);

            const temp = await (<any>globby)(pattern, {
                cwd: resolvedPath,
            });

            this.log(`CopyAssetFiles found ${temp.length} files for pattern ${stringPattern} in path '${resolvedPath}'`);

            const files = await this.context.target.packages.reduce((p, pkg) => {

                return p.then(async (a) => {

                    a.push(...temp.map(t => ({
                        src: resolve(path, t),
                        dest: resolve(pkg.resolvedPkgDistRoot, t),
                    })));

                    return a;
                });

            }, Promise.resolve<{ src: string, dest: string }[]>([]));

            await Promise.all(files.map(f => buildCopyFile(f.src, f.dest)));
                
            this.log(`Completed CopyAssetFiles.`);
        });
    }


}