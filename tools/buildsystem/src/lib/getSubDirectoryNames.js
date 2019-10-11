"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { lstatSync, readdirSync } = require("fs");
const { join } = require("path");
const isDirectory = (root, dirName) => lstatSync(join(root, dirName)).isDirectory();
exports.default = (root) => readdirSync(root).filter(dirName => isDirectory(root, dirName));
//# sourceMappingURL=getSubDirectoryNames.js.map