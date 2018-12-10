declare var require: (s: string) => any;
const path = require("path");

import { exec } from "child_process";

const rollupPath = path.resolve("./node_modules/.bin/rollup");

export function rollup() {

    return new Promise((resolve, reject) => {

        // exec webpack in the root of the project, the webpack.config.js file handles all configuration
        exec(`${rollupPath} -c`, (error, stdout) => {

            if (error === null) {
                resolve();
            } else {
                console.error(error);
                reject(stdout);
            }
        });
    });
}
