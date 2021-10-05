import { PublishSchema } from "../../config.js";
const colors = require("ansi-colors");
import * as path from "path";
import getSubDirNames from "../../lib/getSubDirectoryNames.js";
const log = require("fancy-log");
import { writeFileSync } from "fs";

export function updateV3NightlyVersion(_version: string, config: PublishSchema): Promise<any> {

    const promises: Promise<void>[] = [];

    config.packageRoots.forEach(packageRoot => {

        const publishRoot = path.resolve(packageRoot);
        const packageFolders = getSubDirNames(publishRoot).filter(name => name !== "documentation");
        const date = new Date();
        const versionStr = `-v3nightly.${date.getFullYear()}${date.getMonth().toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;

        for (let i = 0; i < packageFolders.length; i++) {

            promises.push(new Promise((resolve, reject) => {

                const packagePath = path.resolve(publishRoot, packageFolders[i]);
                const packageJsonPath = path.join(packagePath, "package.json");

                import(packageJsonPath).then(packageJson => {

                    try {

                        log(`${colors.bgBlue(" ")} Updating package.json version ${packagePath} to ${versionStr}`);

                        packageJson.version += versionStr;

                        if (packageJson.dependencies) {
                            const keys = Object.getOwnPropertyNames(packageJson.dependencies);
                            for (let i = 0; i < keys.length; i++) {
                                if (keys[i].startsWith("@pnp")) {
                                    packageJson.dependencies[keys[i]] += versionStr;
                                }
                            }
                        }

                        writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

                        resolve();

                    } catch (e) {

                        reject(e);
                    }
                });
            }));
        }
    });

    return Promise.all(promises);
}
