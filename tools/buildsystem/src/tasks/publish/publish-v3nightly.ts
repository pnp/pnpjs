import { exec } from "child_process";
import { PublishSchema } from "../../config.js";
import { resolve } from "path";
import getSubDirNames from "../../lib/getSubDirs.js";
import log from "fancy-log";
import colors from "ansi-colors";

export function publishV3Nightly(_version: string, config: PublishSchema): Promise<any> {

    const promises: Promise<void>[] = [];

    config.packageRoots.forEach(packageRoot => {

        const publishRoot = resolve(packageRoot);
        const packageFolders = getSubDirNames(publishRoot).filter(name => name !== "documentation");

        for (let i = 0; i < packageFolders.length; i++) {

            promises.push(new Promise((res, reject) => {

                const packagePath = resolve(publishRoot, packageFolders[i]);

                log(`${colors.bgBlue(" ")} Publishing v3 NIGHTLY ${packagePath}`);

                exec("npm publish --tag v3nightly --access public --provenance",
                    {
                        cwd: resolve(publishRoot, packageFolders[i]),
                    }, (error, stdout, _stderr) => {

                        if (error === null) {
                            log(`${colors.bgGreen(" ")} Published v3 NIGHTLY ${packagePath}`);
                            res();
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
