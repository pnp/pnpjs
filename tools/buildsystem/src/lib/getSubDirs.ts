// after: https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
import { lstatSync, readdirSync } from "fs";
import { join } from "path";

const isDirectory = (root, dirName) => lstatSync(join(root, dirName)).isDirectory();

export default (root): string[] => readdirSync(root).filter(dirName => isDirectory(root, dirName));
