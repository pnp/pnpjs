import {  resolve } from "path";
import { exec } from "child_process";

const webpackPath = resolve("./node_modules/.bin/webpack");

export function webpack(): Promise<void> {

    return new Promise((res, reject) => {

        // exec webpack in the root of the project, the webpack.config.js file handles all configuration
        exec(`${webpackPath}`, (error, stdout) => {

            if (error === null) {
                res();
            } else {
                console.error(error);
                reject(stdout);
            }
        });
    });
}
