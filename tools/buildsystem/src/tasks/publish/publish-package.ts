import { exec } from "child_process";
import { PublishSchema } from "../../config.js";
import { resolve } from "path";
import getSubDirNames from "../../lib/getSubDirs.js";
import log from "fancy-log";
import colors from "ansi-colors";

export function publishPackage(_version: string, config: PublishSchema): Promise<any> {

    const promises: Promise<void>[] = [];

    config.packageRoots.forEach(packageRoot => {

        const publishRoot = resolve(packageRoot);
        const packageFolders = getSubDirNames(publishRoot);

        for (let i = 0; i < packageFolders.length; i++) {

            promises.push(new Promise((res, reject) => {

                const packagePath = resolve(publishRoot, packageFolders[i]);

                log(`${colors.bgBlue(" ")} Publishing ${packagePath}`);

                exec("npm publish --access public --provenance",
                    {
                        cwd: resolve(publishRoot, packageFolders[i]),
                    }, (error, _stdout, _stderr) => {

                        if (error === null) {
                            log(`${colors.bgGreen(" ")} Published ${packagePath}`);
                            res();
                        } else {
                            console.error(error);
                            reject(error);
                        }
                    });
            }));
        }
    });

    return Promise.all(promises);
}
