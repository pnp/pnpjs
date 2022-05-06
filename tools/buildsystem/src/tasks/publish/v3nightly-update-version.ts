import { PublishSchema } from "../../config.js";
import { join, resolve } from "path";
import getSubDirNames from "../../lib/getSubDirs.js";
import { writeFileSync } from "fs";
import log from "fancy-log";
import colors from "ansi-colors";
import importJSON from "../../lib/importJSON.js";

export function updateV3NightlyVersion(_version: string, config: PublishSchema): Promise<any> {

    const promises: Promise<void>[] = [];

    config.packageRoots.forEach(packageRoot => {

        const publishRoot = resolve(packageRoot);
        const packageFolders = getSubDirNames(publishRoot).filter(name => name !== "documentation");
        const date = new Date();
        const versionStr = `-v3nightly.${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;

        for (let i = 0; i < packageFolders.length; i++) {

            promises.push(new Promise((res, reject) => {

                const packagePath = resolve(publishRoot, packageFolders[i]);
                const packageJsonPath = join(packagePath, "package.json");
                const packageJson = importJSON(packageJsonPath);

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

                    res();

                } catch (e) {

                    reject(e);
                }
            }));
        }
    });

    return Promise.all(promises);
}
