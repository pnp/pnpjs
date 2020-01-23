import { exec } from "child_process";
import { PublishSchema } from "../../config";
const colors = require("ansi-colors");
import * as path from "path";
import getSubDirNames from "../../lib/getSubDirectoryNames";
const log = require("fancy-log");

export function publishBetaPackage(_version: string, config: PublishSchema): Promise<any> {

    const promises: Promise<void>[] = [];

    config.packageRoots.forEach(packageRoot => {

        const publishRoot = path.resolve(packageRoot);
        const packageFolders = getSubDirNames(publishRoot).filter(name => name !== "documentation");

        for (let i = 0; i < packageFolders.length; i++) {

            promises.push(new Promise((resolve, reject) => {

                const packagePath = path.resolve(publishRoot, packageFolders[i]);

                log(`${colors.bgBlue(" ")} Publishing BETA ${packagePath}`);

                exec("npm publish --tag beta --access public",
                    {
                        cwd: path.resolve(publishRoot, packageFolders[i]),
                    }, (error, stdout, _stderr) => {

                        if (error === null) {
                            log(`${colors.bgGreen(" ")} Published BETA ${packagePath}`);
                            resolve();
                        } else {
                            console.error(error);
                            reject(stdout);
                        }
                    });
            }));
        }
    });

    return Promise.all(promises);
}
