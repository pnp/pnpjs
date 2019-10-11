"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const child_process_1 = require("child_process");
const webpackPath = path_1.resolve("./node_modules/.bin/webpack");
function webpack() {
    return new Promise((res, reject) => {
        child_process_1.exec(`${webpackPath}`, (error, stdout) => {
            if (error === null) {
                res();
            }
            else {
                console.error(error);
                reject(stdout);
            }
        });
    });
}
exports.webpack = webpack;
//# sourceMappingURL=webpack.js.map