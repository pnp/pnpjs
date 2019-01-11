// after: https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
const { lstatSync, readdirSync } = require("fs");
const { join } = require("path");

const isDirectory = (root, dirName) => lstatSync(join(root, dirName)).isDirectory();

export default (root) => readdirSync(root).filter(dirName => isDirectory(root, dirName));