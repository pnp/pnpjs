import { TimelinePipe } from "@pnp/core";
import { resolve } from "path";
import { BuildTimeline } from "../build-timeline.js";
import buildWriteFile from "../lib/write-file.js";

/**
 * Because the TypeScript team will not make a simple change we have to add package.json's to each package's module sub/folder to ensure the resolution works with just *.js extensions.
 * 
 * It is stupid this has to exist, but well here we are.
 * @returns 
 */
export function CreateResolutionPackageFiles(): TimelinePipe {

    return (instance: BuildTimeline) => {

        instance.on.package(async function (this: BuildTimeline) {            

            this.log("Creating Resolution package.json files.", 1);

            const { target } = this.context;

            const promises = [];

            target.packages.forEach((pkg) => {

                const filePath = resolve(pkg.resolvedPkgDistRoot, pkg.relativePkgDistModulePath, "package.json");

                let pkgFile = <any>{
                    name: pkg.name,
                    type: /commonjs/i.test(target.parsedTSConfig.compilerOptions.module) ? "commonjs" : "module",
                }

                this.log(`Writing module resolution package.json for ${filePath} as ${pkgFile.type}`, 0);

                promises.push(buildWriteFile(filePath, JSON.stringify(pkgFile)));
            });

            await Promise.all(promises);
        });

        return instance;
    }
}
